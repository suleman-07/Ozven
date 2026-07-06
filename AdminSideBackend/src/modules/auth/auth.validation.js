function validateLoginPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      valid: false,
      message: "Invalid request body",
    };
  }

  const { email, password } = payload;

  if (typeof email !== "string" || !email.trim()) {
    return {
      valid: false,
      message: "Email is required",
    };
  }

  if (typeof password !== "string" || !password.trim()) {
    return {
      valid: false,
      message: "Password is required",
    };
  }

  return {
    valid: true,
  };
}

module.exports = {
  validateLoginPayload,
};
