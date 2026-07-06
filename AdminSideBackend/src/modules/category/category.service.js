const prisma = require("../../prisma/client");

async function getCategories({ page = 1, limit = 10, search = "", sort = "desc" }) {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
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
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function createCategory(name) {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: { name },
  });
}

async function updateCategory(id, name) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (duplicateCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.update({
    where: { id },
    data: { name },
  });
}

async function deleteCategory(id) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.category.delete({
    where: { id },
  });
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
