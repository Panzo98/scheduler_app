const express = require("express");
const router = express.Router();
const db = require("../models");
const Role = db.Role;

router.get("/all", async (req, res) => {
  try {
    let response = await Role.findAll();
    return res.json({ message: "All roles!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  try {
    await Role.create({
      name: req.body.name,
      level: req.body.level,
    });
    return res.json({ message: "Successfully added role!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Role.findByPk(req.params.id);
    if (!response) {
      return res.status(500).json({ message: "No records with this id!" });
    }
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workingHour = await Role.findOne({
      where: { id: req.params.id },
    });
    if (!workingHour) {
      return res.status(400).json({ message: "Wrong id!" });
    }
    await Role.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Role successfully deleted!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let validId = await Role.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Role.update(
      {
        name: req.body.name,
        level: req.body.level,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Role successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
