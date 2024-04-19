const router = require("express").Router();
const { UUIDV4 } = require("sequelize");
const multer = require("multer");
const { userOnly } = require("./utils");
const { Crum } = require("../../db/models");
const { testBucket } = require("../../config");
module.exports = router;

const upload = multer({ storage: multer.memoryStorage() });

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

router.post("/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  console.log(req.body);
  console.log(req.file);
  console.log("my bucket", testBucket);
  try {
    await testBucket.upload(req.file.destination, {
      destination: `${req.file.originalname}`,
      resumable: true,
    });
    res.status(201).send("image uploaded");
  } catch (err) {
    console.error(err);
  }
  res.send("image couldnt be uploaded");
});
