const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const Reservation = db.Reservation;
const Non_Working_Day = db.Non_Working_Day;
const Reservation_Type = db.Reservation_Type;
const Working_Hour = db.Working_Hour;
const Object = db.Object;

const validateReservation = async (req, res, next) => {
  let date = new Date(req.body.date);
  let dayId = date.getDay();
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
  const object_id = reservationType.dataValues.object_id;
  // Duration on reservation converting to minutes
  let durationInMinutes =
    parseInt(reservationType.duration) * 60 +
    parseInt(reservationType.duration[3] + reservationType.duration[4]);
  // This if changes the value for saturday from 0 to 7 in order to match the database seeders
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let allWorkingHours = await Working_Hour.findAll({
    where: { object_id: object_id },
  });
  const sortedWorkingHours = allWorkingHours.sort(
    (a, b) =>
      days.indexOf(a.dataValues.day_name) - days.indexOf(b.dataValues.day_name)
  );
  const workingHours = sortedWorkingHours[dayId];
  //-----------------------------------
  // Checking if day is set as working day in regular working week.
  if (!workingHours.dataValues.working_day) {
    return res.status(500).json({ message: "Non working day!" });
  }
  //-----------------------------------
  //  Checking if day is on special day off
  let isValidDay = true;
  let specialNonWorkingDays = await Non_Working_Day.findAll({
    where: { object_id: object_id },
  });
  specialNonWorkingDays.forEach((elem) => {
    if (new Date(elem.date).toDateString() === date.toDateString()) {
      isValidDay = false;
    }
  });
  if (!isValidDay)
    return res.status(500).json({ message: "Special Non working day!" });
  //-----------------------------------
  // Checking if ordering time is in working hours
  // TODO adapt working hours to timezones (every object should have timezone tied to it and actual start/end time for that timezone will be compared)
  if (!workingHours)
    return res.status(500).json({ message: "No working hours added!" });
  let orderingTimeInMinutes = date.getUTCHours() * 60 + date.getMinutes();
  let startTimeInMinutes = parseInt(workingHours.start) * 60;
  startTimeInMinutes =
    startTimeInMinutes +
    parseInt(workingHours.start[3] + workingHours.start[4]); // Getting minutes from 18;30;00 format
  let endTimeInMinutes = parseInt(workingHours.end) * 60;
  endTimeInMinutes =
    endTimeInMinutes + parseInt(workingHours.end[3] + workingHours.end[4]); // Getting minutes from 18;30;00 format
  if (
    orderingTimeInMinutes < startTimeInMinutes ||
    orderingTimeInMinutes + durationInMinutes > endTimeInMinutes
  )
    return res
      .status(500)
      .json({ message: "Your order is out of working hours!" });
  //-----------------------------------
  // Checking da l' ce poklapa vrijeme sa nekom prethodnom rezervacijom hahahaah
  let allReservationOnThatDay = await Reservation.findAll({
    where: {
      date: date,
      object_id: object_id,
      // TODO uncheck this
      //  status: "accepted"
    },
  });
  let recievedReservationEnd = moment(date)
    .add(reservationType.duration, "m")
    .toDate();
  allReservationOnThatDay.forEach((elem) => {
    let reservationStart = new Date(elem.dataValues.date);
    let reservationEnd = moment(reservationStart)
      .add(reservationType.duration, "m")
      .toDate();

    //SEE reference/period-relations.png
    // Start Inside
    if (date > reservationStart && date < reservationEnd) {
      isValidDay = false;
    }
    // Inside Start Touching
    if (
      date.getTime() == reservationStart.getTime() &&
      recievedReservationEnd < reservationEnd
    ) {
      isValidDay = false;
    }
    // Enclosing Start Touching
    if (
      date.getTime() == reservationStart.getTime() &&
      recievedReservationEnd > reservationEnd
    ) {
      isValidDay = false;
    }
    // Enclosing
    if (date < reservationStart && recievedReservationEnd > reservationEnd) {
      isValidDay = false;
    }
    // Enclosing End Touching
    if (
      date < reservationStart &&
      recievedReservationEnd.getTime() == reservationEnd.getTime()
    ) {
      isValidDay = false;
    }
    // Exact Match
    if (
      date.getTime() == reservationStart.getTime() &&
      recievedReservationEnd.getTime() == reservationEnd.getTime()
    ) {
      isValidDay = false;
    }
    // Inside
    if (date > reservationStart && recievedReservationEnd < reservationEnd) {
      isValidDay = false;
    }
    // Inside End Touching
    if (
      date > reservationStart &&
      recievedReservationEnd.getTime() == reservationEnd.getTime()
    ) {
      isValidDay = false;
    }
    // End Inside
    if (
      recievedReservationEnd > reservationStart &&
      recievedReservationEnd < reservationEnd
    ) {
      isValidDay = false;
    }
  });
  if (!isValidDay)
    return res
      .status(500)
      .json({ message: "Reservation overlaps with another reservation!" });
  //-----------------------------------
  // await Reservation.create({
  //   name: req.body.name,
  //   date: req.body.date,
  //   type_id: req.body.type_id,
  //   phone_number: req.body.phone_number,
  //   message: req.body.message,
  //   status: "accepted",
  //   admin_note: req.body.admin_note,
  //   object_id: req.body.object_id,
  // });
  next();
};

module.exports = validateReservation;
