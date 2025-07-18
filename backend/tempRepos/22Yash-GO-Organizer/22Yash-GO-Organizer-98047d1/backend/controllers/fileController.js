const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

// Preview file content
exports.getFilePreview = async (req, res) => {
  const { path: filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ message: "Path is required" });
  }

  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.send(content);
  } catch (err) {
    res.status(500).json({ message: "Unable to read file", error: err.message });
  }
};

// Basic impact analysis (who references this file)
exports.getImpactAnalysis = async (req, res) => {
  const { file } = req.query;

  if (!file) return res.status(400).json({ message: "File is required" });

  const repoPath = path.join(__dirname, "..", "..", "repos"); // adjust if your repo path is elsewhere

  glob(`${repoPath}/**/*.js`, {}, (err, files) => {
    if (err) return res.status(500).json({ message: "Error scanning files", error: err });

    const referencedBy = [];

    files.forEach((f) => {
      const content = fs.readFileSync(f, "utf-8");
      if (content.includes(file)) {
        referencedBy.push(f.replace(repoPath + path.sep, ""));
      }
    });

    res.json({
      references: referencedBy.length,
      referencedBy,
    });
  });
};
