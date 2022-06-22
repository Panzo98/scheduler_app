const express = require("express");
const router = express.Router();
const db = require("../models");
const Reservation_Type = db.Reservation_Type;
const verify = require("../middlewares/verify");

router.get("/all", async (req, res) => {
  try {
    let response = await Reservation_Type.findAll();
    return res.json({ message: "All reservation types!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", verify, async (req, res) => {
  try {
    await Reservation_Type.create({
      name: req.body.name,
      duration: req.body.duration,
      color: req.body.color,
      object_id: req.body.object_id,
    });
    return res.json({ message: "New reservation type created!" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.delete("/:id", verify, async (req, res) => {
  try {
    let validId = await Reservation_Type.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Reservation_Type.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Reservation type successfully deleted!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.put("/:id", verify, async (req, res) => {
  try {
    let validId = await Reservation_Type.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Reservation_Type.update(
      {
        name: req.body.name,
        duration: req.body.duration,
        color: req.body.color,
        object_id: req.body.object_id,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Reservation type successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
