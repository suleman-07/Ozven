const prisma = require("../../prisma/client");

async function getBoxStyles({ page = 1, limit = 10, search = "", sort = "desc" }) {
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

  const [boxStyles, total] = await Promise.all([
    prisma.boxStyle.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    }),
    prisma.boxStyle.count({ where }),
  ]);

  return {
    boxStyles,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getBoxStyleById(id) {
  const boxStyle = await prisma.boxStyle.findUnique({
    where: { id },
  });

  if (!boxStyle) {
    const error = new Error("Box style not found");
    error.statusCode = 404;
    throw error;
  }

  return boxStyle;
}

async function createBoxStyle(name) {
  const existingBoxStyle = await prisma.boxStyle.findUnique({
    where: { name },
  });

  if (existingBoxStyle) {
    const error = new Error("Box style already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.boxStyle.create({
    data: { name },
  });
}

async function updateBoxStyle(id, name) {
  const existingBoxStyle = await prisma.boxStyle.findUnique({
    where: { id },
  });

  if (!existingBoxStyle) {
    const error = new Error("Box style not found");
    error.statusCode = 404;
    throw error;
  }

  const duplicateBoxStyle = await prisma.boxStyle.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (duplicateBoxStyle) {
    const error = new Error("Box style already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.boxStyle.update({
    where: { id },
    data: { name },
  });
}

async function deleteBoxStyle(id) {
  const existingBoxStyle = await prisma.boxStyle.findUnique({
    where: { id },
  });

  if (!existingBoxStyle) {
    const error = new Error("Box style not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.boxStyle.delete({
    where: { id },
  });
}

module.exports = {
  getBoxStyles,
  getBoxStyleById,
  createBoxStyle,
  updateBoxStyle,
  deleteBoxStyle,
};
