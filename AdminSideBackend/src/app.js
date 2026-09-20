const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env before any modules that read process.env (Cloudinary, Prisma, JWT).
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const authRoutes = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/category/category.routes");
const productRoutes = require("./modules/product/product.routes");
const quoteRoutes = require("./modules/quote/quote.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const publicRoutes = require("./modules/public/public.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const chatPublicRoutes = require("./modules/chat/chat.public.routes");
const { setupChatStreams } = require("./modules/chat/chat.stream");

const app = express();

const defaultOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];
const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Always keep local defaults so storefront (Vite :5173) still works when
// CORS_ORIGIN is set only to the admin frontend (e.g. :3001).
const corsOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin header) and configured frontends
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      try {
        const { hostname } = new URL(origin);
        if (hostname === "vercel.app" || hostname.endsWith(".vercel.app")) {
          callback(null, true);
          return;
        }

        // Local Vite/dev servers often pick an alternate port (5174, etc.)
        if (
          process.env.NODE_ENV !== "production" &&
          (hostname === "localhost" || hostname === "127.0.0.1")
        ) {
          callback(null, true);
          return;
        }
      } catch {
        // ignore invalid Origin
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
app.use("/api/chat", chatRoutes);
app.use("/api/public/chat", chatPublicRoutes);
app.use("/api/public", publicRoutes);

setupChatStreams(app);

module.exports = app;
