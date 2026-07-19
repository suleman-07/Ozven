const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/category/category.routes");
const productRoutes = require("./modules/product/product.routes");
const quoteRoutes = require("./modules/quote/quote.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

dotenv.config();

const app = express();

const defaultOrigins = ["http://localhost:3001", "http://localhost:3000"];
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin header) and configured frontends
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Admin backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
