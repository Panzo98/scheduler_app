const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;
const Company = db.Company;
const jwt = require("jsonwebtoken");
const verify = require("../middlewares/verify");
require("dotenv/config");

router.get("/all", async (req, res) => {
  try {
    let response = await User.findAll();
    return res.status(201).json({ message: "All users here!", data: response });
  } catch (error) {
    return res.json({ message: "Cannot get all users!" });
  }
});

router.get("/check", verify, (req, res) => {
  try {
    let token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role_id: req.user.role_id,
        company_id: req.user.company_id,
        Company: req.user.Company,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res
      .status(201)
      .json({ message: "Check correct!", token, user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Check failed!" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
      role_id: req.body.role_id,
      company_id: req.body.company_id,
    });
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    return res
      .status(201)
      .json({ message: "User successfully registered!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong with registration!", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      include: { model: Company },
    });
    if (!user) {
      return res.status(400).json({ message: "Wrong username!" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    let token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        company_id: user.company_id,
        Company: user.Company,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      token,
      message: "Logged in successfully!",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.id } });
    if (!user) {
      return res.status(400).json({ message: "Wrong id!" });
    }
    await User.destroy({ where: { username: req.params.id } });
    return res.status(200).json({ message: "User successfully deleted!" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let response = await User.findByPk(req.params.id);
    if (!response) {
      return res.status(500).json({ message: "No records with this id!" });
    }
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
