import { systemPrompt } from "@/config/openAi.prompt";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const gemini = async (contents: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const rawText = response.text || "Disculpe, no pude procesar su pregunta.";

    console.log(`🤖 RESPUESTA IA: ${response}`);

    return rawText;
  } catch (error) {
    console.error("❌ Error en la llamada a Gemini:", error);
  }
};

// const testQuestions = [
//   "¿Cuántas batería tengo si uso los earbuds por 6 horas?",
//   "¿Conectan con iPhone?",
//   "¿Puedo usarlos en el gimnasio?",
//   "¿Cuánto pesan los earbuds?",
//   "¿En qué colores vienen?",
//   "¿Tiene cancelación de ruido?",
//   "¿Cuándo puedo cobrar?",
//   "¿Qué incluye la caja?",
//   "¿Cómo se conectan con Bluetooth 5.3?",
//   "¿Puedo cargar los earbuds sin la caja?",
// ];

// // Función para probar cada pregunta
// async function testQuestion(question: string) {
//   console.log(`\n🔹 Pregunta: "${question}"`);
//   console.log("→ Respuesta de la IA:");

//   try {
//     const response = await gemini(question);
//     console.log(response);
//   } catch (error) {
//     console.error("❌ Error al procesar:", error);
//   }
// }

// // Ejecutar el bucle
// (async () => {
//   console.log("=".repeat(60));
//   console.log("🧪 BÚSQUEDA DE 10 PREGUNTAS EN LA IA");
//   console.log("=".repeat(60));

//   for (const question of testQuestions) {
//     await testQuestion(question);
//   }

//   console.log("\n" + "=".repeat(60));
//   console.log("✅ BÚSQUEDA COMPLETADA");
//   console.log("=".repeat(60));
// })();
