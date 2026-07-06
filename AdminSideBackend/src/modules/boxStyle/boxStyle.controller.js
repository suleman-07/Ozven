const { validateBoxStyleInput } = require("./boxStyle.validation");
const {
  getBoxStyles,
  getBoxStyleById,
  createBoxStyle,
  updateBoxStyle,
  deleteBoxStyle,
} = require("./boxStyle.service");

async function listBoxStyles(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";

    const result = await getBoxStyles({ page, limit, search, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch box styles",
    });
  }
}

async function getBoxStyle(req, res) {
  try {
    const boxStyle = await getBoxStyleById(req.params.id);

    return res.status(200).json({
      success: true,
      boxStyle,
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
      message: "Failed to fetch box style",
    });
  }
}

async function createBoxStyleHandler(req, res) {
  try {
    const { error, value } = validateBoxStyleInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const boxStyle = await createBoxStyle(value.name);

    return res.status(201).json({
      success: true,
      message: "Box style created successfully",
      boxStyle,
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
      message: "Failed to create box style",
    });
  }
}

async function updateBoxStyleHandler(req, res) {
  try {
    const { error, value } = validateBoxStyleInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const boxStyle = await updateBoxStyle(req.params.id, value.name);

    return res.status(200).json({
      success: true,
      message: "Box style updated successfully",
      boxStyle,
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
      message: "Failed to update box style",
    });
  }
}

async function deleteBoxStyleHandler(req, res) {
  try {
    await deleteBoxStyle(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Box style deleted successfully",
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
      message: "Failed to delete box style",
    });
  }
}

module.exports = {
  listBoxStyles,
  getBoxStyle,
  createBoxStyleHandler,
  updateBoxStyleHandler,
  deleteBoxStyleHandler,
};
