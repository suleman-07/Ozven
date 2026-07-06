const { validateCategoryInput } = require("./category.validation");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./category.service");

async function listCategories(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";

    const result = await getCategories({ page, limit, search, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

async function getCategory(req, res) {
  try {
    const category = await getCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      category,
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
      message: "Failed to fetch category",
    });
  }
}

async function createCategoryHandler(req, res) {
  try {
    const { error, value } = validateCategoryInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const category = await createCategory(value.name);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
}

async function updateCategoryHandler(req, res) {
  try {
    const { error, value } = validateCategoryInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const category = await updateCategory(req.params.id, value.name);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
}

async function deleteCategoryHandler(req, res) {
  try {
    await deleteCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
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
      message: "Failed to delete category",
    });
  }
}

module.exports = {
  listCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};
