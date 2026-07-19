const { getDashboardData } = require("./dashboard.service");

async function getDashboard(req, res) {
  try {
    const dashboardData = await getDashboardData();

    return res.status(200).json({
      success: true,
      ...dashboardData,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
}

module.exports = {
  getDashboard,
};
