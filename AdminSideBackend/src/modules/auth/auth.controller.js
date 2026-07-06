const { validateLoginPayload } = require("./auth.validation");
const { loginAdmin } = require("./auth.service");

async function getProfile(req, res) {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        id: req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
}

async function login(req, res) {
  try {
    const validation = validateLoginPayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const result = await loginAdmin({
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

module.exports = {
  login,
  getProfile,
};
