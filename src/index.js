const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
//add cors middleware
app.use(cors())

//event url
const eventUrl =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

app.get("/", async (req, res) => {
  try {
    //check if authorization header is available
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "fail",
        message: "pls provide authorization token",
      });
    }
    //make a request to google calneder server to get clander with user authorization token
    const resp = await axios.get(eventUrl, {
      headers: {
        authorization: `Bearer ${authorization}`,
      },
    });
    //destructure items from response data
    const { items } = resp.data;
    //map through items to filter needful information
    const data = items.map((item) => ({
      title: item.summary,
      description: item.description,
      start: item.start?.dateTime,
      url: item.location,
    }));
   //return response
    return res.json({ data });
  } catch (error) {
    //log error if occured
    console.log({error})
    //return 400 respomse
    return res
      .status(400)
      .json({ status: "error", message: "error occured pls try again" });
  }
});

//setting port
const port = process.env.PORT || 9090;
// creaing server with express
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
