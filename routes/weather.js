// const express = require("express");
// const router = express.Router();
// const axios = require("axios");

// // Define your RapidAPI Key
// const X_RapidAPI_Key = "2f9d0a0c1bmsh860700ef823247bp17d1b9jsn4ba987c79300";

// router.get("/searchWeather", async (req, res) => {
//   try {
//     const { search } = req.query;
//     const options = {
//       method: "GET",
//       url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=10000&namePrefix=${search}`,
//       headers: {
//         "X-RapidAPI-Key": X_RapidAPI_Key,
//         "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
//       },
//     };

//     const response = await axios.request(options);
//     res.json(response.data);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
