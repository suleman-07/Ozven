const prisma = require("../../prisma/client");

async function getFinishes({ page = 1, limit = 10, search = "", sort = "desc" }) {
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

  const [finishes, total] = await Promise.all([
    prisma.finish.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    }),
    prisma.finish.count({ where }),
  ]);

  return {
    finishes,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getFinishById(id) {
  const finish = await prisma.finish.findUnique({
    where: { id },
  });

  if (!finish) {
    const error = new Error("Finish not found");
    error.statusCode = 404;
    throw error;
  }

  return finish;
}

async function createFinish(name) {
  const existingFinish = await prisma.finish.findUnique({
    where: { name },
  });

  if (existingFinish) {
    const error = new Error("Finish already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.finish.create({
    data: { name },
  });
}

async function updateFinish(id, name) {
  const existingFinish = await prisma.finish.findUnique({
    where: { id },
  });

  if (!existingFinish) {
    const error = new Error("Finish not found");
    error.statusCode = 404;
    throw error;
  }

  const duplicateFinish = await prisma.finish.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (duplicateFinish) {
    const error = new Error("Finish already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.finish.update({
    where: { id },
    data: { name },
  });
}

async function deleteFinish(id) {
  const existingFinish = await prisma.finish.findUnique({
    where: { id },
  });

  if (!existingFinish) {
    const error = new Error("Finish not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.finish.delete({
    where: { id },
  });
}

module.exports = {
  getFinishes,
  getFinishById,
  createFinish,
  updateFinish,
  deleteFinish,
};
