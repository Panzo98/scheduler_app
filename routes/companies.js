const express = require("express");
const router = express.Router();
const db = require("../models");
const Company = db.Company;

router.get("/all", async (req, res) => {
  try {
    let response = await Company.findAll();
    return res.json({ message: "All companies!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  try {
    await Company.create({
      name: req.body.name,
      address: req.body.address,
    });
    return res.json({ message: "Successfully added company!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Company.findByPk(req.params.id);
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workingHour = await Company.findOne({
      where: { id: req.params.id },
    });
    if (!workingHour) {
      return res.status(400).json({ message: "Wrong id!" });
    }
    await Company.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Company successfully deleted!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let validId = await Company.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Company.update(
      {
        name: req.body.name,
        address: req.body.address,
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Company successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
