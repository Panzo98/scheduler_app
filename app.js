const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv/config");

app.use(cors());
app.use(express.json());

const reservationRouter = require("./routes/reservations");
const userRouter = require("./routes/user");
const reservationTypeRouter = require("./routes/reservation-types");
const nonWorkingDaysRouter = require("./routes/non-working-day");
const workingHoursRouter = require("./routes/working-hours");

app.use("/api/reservation", reservationRouter);
app.use("/api/user", userRouter);
app.use("/api/reservation_type", reservationTypeRouter);
app.use("/api/non_working_days", nonWorkingDaysRouter);
app.use("/api/working_hours", workingHoursRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);
