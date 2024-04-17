const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const { userOnly } = require("./utils");
const { Crum } = require("../../db/models");
const path = require("path");
module.exports = router;

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/images");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + "_" + file.originalname);
    },
  }),
});

// if user is present|loggedin 'req.user'
router.get("/", userOnly, async (req, res, next) => {
  try {
    const crums = await Crum.findAll({
      order: [["category", "ASC"]],
    });
    res.json(crums);
  } catch (err) {
    next(err);
  }
});

// crum post Route
router.post("/", imageUpload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    const newCrum = await Crum.create({
      name: req.body.name,
      category: req.body.category,
      imageUrl: "",
      image: fs.readFileSync(req.file.path),
      imageType: req.file.mimetype,
      imageName: req.file.filename,
    });

    const returnVal = newCrum.dataValues;

    if (newCrum) {
      res.json({ returnVal, msg: "crum created successfull" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    // delete after trying
    fs.unlinkSync(req.file.path);
  }
});

// crum Get Route
router.get("/:id", async (req, res, next) => {
  console.log("req", req.params.id);
  const id = req.params.id;
  try {
    const crum = await Crum.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "category",
        "image",
        "imageName",
        "imageType",
        "imageUrl",
      ],
    });

    res.json(crum);
  } catch (error) {
    next(error);
  }
});
