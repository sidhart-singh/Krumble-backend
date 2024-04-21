const router = require("express").Router();
const formidable = require("formidable");
const bucket = require("../../config");
const { userOnly } = require("./utils");
const { Crum } = require("../../db/models");
const { getDownloadURL } = require("firebase-admin/storage");
module.exports = router;

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

router.post("/", async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    const filePath = files.image[0].filepath;
    const remoteFilePath = `prod/images/${
      new Date().valueOf() + "_" + files.image[0].originalFilename
    }`;

    try {
      // Upload the file to Firebase Storage
      await bucket.upload(filePath, { destination: remoteFilePath });

      try {
        const newCrum = await Crum.create({
          name: fields.name[0],
          category: fields.category[0],
          imageUrl: await getDownloadURL(bucket.file(remoteFilePath)),
        });
        const returnVal = newCrum.dataValues;
        if (newCrum) {
          res.status(201).json({ returnVal });
        }
      } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
      }
    } catch (err) {
      res.status(500).json({ success: false, msg: err.message });
    }
  });
});

router.get("/:id", async (req, res, next) => {
  console.log("req", req.params.id);
  const id = req.params.id;
  try {
    const crum = await Crum.findByPk(req.params.id, {
      attributes: ["id", "name", "category", "imageUrl"],
    });

    res.json(crum);
  } catch (error) {
    next(error);
  }
});
