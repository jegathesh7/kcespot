const express = require("express");
const axios = require("axios");
const router = express.Router();

// Proxy endpoint for Unstop API
router.get("/opportunities", async (req, res) => {
  try {
    // Extract query parameters from the request
    const { opportunity, page, per_page, oppstatus, usertype, domain, q } = req.query;

    // Construct the target URL
    const targetUrl = "https://unstop.com/api/public/opportunity/search-result";

    // Make the request to Unstop API
    const response = await axios.get(targetUrl, {
      params: {
         opportunity: opportunity || "hackathons",
         page: page || 1,
         per_page: per_page || 18,
         oppstatus: oppstatus || "open",
         usertype: usertype || "students",
         domain: domain || 2,
         q: q,
         undefined: true 
      }
    });

    // Send back the data from Unstop
    res.json(response.data);

  } catch (error) {
    console.error("Error fetching data from Unstop:", error.message);
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        res.status(500).json({ message: "No response received from Unstop API" });
    } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({ message: "Error setting up request to Unstop API" });
    }
  }
});

module.exports = router;
