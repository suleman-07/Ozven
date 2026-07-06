const prisma = require("../../prisma/client");

async function getDashboardData() {
  const [
    totalProducts,
    totalCategories,
    totalIndustries,
    totalMaterials,
    totalFinishes,
    totalBoxStyles,
    totalQuotes,
    latestProducts,
    latestQuotes,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.industry.count(),
    prisma.material.count(),
    prisma.finish.count(),
    prisma.boxStyle.count(),
    prisma.quoteRequest.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        industry: true,
        boxStyle: true,
        material: true,
        finish: true,
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
    totalIndustries,
    totalMaterials,
    totalFinishes,
    totalBoxStyles,
    totalQuotes,
    latestQuotes,
    latestProducts,
  };
}

module.exports = {
  getDashboardData,
};
