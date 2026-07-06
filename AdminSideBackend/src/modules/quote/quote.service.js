const prisma = require("../../prisma/client");

async function getQuotes({ page = 1, limit = 10, search = "", productId = "", sort = "desc" }) {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(productId ? { productId } : {}),
  };

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      include: {
        product: true,
      },
    }),
    prisma.quoteRequest.count({ where }),
  ]);

  return {
    quotes,
    pagination: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

async function getQuoteById(id) {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!quote) {
    const error = new Error("Quote request not found");
    error.statusCode = 404;
    throw error;
  }

  return quote;
}

async function createQuote(data) {
  return prisma.quoteRequest.create({
    data,
    include: {
      product: true,
    },
  });
}

async function deleteQuote(id) {
  const existingQuote = await prisma.quoteRequest.findUnique({
    where: { id },
  });

  if (!existingQuote) {
    const error = new Error("Quote request not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.quoteRequest.delete({
    where: { id },
  });
}

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  deleteQuote,
};
