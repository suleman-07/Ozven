const {
  normalizeMultipartBody,
  validateProductInput,
} = require("./product.validation");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.service");

async function listProducts(req, res) {
  try {
    const result = await getProducts({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search || "",
      categoryId: req.query.categoryId || "",
      subcategoryId: req.query.subcategoryId || "",
      status: req.query.status || "",
      sort: req.query.sort || "desc",
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

async function getProduct(req, res) {
  try {
    const product = await getProductById(req.params.id);

    return res.status(200).json({
      success: true,
      product,
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

async function createProductHandler(req, res) {
  try {
    const payload = normalizeMultipartBody(req.body);
    const { error, value } = validateProductInput(payload);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const product = await createProduct(value, req.files || {});

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Failed to create product" : error.message,
    });
  }
}

async function updateProductHandler(req, res) {
  try {
    const payload = normalizeMultipartBody(req.body);
    const { error, value } = validateProductInput(payload);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const product = await updateProduct(req.params.id, value, req.files || {});

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Failed to update product" : error.message,
    });
  }
}

async function deleteProductHandler(req, res) {
  try {
    await deleteProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
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
      message: "Failed to delete product",
    });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
};
