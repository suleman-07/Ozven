const prisma = require("../../prisma/client");
const { getCategories } = require("../category/category.service");
const { getProducts, getProductBySlug } = require("../product/product.service");
const { createQuote } = require("../quote/quote.service");
const { validatePublicQuoteInput } = require("./public.validation");

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Attach slug + image onto categories/subcategories for the storefront.
 * Subcategory.image is derived from the newest ACTIVE product featuredImage
 * (schema has no dedicated subcategory image column yet).
 */
async function enrichCategoriesForStorefront(categories = []) {
  const subcategoryIds = categories.flatMap((category) =>
    (category.subcategories || []).map((sub) => sub.id)
  );

  const imageBySubcategoryId = {};

  if (subcategoryIds.length) {
    const products = await prisma.product.findMany({
      where: {
        subcategoryId: { in: subcategoryIds },
        status: "ACTIVE",
        featuredImage: { not: null },
      },
      orderBy: { createdAt: "desc" },
      select: {
        subcategoryId: true,
        featuredImage: true,
      },
    });

    for (const product of products) {
      if (!imageBySubcategoryId[product.subcategoryId] && product.featuredImage) {
        imageBySubcategoryId[product.subcategoryId] = product.featuredImage;
      }
    }
  }

  return categories.map((category) => ({
    ...category,
    slug: category.slug || slugify(category.name),
    subcategories: (category.subcategories || []).map((sub) => ({
      ...sub,
      slug: sub.slug || slugify(sub.name),
      // Prefer explicit API image fields if added later; else product thumbnail
      image: sub.image || sub.imageUrl || imageBySubcategoryId[sub.id] || null,
    })),
  }));
}

function withCategorySlug(category) {
  if (!category) return category;
  return {
    ...category,
    slug: category.slug || slugify(category.name),
  };
}

async function listPublicCategories(req, res) {
  try {
    const result = await getCategories({
      page: 1,
      limit: 100,
      search: req.query.search || "",
      sort: req.query.sort || "asc",
    });

    const categories = await enrichCategoriesForStorefront(result.categories);

    return res.status(200).json({
      success: true,
      categories,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

async function listPublicProducts(req, res) {
  try {
    const result = await getProducts({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      search: req.query.search || "",
      categoryId: req.query.categoryId || "",
      subcategoryId: req.query.subcategoryId || "",
      status: "ACTIVE",
      sort: req.query.sort || "desc",
    });

    const products = result.products.map((product) => ({
      ...product,
      subcategory: product.subcategory
        ? {
            ...product.subcategory,
            slug: slugify(product.subcategory.name),
            category: withCategorySlug(product.subcategory.category),
          }
        : product.subcategory,
    }));

    return res.status(200).json({
      success: true,
      products,
      pagination: result.pagination,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

async function getPublicProductBySlug(req, res) {
  try {
    const product = await getProductBySlug(req.params.slug);
    const category = product.subcategory?.category;

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        subcategory: product.subcategory
          ? {
              ...product.subcategory,
              slug: slugify(product.subcategory.name),
              category: withCategorySlug(category),
            }
          : product.subcategory,
      },
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
}

async function createPublicQuote(req, res) {
  try {
    const { error, value } = validatePublicQuoteInput(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const quote = await createQuote({
      ...value,
      productId: value.productId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      quote,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit quote request",
    });
  }
}

module.exports = {
  listPublicCategories,
  listPublicProducts,
  getPublicProductBySlug,
  createPublicQuote,
};
