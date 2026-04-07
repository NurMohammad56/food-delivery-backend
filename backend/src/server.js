import dotenv from "dotenv";
import connectDB from "./config/database.config.js";
import app from "./app.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log("=".repeat(50));
});

export default app;
