const Book = require("../models/Books");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getBestRating = (req, res, next) => {
  Book.aggregate([
    {
      $unwind: "$ratings",
    },
    {
      group: {
        _id: "$id",
        title: { $first: "$title" },
        averageRating: { $avg: "$ratings.grade" },
        imageUrl: { $first: "$imageurl" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 3,
    },
  ])
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    if (req.file) {
      const inputPath = path.join(__dirname, "../images", req.file.filename);
      const outputPath = path.join(
        __dirname,
        "../images/optimized",
        req.file.filename
      );

      try {
        sharp.cache(false);
        await sharp(inputPath)
          .resize({ width: 800, height: 600, fit: "inside" })
          .webp({ quality: 80 })
          .toFile(outputPath);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Erreur lors du traitement de l'image" });
      }

      fs.unlink(inputPath);

      req.file.filename = `optimized/${req.file.filename}`;
    }

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.rateOneBook = (req, res, next) => {
  const userId = req.auth.userId;
  const rating = req.body.rating;

  Book.findOne({ _id: req.params.id }).then((book) => {
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    const existingRate = book.rating.find((r) => r.userId === userId);
    if (existingRate) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    book.ratings.push({ userId: userId, grade: rating });

    const totalRating = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRating;
  });

  book
    .save()
    .then(() => res.status(200).json({ message: "Note ajoutée avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
