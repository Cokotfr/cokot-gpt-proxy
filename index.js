const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post("/ask", async (req, res) => {
  const { model, messages } = req.body;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: model || "gpt-3.5-turbo",
      messages,
      temperature: 0.7
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur OpenAI :", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'appel à ChatGPT" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy Cokot GPT en ligne sur le port " + PORT));
