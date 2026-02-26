import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// تعويض __dirname في ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, "build")));

// Handle all routes by serving index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
