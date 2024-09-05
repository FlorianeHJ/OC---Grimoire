const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "tmp");
  },
  filename: (req, file, callback) => {
    let name = Buffer.from(file.originalname, "latin1")
      .toString("utf8")
      .split(" ")
      .join("_")
      .toLowerCase();
    const extension = MIME_TYPES[file.mimetype];
    name = name.replace("." + extension, "");
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
