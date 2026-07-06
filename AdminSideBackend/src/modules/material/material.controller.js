const { validateMaterialInput } = require("./material.validation");
const {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("./material.service");

async function listMaterials(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";

    const result = await getMaterials({ page, limit, search, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch materials",
    });
  }
}

async function getMaterial(req, res) {
  try {
    const material = await getMaterialById(req.params.id);

    return res.status(200).json({
      success: true,
      material,
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
      message: "Failed to fetch material",
    });
  }
}

async function createMaterialHandler(req, res) {
  try {
    const { error, value } = validateMaterialInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const material = await createMaterial(value.name);

    return res.status(201).json({
      success: true,
      message: "Material created successfully",
      material,
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
      message: "Failed to create material",
    });
  }
}

async function updateMaterialHandler(req, res) {
  try {
    const { error, value } = validateMaterialInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const material = await updateMaterial(req.params.id, value.name);

    return res.status(200).json({
      success: true,
      message: "Material updated successfully",
      material,
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
      message: "Failed to update material",
    });
  }
}

async function deleteMaterialHandler(req, res) {
  try {
    await deleteMaterial(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
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
      message: "Failed to delete material",
    });
  }
}

module.exports = {
  listMaterials,
  getMaterial,
  createMaterialHandler,
  updateMaterialHandler,
  deleteMaterialHandler,
};
