const prisma = require("../../prisma/client");

async function getDashboardData() {
  const [totalProducts, totalCategories, totalSubcategories, totalQuotes, latestProducts, latestQuotes] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.subcategory.count(),
      prisma.quoteRequest.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: { displayOrder: "asc" },
            take: 1,
          },
        },
      }),
      prisma.quoteRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
        },
      }),
    ]);

  return {
    totalProducts,
    totalCategories,
    totalSubcategories,
    totalQuotes,
    latestQuotes,
    latestProducts,
  };
}

module.exports = {
  getDashboardData,
};
