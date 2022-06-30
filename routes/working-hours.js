const express = require("express");
const router = express.Router();
const db = require("../models");
const Working_Hour = db.Working_Hour;
const Object = db.Object;

router.get("/all", async (req, res) => {
  try {
    let response = await Working_Hour.findAll();
    return res.json({ message: "All working hours!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getByObject/:id", async (req, res) => {
  try {
    let response = await Working_Hour.findAll({
      where: {
        object_id: req.params.id,
      },
      include: [
        {
          model: Object,
        },
      ],
    });
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const sortedResponse = response.sort(
      (a, b) =>
        days.indexOf(a.dataValues.day_name) -
        days.indexOf(b.dataValues.day_name)
    );
    return res.json({ message: "Successful", data: sortedResponse });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  try {
    let response = await Working_Hour.create({
      day_name: req.body.day_name,
      working_day: req.body.working_day,
      start: req.body.start,
      end: req.body.end,
    });
    return res.json({
      message: "Successfully added working hour!",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Working_Hour.findByPk(req.params.id);
    if (!response) {
      return res.status(500).json({ message: "No records with this id!" });
    }
    return res.json({ message: "Sguccessful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workingHour = await Working_Hour.findOne({
      where: { id: req.params.id },
    });
    if (!workingHour) {
      return res.status(400).json({ message: "Wrong id!" });
    }
    await Working_Hour.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ message: "Working hour successfully deleted!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let validId = await Working_Hour.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Working_Hour.update(
      {
        day_name: req.body.day_name,
        working_day: req.body.working_day,
        start: req.body.start,
        end: req.body.end,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Working hour successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
