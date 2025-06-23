const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

// 📩 Route GPT-3.5 / GPT-4 → Génération de texte déco
app.post("/ask", async (req, res) => {
  const { model, messages } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: model || "gpt-3.5-turbo",
        messages,
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur OpenAI (texte) :", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la génération de texte." });
  }
});

// 🖼️ Route DALL·E → Génération d’image déco
app.post("/image", async (req, res) => {
  const { prompt, size } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size || "1024x1024" // taille par défaut
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    res.json({ image_url: response.data.data[0].url });
  } catch (error) {
    console.error("Erreur OpenAI (image) :", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la génération d’image." });
  }
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cokot proxy GPT/DALL·E actif sur le port ${PORT}`));
