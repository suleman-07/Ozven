const { validateProductInput } = require("./product.validation");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.service");

async function listProducts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const categoryId = req.query.categoryId || "";
    const industryId = req.query.industryId || "";
    const materialId = req.query.materialId || "";
    const finishId = req.query.finishId || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "desc";

    const result = await getProducts({
      page,
      limit,
      search,
      categoryId,
      industryId,
      materialId,
      finishId,
      status,
      sort,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
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
    const { error, value } = validateProductInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const product = await createProduct(value);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
}

async function updateProductHandler(req, res) {
  try {
    const { error, value } = validateProductInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const product = await updateProduct(req.params.id, value);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
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
      message: "Failed to update product",
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
