const prisma = require("../../prisma/client");

const categoryInclude = {
  subcategories: {
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  },
};

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function assertUniqueSubcategoryNames(subcategories) {
  const names = subcategories.map(({ name }) => name.toLocaleLowerCase());

  if (new Set(names).size !== names.length) {
    throw createHttpError("Subcategory names must be unique within a category", 409);
  }
}

function handleUniqueConstraint(error, fallbackMessage) {
  if (error?.code === "P2002") {
    throw createHttpError(fallbackMessage, 409);
  }

  throw error;
}

function mapCategory(category) {
  const subcategories = category.subcategories || [];
  const productCount = subcategories.reduce(
    (total, subcategory) => total + (subcategory._count?.products || 0),
    0
  );

  return {
    ...category,
    productCount,
    _count: {
      products: productCount,
    },
  };
}

async function getCategories({ page = 1, limit = 10, search = "", sort = "desc" }) {
  const currentPage = Math.max(1, Number(page) || 1);
  const take = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * take;
  const normalizedSearch = String(search).trim();

  const where = normalizedSearch
    ? {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            subcategories: {
              some: {
                name: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      include: categoryInclude,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories: categories.map(mapCategory),
    pagination: {
      page: currentPage,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
    },
  };
}

async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: categoryInclude,
  });

  if (!category) {
    throw createHttpError("Category not found", 404);
  }

  return mapCategory(category);
}

async function createCategory({ name, subcategories = [] }) {
  assertUniqueSubcategoryNames(subcategories);

  try {
    const category = await prisma.category.create({
      data: {
        name,
        subcategories: subcategories.length
          ? {
              create: subcategories.map((subcategory) => ({
                name: subcategory.name,
              })),
            }
          : undefined,
      },
      include: categoryInclude,
    });

    return mapCategory(category);
  } catch (error) {
    handleUniqueConstraint(error, "Category or subcategory already exists");
  }
}

async function updateCategory(id, { name, subcategories = [] }) {
  assertUniqueSubcategoryNames(subcategories);

  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: { subcategories: true },
  });
  if (!existingCategory) {
    throw createHttpError("Category not found", 404);
  }

  const existingIds = new Set(existingCategory.subcategories.map(({ id: subcategoryId }) => subcategoryId));
  const submittedIds = subcategories
    .map(({ id: subcategoryId }) => subcategoryId)
    .filter(Boolean);

  if (submittedIds.some((subcategoryId) => !existingIds.has(subcategoryId))) {
    throw createHttpError("One or more subcategories do not belong to this category", 400);
  }

  const idsToDelete = existingCategory.subcategories
    .filter(({ id: subcategoryId }) => !submittedIds.includes(subcategoryId))
    .map(({ id: subcategoryId }) => subcategoryId);

  try {
    return await prisma.$transaction(async (transaction) => {
      if (idsToDelete.length) {
        await transaction.subcategory.deleteMany({
          where: {
            categoryId: id,
            id: { in: idsToDelete },
          },
        });
      }

      for (const subcategory of subcategories) {
        if (subcategory.id) {
          await transaction.subcategory.update({
            where: { id: subcategory.id },
            data: { name: subcategory.name },
          });
        } else {
          await transaction.subcategory.create({
            data: {
              name: subcategory.name,
              categoryId: id,
            },
          });
        }
      }

      return mapCategory(
        await transaction.category.update({
          where: { id },
          data: { name },
          include: categoryInclude,
        })
      );
    });
  } catch (error) {
    handleUniqueConstraint(error, "Category or subcategory already exists");
  }
}

async function deleteCategory(id) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
    },
  });

  if (!existingCategory) {
    throw createHttpError("Category not found", 404);
  }

  const productCount = existingCategory.subcategories.reduce(
    (total, subcategory) => total + subcategory._count.products,
    0
  );

  if (productCount > 0) {
    throw createHttpError(
      "Category cannot be deleted while products are assigned to its subcategories",
      409
    );
  }

  return prisma.category.delete({
    where: { id },
  });
}

async function createSubcategory(categoryId, { name }) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw createHttpError("Category not found", 404);
  }

  try {
    return await prisma.subcategory.create({
      data: { name, categoryId },
    });
  } catch (error) {
    handleUniqueConstraint(error, "Subcategory already exists in this category");
  }
}

async function updateSubcategory(categoryId, subcategoryId, { name }) {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      id: subcategoryId,
      categoryId,
    },
  });

  if (!subcategory) {
    throw createHttpError("Subcategory not found", 404);
  }

  try {
    return await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { name },
    });
  } catch (error) {
    handleUniqueConstraint(error, "Subcategory already exists in this category");
  }
}

async function deleteSubcategory(categoryId, subcategoryId) {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      id: subcategoryId,
      categoryId,
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!subcategory) {
    throw createHttpError("Subcategory not found", 404);
  }

  if (subcategory._count.products > 0) {
    throw createHttpError(
      "Subcategory cannot be deleted while products are assigned to it",
      409
    );
  }

  return prisma.subcategory.delete({
    where: { id: subcategoryId },
  });
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
