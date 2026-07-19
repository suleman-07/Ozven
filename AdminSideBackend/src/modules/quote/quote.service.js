const prisma = require("../../prisma/client");

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getQuotes({ page = 1, limit = 10, search = "", productId = "", sort = "desc" }) {
  const currentPage = Math.max(1, Number(page) || 1);
  const take = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * take;
  const normalizedSearch = String(search).trim();

  const where = {
    ...(normalizedSearch
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { email: { contains: normalizedSearch, mode: "insensitive" } },
            { phone: { contains: normalizedSearch, mode: "insensitive" } },
            { productName: { contains: normalizedSearch, mode: "insensitive" } },
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
      page: currentPage,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
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
    throw createHttpError("Quote request not found", 404);
  }

  return quote;
}

async function createQuote(data) {
  if (data.productId) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true },
    });

    if (!product) {
      throw createHttpError("Selected product was not found", 400);
    }
  }

  return prisma.quoteRequest.create({
    data,
    include: {
      product: true,
    },
  });
}

async function updateQuote(id, data) {
  const existingQuote = await prisma.quoteRequest.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingQuote) {
    throw createHttpError("Quote request not found", 404);
  }

  if (data.productId) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true },
    });

    if (!product) {
      throw createHttpError("Selected product was not found", 400);
    }
  }

  return prisma.quoteRequest.update({
    where: { id },
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
    throw createHttpError("Quote request not found", 404);
  }

  return prisma.quoteRequest.delete({
    where: { id },
  });
}

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
