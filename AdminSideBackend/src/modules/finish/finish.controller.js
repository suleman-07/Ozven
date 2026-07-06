const { validateFinishInput } = require("./finish.validation");
const {
  getFinishes,
  getFinishById,
  createFinish,
  updateFinish,
  deleteFinish,
} = require("./finish.service");

async function listFinishes(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";

    const result = await getFinishes({ page, limit, search, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch finishes",
    });
  }
}

async function getFinish(req, res) {
  try {
    const finish = await getFinishById(req.params.id);

    return res.status(200).json({
      success: true,
      finish,
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
      message: "Failed to fetch finish",
    });
  }
}

async function createFinishHandler(req, res) {
  try {
    const { error, value } = validateFinishInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const finish = await createFinish(value.name);

    return res.status(201).json({
      success: true,
      message: "Finish created successfully",
      finish,
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
      message: "Failed to create finish",
    });
  }
}

async function updateFinishHandler(req, res) {
  try {
    const { error, value } = validateFinishInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
      });
    }

    const finish = await updateFinish(req.params.id, value.name);

    return res.status(200).json({
      success: true,
      message: "Finish updated successfully",
      finish,
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
      message: "Failed to update finish",
    });
  }
}

async function deleteFinishHandler(req, res) {
  try {
    await deleteFinish(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Finish deleted successfully",
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
      message: "Failed to delete finish",
    });
  }
}

module.exports = {
  listFinishes,
  getFinish,
  createFinishHandler,
  updateFinishHandler,
  deleteFinishHandler,
};
