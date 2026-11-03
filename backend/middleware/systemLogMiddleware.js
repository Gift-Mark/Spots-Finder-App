import SystemLog from "../models/SystemLog.js";

const excludedLogEndpoints = new Set([
  "GET /api/admin/logs",
  "DELETE /api/admin/logs",
]);

const logApiRequest = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const endpoint = req.path;
    const action = `${req.method} ${endpoint}`;
    if (!endpoint.startsWith("/api/") || excludedLogEndpoints.has(action)) return;

    const statusCode = res.statusCode;
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warning" : "info";
    const message = `${req.method} ${endpoint} returned ${statusCode}`;

    SystemLog.create({
      level,
      action,
      method: req.method,
      endpoint,
      statusCode,
      message,
      userId: req.user?._id || null,
      durationMs: Date.now() - startedAt,
    }).catch((error) => {
      console.error("Failed to persist system activity log:", error.message);
    });
  });

  next();
};

export default logApiRequest;
