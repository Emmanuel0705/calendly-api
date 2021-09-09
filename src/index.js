const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
//add cors middleware
app.use(cors())

const eventUrl =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

app.get("/", async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "fail",
        message: "pls provide authorization token",
      });
    }
    const resp = await axios.get(eventUrl, {
      headers: {
        authorization: `Bearer ${authorization}`,
      },
    });
    const { items } = resp.data;
    const data = items.map((item) => ({
      title: item.summary,
      description: item.description,
      start: item.start?.dateTime,
      url: item.location,
    }));

    return res.json({ data });
  } catch (error) {
    console.log({error})
    return res
      .status(400)
      .json({ status: "error", message: "error occured pls try again" });
  }
});

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
