const asyncHandler = require("express-async-handler");
const axios = require("axios");
const WEATHER_APIKEY = process.env.WEATHER_APIKEY;
const X_RapidAPI_Key = process.env.X_RapidAPI_Key;

const getWeatherData = asyncHandler(async (req, res) => {
  try {
    let { location } = req.query;
    if (!location) {
      location = "Warsaw";
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_APIKEY}`;

    const response = await axios.get(apiUrl);

    res.json(response.data);
    console.log("To nie ten" + response.data);
  } catch (error) {
    console.error("Błąd podczas pobierania danych o pogodzie:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
});

const getSearchWeatherData = asyncHandler(async (req, res) => {
  let { search } = req.query;
  console.log("search " + search);
  const options = {
    method: "GET",
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation10000&namePrefix=${search}`,
    headers: {
      "X-RapidAPI-Key": X_RapidAPI_Key,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = { getWeatherData, getSearchWeatherData };
