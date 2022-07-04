const express = require("express");
const verify = require("../middlewares/verify");
const validateReservation = require("../middlewares/validateReservation");
const router = express.Router();
const db = require("../models");
const Reservation = db.Reservation;
const Non_Working_Day = db.Non_Working_Day;
const Reservation_Type = db.Reservation_Type;
const Working_Hour = db.Working_Hour;
const Object = db.Object;

router.get("/all", async (req, res) => {
  try {
    let response = await Reservation.findAll();
    return res.json({ message: "All reservations!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getByObject/:id", async (req, res) => {
  try {
    let response = await Reservation.findAll({
      where: {
        object_id: req.params.id,
      },
      include: [{ model: Object }, { model: Reservation_Type }],
    });
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getByCompany/:id", async (req, res) => {
  try {
    let response = await Reservation.findAll({
      include: [
        {
          model: Object,
          where: {
            company_id: req.params.id,
          },
        },
        { model: Reservation_Type },
      ],
    });
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/getPendingByCompany", verify, async (req, res) => {
  try {
    let response = await Reservation.findAll({
      where: {
        status: "pending",
      },
      include: [
        {
          model: Object,
          where: {
            company_id: req.user.company_id,
          },
        },
        { model: Reservation_Type },
      ],
    });
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  // try {
  //   let date = new Date(req.body.date);
  //   let dayId = date.getDay();
  //   // Check if date is in the past
  //   let diff = new Date().getTime() - date.getTime();
  //   if (diff > 0) {
  //     return res
  //       .status(500)
  //       .json({ message: "Reservation can't be in the past!" });
  //   }
  //   //-----------------------------------
  //   let reservationType = await Reservation_Type.findOne({
  //     where: { id: req.body.type_id },
  //   });
  //   if (!reservationType) {
  //     return res.status(500).json({ message: "No reservation of this type!" });
  //   }
  //   // Duration on reservation converting to minutes
  //   let durationInMinutes =
  //     parseInt(reservationType.duration) * 60 +
  //     parseInt(reservationType.duration[3] + reservationType.duration[4]);
  //   // This if changes the value for saturday from 0 to 7 in order to match the database seeders
  //   if (dayId === 0) {
  //     dayId = 7;
  //   }
  //   let allDays = await Day.findAll();
  //   //-----------------------------------
  //   let isValidDay = false;
  //   // Checking if day is set as working day in regular working week.
  //   allDays.forEach((elem) => {
  //     if (elem.id === dayId && elem.working_day) {
  //       isValidDay = true;
  //     }
  //   });
  //   if (!isValidDay)
  //     return res.status(500).json({ message: "Non working day!" });
  //   //-----------------------------------
  //   //  Checking if day is on special day off
  //   let specialNonWorkingDays = await Non_Working_Day.findAll();
  //   specialNonWorkingDays.forEach((elem) => {
  //     if (new Date(elem.date).toDateString() === date.toDateString()) {
  //       isValidDay = false;
  //     }
  //   });
  //   if (!isValidDay)
  //     return res.status(500).json({ message: "Special Non working day!" });
  //   //-----------------------------------
  //   // Checking if ordering time is in working hours
  //   let workingHours = await Working_Hour.findOne({ where: { day_id: dayId } });
  //   if (!workingHours)
  //     return res.status(500).json({ message: "No working hours added!" });
  //   let orderingTimeInMinutes = date.getHours() * 60 + date.getMinutes();
  //   let startTimeInMinutes = parseInt(workingHours.start) * 60;
  //   startTimeInMinutes =
  //     startTimeInMinutes +
  //     parseInt(workingHours.start[3] + workingHours.start[4]); // Getting minutes from 18;30;00 format
  //   let endTimeInMinutes = parseInt(workingHours.end) * 60;
  //   endTimeInMinutes =
  //     endTimeInMinutes + parseInt(workingHours.end[3] + workingHours.end[4]); // Getting minutes from 18;30;00 format
  //   if (
  //     orderingTimeInMinutes < startTimeInMinutes ||
  //     orderingTimeInMinutes + durationInMinutes > endTimeInMinutes
  //   )
  //     return res
  //       .status(500)
  //       .json({ message: "Your order are going out of  working hours!" });
  //   //-----------------------------------
  //   // Checking da l' ce poklapa vrijeme sa nekom prethodnom rezervacijom hahahaah
  //   let thisDay =
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1 < 10
  //       ? "0" + eval(date.getMonth() + 1)
  //       : date.getMonth() + 1) +
  //     "-" +
  //     (date.getDate() < 10 ? "0" + eval(date.getDate()) : date.getDate());
  //   let allReservationOnThatDay = await Reservation.findAll({
  //     where: { date: thisDay },
  //   });
  //   console.log(allReservationOnThatDay);
  //   //-----------------------------------
  //   // await Reservation.create({
  //   //   name: req.body.name,
  //   //   date: req.body.date,
  //   //   type_id: req.body.type_id,
  //   //   phone_number: req.body.phone_number,
  //   //   message: req.body.message,
  //   //   status: "accepted",
  //   //   admin_note: req.body.admin_note,
  //   //   object_id: req.body.object_id,
  //   // });
  //   return res.json({ message: "Reservation created successfully!" });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ message: "Something went wrong!", error });
  // }
});

router.post("/validate", validateReservation, (req, res) => {
  res.json({ message: "All good!" });
});

router.get("/:id", async (req, res) => {
  try {
    let response = await Reservation.findByPk(req.params.id);
    if (!response) {
      return res.status(500).json({ message: "No records with this id!" });
    }
    return res.json({ message: "Successful", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.put("/decline/:id", async (req, res) => {
  try {
    let validId = await Reservation.findOne({
      where: { id: req.params.id },
    });
    if (!validId)
      return res
        .status(404)
        .json({ message: "There's no record with that id!" });

    await Reservation.update(
      {
        status: "declined",
      },
      { where: { id: req.params.id } }
    );
    return res.json({ message: "Reservation declined!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
