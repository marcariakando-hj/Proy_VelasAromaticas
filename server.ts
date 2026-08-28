import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API endpoint for AI Fragrance Concierge & Bespoke Candle Formulation
app.post("/api/fragrance-consultation", async (req, res) => {
  try {
    const { mood, notes, space, intention, currentSeason } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback expert handcrafted recommendations if API key isn't provided
      return res.json({
        candleName: "Serenidad Botánica & Cítricos Nobles",
        olfactoryPyramid: {
          salida: "Naranja Sanguina deshidratada, Bergamota de Calabria y Cardamomo",
          corazon: "Lavanda Silvestre de Provenza, Flor de Azahar y Rama de Canela",
          fondo: "Madera de Cedro ahumado, Haba Tonka y Vainilla Bourbon natural",
        },
        description: "Una sinfonía olfativa diseñada para calmar la mente y transformar tu hogar en un santuario botánico cálido y sereno.",
        vesselRecommendation: "Recipiente cerámico mate en tono terracota suave con mecha doble de madera de cerezo sostenible.",
        burningRitual: "Enciende la mecha de madera durante un mínimo de 2 horas en el primer encendido para permitir un derretimiento uniforme de la cera de soja.",
        moodAlignment: "Paz mental, introspección serena y armonía cálida.",
        soundAmbience: "Crepitar suave de chimenea campestre con notas de lluvia lejana."
      });
    }

    const prompt = `Eres la Maestra Perfumista Botánica y Artesana en jefe de "LÚMEN BOTÁNICA", un taller exclusivo de velas artesanales de lujo ecológicas de cera de soja 100% natural, mechas de madera crujiente y esencias botánicas puras.
    
    El usuario busca una creación olfativa personalizada con los siguientes detalles:
    - Estado de ánimo deseado: ${mood || "Paz y relajación profunda"}
    - Ingredientes o notas aromáticas preferidas: ${notes || "Lavanda, Naranja seca, Canela y Maderas"}
    - Espacio o estancia: ${space || "Sala de estar / Rincón de lectura"}
    - Intención del ritual: ${intention || "Desconectar al final del día y meditar"}
    - Estación del año: ${currentSeason || "Otoño / Invierno"}

    Genera una recomendación de vela artesanal exclusiva en ESPAÑOL en formato JSON estricto con las siguientes claves:
    {
      "candleName": "Nombre evocador y poético en español para la vela",
      "olfactoryPyramid": {
        "salida": "Notas de salida (lo primero que se percibe)",
        "corazon": "Notas de corazón (el alma de la fragancia)",
        "fondo": "Notas de fondo (la base perdurable y cálida)"
      },
      "description": "Descripción sensorial poética de la experiencia olfativa y lumínica (2-3 oraciones)",
      "vesselRecommendation": "Tipo de vasija cerámica artesanal recomendada (color mate, textura, estilo)",
      "burningRitual": "Instrucciones de ritual de encendido y tiempo ideal de disfrute",
      "moodAlignment": "Cómo esta fórmula química-botánica equilibra las emociones y el ambiente",
      "soundAmbience": "Descripción del efecto sonoro del crepitar de la mecha de madera"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Eres una perfumista botánica y sommelier de aromas de lujo. Responde siempre con elegancia, precisión poética y estrictamente en formato JSON."
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error("Error in fragrance consultation:", error);
    return res.status(500).json({
      error: "No se pudo generar la consulta olfativa.",
      fallback: {
        candleName: "Bruma de Lavanda & Naranja Especiada",
        olfactoryPyramid: {
          salida: "Cáscara de naranja deshidratada y mandarina dulce",
          corazon: "Flores de lavanda francesa y canela de Ceilán",
          fondo: "Cera de soja virgen, sándalo y resina de ámbar cálido",
        },
        description: "Una mezcla equilibrada que abraza tus sentidos con el crepitar relajante de la madera natural.",
        vesselRecommendation: "Cerámica artesanal esmaltada en mate arena.",
        burningRitual: "Respira hondo 3 veces antes de encender con cerilla larga de madera.",
        moodAlignment: "Relajación y alivio de tensiones.",
        soundAmbience: "Suave sonido crujiente de leña en miniatura."
      }
    });
  }
});

// Start server and mount Vite
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumen Botanica server running on port ${PORT}`);
  });
}

start();
