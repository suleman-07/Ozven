const { validateQuoteInput } = require("./quote.validation");
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("./quote.service");

async function listQuotes(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const productId = req.query.productId || "";
    const sort = req.query.sort || "desc";

    const result = await getQuotes({ page, limit, search, productId, sort });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quote requests",
    });
  }
}

async function getQuote(req, res) {
  try {
    const quote = await getQuoteById(req.params.id);

    return res.status(200).json({
      success: true,
      quote,
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
      message: "Failed to fetch quote request",
    });
  }
}

async function createQuoteHandler(req, res) {
  try {
    const { error, value } = validateQuoteInput(req.body);

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: details[0],
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

async function updateQuoteHandler(req, res) {
  try {
    const { error, value } = validateQuoteInput(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const quote = await updateQuote(req.params.id, {
      ...value,
      productId: value.productId || null,
    });

    return res.status(200).json({
      success: true,
      message: "Quote request updated successfully",
      quote,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Failed to update quote request" : error.message,
    });
  }
}

async function deleteQuoteHandler(req, res) {
  try {
    await deleteQuote(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Quote request deleted successfully",
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
      message: "Failed to delete quote request",
    });
  }
}

module.exports = {
  listQuotes,
  getQuote,
  createQuoteHandler,
  updateQuoteHandler,
  deleteQuoteHandler,
};
