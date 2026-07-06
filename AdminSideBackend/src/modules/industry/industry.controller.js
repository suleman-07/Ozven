const { validateIndustryInput } = require("./industry.validation");
const {
  getIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} = require("./industry.service");

async function listIndustries(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";

    const result = await getIndustries({ page, limit, search, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch industries",
    });
  }
}

async function getIndustry(req, res) {
  try {
    const industry = await getIndustryById(req.params.id);

    return res.status(200).json({
      success: true,
      industry,
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
      message: "Failed to fetch industry",
    });
  }
}

async function createIndustryHandler(req, res) {
  try {
    const { error, value } = validateIndustryInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const industry = await createIndustry(value.name);

    return res.status(201).json({
      success: true,
      message: "Industry created successfully",
      industry,
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
      message: "Failed to create industry",
    });
  }
}

async function updateIndustryHandler(req, res) {
  try {
    const { error, value } = validateIndustryInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const industry = await updateIndustry(req.params.id, value.name);

    return res.status(200).json({
      success: true,
      message: "Industry updated successfully",
      industry,
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
      message: "Failed to update industry",
    });
  }
}

async function deleteIndustryHandler(req, res) {
  try {
    await deleteIndustry(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Industry deleted successfully",
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
      message: "Failed to delete industry",
    });
  }
}

module.exports = {
  listIndustries,
  getIndustry,
  createIndustryHandler,
  updateIndustryHandler,
  deleteIndustryHandler,
};
