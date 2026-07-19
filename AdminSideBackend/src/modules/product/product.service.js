const prisma = require("../../prisma/client");
const {
  uploadImageBuffer,
  deleteImageByUrl,
  deleteImagesByUrls,
} = require("../../services/cloudinary.service");

const productInclude = {
  subcategory: {
    include: {
      category: true,
    },
  },
  images: {
    orderBy: { displayOrder: "asc" },
  },
};

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function buildUniqueSlug(name, excludeId) {
  const baseSlug = generateSlug(name) || "product";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function assertSubcategoryExists(subcategoryId) {
  const subcategory = await prisma.subcategory.findUnique({
    where: { id: subcategoryId },
    select: { id: true },
  });

  if (!subcategory) {
    throw createHttpError("Subcategory not found", 400);
  }
}

async function getProducts({
  page = 1,
  limit = 10,
  search = "",
  categoryId = "",
  subcategoryId = "",
  status = "",
  sort = "desc",
}) {
  const currentPage = Math.max(1, Number(page) || 1);
  const take = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * take;
  const normalizedSearch = String(search).trim();

  const where = {
    ...(normalizedSearch
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { description: { contains: normalizedSearch, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(subcategoryId ? { subcategoryId } : {}),
    ...(categoryId
      ? {
          subcategory: {
            categoryId,
          },
        }
      : {}),
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
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: currentPage,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
    },
  };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw createHttpError("Product not found", 404);
  }

  return product;
}

async function uploadProductImages(files = {}) {
  const imageFiles = [
    ...(files.images || []),
    ...(files.featuredImage || []),
    ...(files.galleryImages || []),
  ];

  const uploadedUrls = [];

  for (const file of imageFiles) {
    const uploaded = await uploadImageBuffer(file.buffer);
    uploadedUrls.push(uploaded.url);
  }

  return uploadedUrls;
}

async function createProduct(data, files = {}) {
  await assertSubcategoryExists(data.subcategoryId);

  const imageUrls = await uploadProductImages(files);
  const slug = await buildUniqueSlug(data.name);

  try {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || "ACTIVE",
        subcategoryId: data.subcategoryId,
        slug,
        featuredImage: imageUrls[0] || null,
        images: imageUrls.length
          ? {
              create: imageUrls.map((imageUrl, index) => ({
                imageUrl,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw createHttpError("A product with this slug already exists", 409);
    }
    throw error;
  }
}

async function updateProduct(id, data, files = {}) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!existingProduct) {
    throw createHttpError("Product not found", 404);
  }

  await assertSubcategoryExists(data.subcategoryId);

  const removeImageIds = data.removeImageIds || [];
  const imagesToRemove = existingProduct.images.filter((image) =>
    removeImageIds.includes(image.id)
  );

  if (imagesToRemove.length) {
    await deleteImagesByUrls(imagesToRemove.map((image) => image.imageUrl));
    await prisma.productImage.deleteMany({
      where: {
        id: { in: imagesToRemove.map((image) => image.id) },
        productId: id,
      },
    });
  }

  const uploadedUrls = await uploadProductImages(files);

  const remainingImages = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: { displayOrder: "asc" },
  });

  if (uploadedUrls.length) {
    await prisma.productImage.createMany({
      data: uploadedUrls.map((imageUrl, index) => ({
        productId: id,
        imageUrl,
        displayOrder: remainingImages.length + index,
      })),
    });
  }

  const nextImages = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: { displayOrder: "asc" },
  });

  const nextFeaturedImage = nextImages[0]?.imageUrl || null;

  if (
    existingProduct.featuredImage &&
    existingProduct.featuredImage !== nextFeaturedImage &&
    !nextImages.some((image) => image.imageUrl === existingProduct.featuredImage)
  ) {
    await deleteImageByUrl(existingProduct.featuredImage).catch(() => null);
  }

  const slug =
    data.name && data.name !== existingProduct.name
      ? await buildUniqueSlug(data.name, id)
      : existingProduct.slug;

  try {
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || existingProduct.status,
        subcategoryId: data.subcategoryId,
        slug,
        featuredImage: nextFeaturedImage,
      },
      include: productInclude,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw createHttpError("A product with this slug already exists", 409);
    }
    throw error;
  }
}

async function deleteProduct(id) {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!existingProduct) {
    throw createHttpError("Product not found", 404);
  }

  const imageUrls = [
    existingProduct.featuredImage,
    ...existingProduct.images.map((image) => image.imageUrl),
  ];

  await deleteImagesByUrls(imageUrls);

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
