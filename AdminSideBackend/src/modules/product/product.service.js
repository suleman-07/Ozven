const prisma = require("../../prisma/client");

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getProducts({
  page = 1,
  limit = 10,
  search = "",
  categoryId = "",
  industryId = "",
  materialId = "",
  finishId = "",
  status = "",
  sort = "desc",
}) {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const where = {
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(industryId ? { industryId } : {}),
    ...(materialId ? { materialId } : {}),
    ...(finishId ? { finishId } : {}),
    ...(status ? { status } : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      include: {
        category: true,
        industry: true,
        boxStyle: true,
        material: true,
        finish: true,
        images: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      industry: true,
      boxStyle: true,
      material: true,
      finish: true,
      images: true,
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function createProduct(data) {
  const baseSlug = generateSlug(data.name);
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      break;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return prisma.product.create({
    data: {
      ...data,
      slug,
    },
    include: {
      category: true,
      industry: true,
      boxStyle: true,
      material: true,
      finish: true,
      images: true,
    },
  });
}

async function updateProduct(id, data) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  let slug = existingProduct.slug;

  if (data.name && data.name !== existingProduct.name) {
    const baseSlug = generateSlug(data.name);
    slug = baseSlug;
    let suffix = 1;

    while (true) {
      const duplicateProduct = await prisma.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (!duplicateProduct) {
        break;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
    include: {
      category: true,
      industry: true,
      boxStyle: true,
      material: true,
      finish: true,
      images: true,
    },
  });
}

async function deleteProduct(id) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.delete({
    where: { id },
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
