const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv/config");

app.use(cors());
app.use(express.json());

const reservationRouter = require("./routes/reservations");
const userRouter = require("./routes/user");
const reservationTypeRouter = require("./routes/reservation-types");
const nonWorkingDaysRouter = require("./routes/non-working-day");
const workingHoursRouter = require("./routes/working-hours");
const companyRouter = require("./routes/companies");
const objectRouter = require("./routes/objects");
const daysRouter = require("./routes/days");
const rolesRouter = require("./routes/roles");

app.use("/api/reservations", reservationRouter);
app.use("/api/users", userRouter);
app.use("/api/reservation_types", reservationTypeRouter);
app.use("/api/non_working_days", nonWorkingDaysRouter);
app.use("/api/working_hours", workingHoursRouter);
app.use("/api/companies", companyRouter);
app.use("/api/objects", objectRouter);
app.use("/api/days", daysRouter);
app.use("/api/roles", rolesRouter);

const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
const subClient = pubClient.duplicate();

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.adapter(createAdapter(pubClient, subClient));
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.listen(process.env.IO_PORT);
});

io.use((socket, next) => {
  try {
    if (!socket.handshake.headers.authorization) {
      next(new Error("Authentication error"));
    }
    const verified = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.JWT_SECRET
    );
    socket.user = verified;
    socket.company_id = verified.company_id;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.company_id);
  console.log(socket.id);
  console.log(socket.user);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);
