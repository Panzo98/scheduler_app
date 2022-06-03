const express = require("express");
const router = express.Router();
const db = require("../models");
const Reservation = db.Reservation;
const Day = db.Day;
const Non_Working_Day = db.Non_Working_Day;
const Reservation_Type = db.Reservation_Type;
const Working_Hour = db.Working_Hour;

router.get("/all", async (req, res) => {
  try {
    let response = await Reservation.findAll();
    return res.json({ message: "All reservations!", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/create", async (req, res) => {
  try {
    let date = new Date(req.body.date);
    let dayId = date.getDay();
    let startHour;
    let endHour;
    // Check if date is in the past
    let diff = new Date().getTime() - date.getTime();
    if (diff > 0) {
      return res
        .status(500)
        .json({ message: "Reservation can't be in the past!" });
    }
    //-----------------------------------

    let reservationType = await Reservation_Type.findOne({
      where: { id: req.body.type_id },
    });
    if (!reservationType) {
      return res.status(500).json({ message: "No reservation of this type!" });
    }

    // This if changes the value for saturday from 0 to 7 in order to match the database seeders
    if (dayId === 0) {
      dayId = 7;
    }
    let allDays = await Day.findAll();
    //-----------------------------------

    let isValidDay = false;

    // Checking if day is set as working day in regular working week.
    allDays.forEach((elem) => {
      if (elem.id === dayId && elem.working_day) {
        isValidDay = true;
      }
    });
    if (!isValidDay)
      return res.status(500).json({ message: "Non working day!" });
    //-----------------------------------

    //  Checking if day is on special day off
    let specialNonWorkingDays = await Non_Working_Day.findAll();
    specialNonWorkingDays.forEach((elem) => {
      if (new Date(elem.date).toDateString() === date.toDateString()) {
        isValidDay = false;
      }
    });
    if (!isValidDay)
      return res.status(500).json({ message: "Special Non working day!" });

    //-----------------------------------

    // Checking if ordering time is in working hours
    let workingHours = await Working_Hour.findOne({ where: { day_id: dayId } });
    if (!workingHours)
      return res.status(500).json({ message: "No working hours added!" });

    let orderingTimeInMinutes = date.getHours() * 60 + date.getMinutes();
    let startTimeInMinutes = parseInt(workingHours.start) * 60;

    startTimeInMinutes =
      startTimeInMinutes +
      parseInt(workingHours.start[3] + workingHours.start[4]); // Getting minutes from 18;30;00 format

    let endTimeInMinutes = parseInt(workingHours.end) * 60;
    endTimeInMinutes =
      endTimeInMinutes + parseInt(workingHours.end[3] + workingHours.end[4]); // Getting minutes from 18;30;00 format

    if (
      orderingTimeInMinutes < startTimeInMinutes ||
      orderingTimeInMinutes >= endTimeInMinutes
    )
      return res
        .status(500)
        .json({ message: "You are making order in non working hours!" });

    //-----------------------------------

    // Checking da l' ce poklapa vrijeme sa nekom prethodnom rezervacijom hahahaah

    //-----------------------------------

    return res.json({ message: "radiiii" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!", error });
  }
});

module.exports = router;
