const express = require("express");
const router = express.Router();
const db = require("../models");
const Day = db.Day;

router.get("/all", async (req, res) => {
  try {
    let response = await Day.findAll();
    return res.json({ message: "All days!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getByObject/:id", async (req, res) => {
  try {
    let response = await Day.findAll({
      where: {
        object_id: req.params.id,
      },
    });
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  try {
    await Day.create({
      name: req.body.name,
      working_day: req.body.working_day,
      object_id: req.body.object_id,
    });
    return res.json({ message: "Successfully added day!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Day.findByPk(req.params.id);
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workingHour = await Day.findOne({
      where: { id: req.params.id },
    });
    if (!workingHour) {
      return res.status(400).json({ message: "Wrong id!" });
    }
    await Day.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Day successfully deleted!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let validId = await Day.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Day.update(
      {
        name: req.body.name,
        working_day: req.body.working_day,
        object_id: req.body.object_id,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Day successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
