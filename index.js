const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.hubapi.com/crm/v3/objects/contacts?archived=false&properties=firstname,lastname,email&limit=6",
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.render("homepage", { explorers: response.data.results });
  } catch (error) {
    console.error(
      "Error fetching contacts:",
      error.response?.data || error.message
    );
    res.status(500).send("Error fetching contacts");
  }
});

// TODO: ROUTE 2 - Create a new app.post route for the contacts form to create or update your contacts data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/updates-cobj", async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    // Make a POST request to HubSpot API
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          firstname,
          lastname,
          email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.send(
      `Form submitted successfully! <a href="${req.protocol}://${req.get(
        "host"
      )}/">Home</a>`
    );
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response?.data || error.message
    );
    res.status(500).send("Error submitting form");
  }
});

// * Code for Route 2 goes heres

app.get("/updates-cobj", (req, res) => {
  res.render("updates", {
    pageTitle: "Update Contact Form | Integrating With HubSpot I Practicum.",
  });
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
