const express = require("express");
const axios = require("axios");
const router = express.Router();


router.get("/opportunities", async (req, res) => {
  try {
    const { opportunity, page, per_page, oppstatus, usertype, domain, q } = req.query;
    const targetUrl = "https://unstop.com/api/public/opportunity/search-result";
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
    res.json(response.data);

  } catch (error) {
    console.error("Error fetching data from Unstop:", error.message);
    if (error.response) {
        res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
        res.status(500).json({ message: "No response received from Unstop API" });
    } else {
        res.status(500).json({ message: "Error setting up request to Unstop API" });
    }
  }
});

module.exports = router;
