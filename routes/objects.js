const express = require("express");
const router = express.Router();
const db = require("../models");
const Object = db.Object;
const verify = require("../middlewares/verify");

router.get("/all", async (req, res) => {
  try {
    let response = await Object.findAll();
    return res.json({ message: "All Objects!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", verify, async (req, res) => {
  try {
    await Object.create({
      name: req.body.name,
      company_id: req.body.company_id,
    });
    return res.json({ message: "New Object created!" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    let validId = await Object.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Object.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Object successfully deleted!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.put("/:id", verify, async (req, res) => {
  try {
    let validId = await Object.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Object.update(
      {
        name: req.body.name,
        company_id: req.body.company_id,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Object successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
