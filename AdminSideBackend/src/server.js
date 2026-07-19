const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
