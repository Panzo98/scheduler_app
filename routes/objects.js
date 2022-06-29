const express = require("express");
const router = express.Router();
const db = require("../models");
const Object = db.Object;
const Working_Hour = db.Working_Hour;
const Object_Contact = db.Object_Contact;
const verify = require("../middlewares/verify");

router.get("/all", async (req, res) => {
  try {
    let response = await Object.findAll();
    if (!response) {
      return res.status(500).json({ message: "No records with this id!" });
    }
    return res.json({ message: "All Objects!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getByCompany/:id", async (req, res) => {
  try {
    let response = await Object.findAll({
      where: {
        company_id: req.params.id,
      },
    });
    let contacts = await Object_Contact.findAll({
      where: {
        object_id: response.id,
      },
    });
    response.contacts = contacts;
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", verify, async (req, res) => {
  try {
    let result = await Object.create({
      name: req.body.name,
      address: req.body.address,
      company_id: req.user.company_id,
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
    days.forEach(async (singleDay) => {
      await Working_Hour.create({
        day_name: singleDay,
        working_day: false,
        object_id: result.id,
      });
    });
    req.body.contacts.forEach(async (elem) => {
      await Object_Contact.create({
        value: elem,
        object_id: result.id,
      });
    });
    return res.json({ message: "New Object created!", data: result });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Object.findByPk(req.params.id);
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
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
        address: req.body.address,
        company_id: req.user.company_id,
      },
      { where: { id: req.params.id } }
    );
    await Object_Contact.destroy({ where: { object_id: req.params.id } });
    req.body.contacts.forEach(async (elem) => {
      await Object_Contact.create({
        value: elem,
        object_id: req.params.id,
      });
    });
    return res.json({ message: "Object successfully updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
