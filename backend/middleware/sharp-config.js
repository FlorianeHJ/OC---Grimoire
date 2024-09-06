const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sharpMiddleware = async (req, res, next) => {
  if (req.file) {
    const inputPath = path.join(__dirname, "../tmp/", req.file.filename);
    const outputPath = path.join(__dirname, "../images/", req.file.filename);

    try {
      sharp.cache(false);
      await sharp(inputPath)
        .resize({ width: 800, height: 600, fit: "inside" })
        .webp({ quality: 80 })
        .toFile(outputPath);

      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'image temporaire:",
            err
          );
        }
      });

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors du traitement de l'image" });
    }
  } else {
    next();
  }
};

module.exports = sharpMiddleware;
