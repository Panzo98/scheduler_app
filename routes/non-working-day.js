const express = require("express");
const router = express.Router();
const db = require("../models");
const verify = require("../middlewares/verify");
const Non_Working_Day = db.Non_Working_Day;

router.get("/all", verify, async (req, res) => {
  try {
    let response = await Non_Working_Day.findAll();
    return res
      .status(201)
      .json({ message: "All Non-Working days here!", data: response });
  } catch (error) {
    return res.json({ message: "Cannot get all Non-Working days!" });
  }
});

router.get("/getByObject/:id", async (req, res) => {
  try {
    let response = await Non_Working_Day.findAll({
      where: {
        object_id: req.params.id,
      },
    });
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", verify, async (req, res) => {
  try {
    await Non_Working_Day.create({
      date: req.body.date,
      reason: req.body.reason,
    });
    return res
      .status(200)
      .json({ message: "Non-Working day successfully created!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Non_Working_Day.findByPk(req.params.id);
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", verify, async (req, res) => {
  try {
    let validId = await Non_Working_Day.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });
    await Non_Working_Day.update(
      {
        date: req.body.date,
        reason: req.body.reason,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Non-Working day successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    let validId = await Non_Working_Day.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });
    await Non_Working_Day.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Non-Working day successfully deleted!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
