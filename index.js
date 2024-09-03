import * as dotenv from "dotenv";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

dotenv.config();
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api", (req, res) => {
  let current = new Date(Date.now());
  return res
    .status(StatusCodes.OK)
    .json({ unix: current.getTime(), utc: current.toUTCString() });
});

app.get("/api/:date_string", (req, res) => {
  const { date_string } = req.params;
  let time = new Date(date_string);
  if (!isNaN(date_string)) {
    time = new Date(date_string * 1000);
  }
  const utcTime = time.toUTCString();
  if (utcTime !== "Invalid Date") {
    res.status(StatusCodes.OK).json({ unix: time.getTime(), utc: utcTime });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid Date" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
