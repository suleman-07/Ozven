const prisma = require("../../prisma/client");

async function getMaterials({ page = 1, limit = 10, search = "", sort = "desc" }) {
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

  const [materials, total] = await Promise.all([
    prisma.material.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    }),
    prisma.material.count({ where }),
  ]);

  return {
    materials,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getMaterialById(id) {
  const material = await prisma.material.findUnique({
    where: { id },
  });

  if (!material) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  return material;
}

async function createMaterial(name) {
  const existingMaterial = await prisma.material.findUnique({
    where: { name },
  });

  if (existingMaterial) {
    const error = new Error("Material already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.material.create({
    data: { name },
  });
}

async function updateMaterial(id, name) {
  const existingMaterial = await prisma.material.findUnique({
    where: { id },
  });

  if (!existingMaterial) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  const duplicateMaterial = await prisma.material.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (duplicateMaterial) {
    const error = new Error("Material already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.material.update({
    where: { id },
    data: { name },
  });
}

async function deleteMaterial(id) {
  const existingMaterial = await prisma.material.findUnique({
    where: { id },
  });

  if (!existingMaterial) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.material.delete({
    where: { id },
  });
}

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
