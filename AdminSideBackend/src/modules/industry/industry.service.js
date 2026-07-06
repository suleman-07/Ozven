const prisma = require("../../prisma/client");

async function getIndustries({ page = 1, limit = 10, search = "", sort = "desc" }) {
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

  const [industries, total] = await Promise.all([
    prisma.industry.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    }),
    prisma.industry.count({ where }),
  ]);

  return {
    industries,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getIndustryById(id) {
  const industry = await prisma.industry.findUnique({
    where: { id },
  });

  if (!industry) {
    const error = new Error("Industry not found");
    error.statusCode = 404;
    throw error;
  }

  return industry;
}

async function createIndustry(name) {
  const existingIndustry = await prisma.industry.findUnique({
    where: { name },
  });

  if (existingIndustry) {
    const error = new Error("Industry already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.industry.create({
    data: { name },
  });
}

async function updateIndustry(id, name) {
  const existingIndustry = await prisma.industry.findUnique({
    where: { id },
  });

  if (!existingIndustry) {
    const error = new Error("Industry not found");
    error.statusCode = 404;
    throw error;
  }

  const duplicateIndustry = await prisma.industry.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (duplicateIndustry) {
    const error = new Error("Industry already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.industry.update({
    where: { id },
    data: { name },
  });
}

async function deleteIndustry(id) {
  const existingIndustry = await prisma.industry.findUnique({
    where: { id },
  });

  if (!existingIndustry) {
    const error = new Error("Industry not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.industry.delete({
    where: { id },
  });
}

module.exports = {
  getIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
};
