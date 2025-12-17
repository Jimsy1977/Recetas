import { GoogleGenAI } from "@google/genai";
import { RecipeData } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un Chef Ejecutivo de clase mundial con 20 años de experiencia. Eres experto en "Ingeniería Inversa" de recetas a partir de fotos.
Tu tarea es analizar una foto de comida y devolver una receta estructurada en JSON EN ESPAÑOL.

Adhiérete estrictamente a esta estructura JSON:
{
  "identification": {
    "name": "string (Nombre del platillo)",
    "cuisine": "string (e.g. Mexicana, Italiana)",
    "category": "Entrada" | "Plato Fuerte" | "Postre" | "Bebida" | "Snack",
    "cultureContext": "string (máximo 2 oraciones de contexto cultural)"
  },
  "visualAnalysis": {
    "visibleIngredients": ["string"],
    "cookingMethod": "string (e.g. Asado, Frito, Al vapor)",
    "presentation": "string"
  },
  "ingredients": [
    {
      "item": "string",
      "quantity": number (usar 0 para 'al gusto' o incontable),
      "unit": "string",
      "section": "Base" | "Salsa" | "Guarnición" | "Acompañamiento",
      "substitute": "string (opcional)"
    }
  ],
  "preparation": [
    {
      "stepNumber": number,
      "instruction": "string (instrucción clara)",
      "duration": "string (opcional, e.g. '10 mins')",
      "temperature": "string (opcional, e.g. '180°C')"
    }
  ],
  "timings": {
    "prepTime": "string",
    "cookTime": "string",
    "totalTime": "string"
  },
  "difficulty": {
    "level": "Principiante" | "Intermedio" | "Avanzado",
    "score": number (1-10),
    "equipment": ["string"]
  },
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "cost": {
    "totalEstimated": "string (e.g. S/ 60.00 / $16.00 USD)",
    "perServing": "string (e.g. S/ 15.00 / $4.00 USD)"
  },
  "variations": {
    "vegetarian": "string (descripción breve)",
    "vegan": "string (descripción breve)",
    "lowCarb": "string (descripción breve)"
  },
  "chefTips": ["string (3-5 secretos profesionales)"],
  "error": null
}

REGLAS IMPORTANTES:
1. La receta base debe ser exactamente para 4 PORCIONES.
2. Si la imagen NO es comida, devuelve {"error": "NOT_FOOD"}.
3. Si la imagen es muy borrosa, devuelve {"error": "BLURRY"}.
4. Sé preciso con las cantidades. Estima con educación culinaria.
5. Todo el texto debe estar en ESPAÑOL.
6. COSTOS: Deben mostrarse tanto en Soles Peruanos (PEN/S/) como en Dólares (USD/$). Formato sugerido: "S/ XX.XX (USD $YY.YY)".
`;

export const analyzeImage = async (base64Image: string): Promise<RecipeData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, API handles standard types
              data: cleanBase64
            }
          },
          {
            text: "Analiza este platillo y genera la receta en formato JSON en Español con precios en Soles y Dólares."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return data as RecipeData;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};