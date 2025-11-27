import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static(".")); // si después querés servir el HTML desde Render

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint de mejora de texto
app.post("/api/mejora", async (req, res) => {
  try {
    const { texto, modo } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Falta el texto" });
    }

    const prompt = `Reescribe el siguiente texto en español, usando un estilo ${modo}. Respeta el significado original:\n\n"""${texto}"""`;

    const respuesta = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    res.json({ resultado: respuesta.output_text });
  } catch (error) {
    console.error("Error en /api/mejora:", error);
    res.status(500).json({ error: "Error llamando a OpenAI" });
  }
});

// 👇 MUY IMPORTANTE para Render: usar process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
