import { Request, Response } from "express";
import twilio from "twilio";
import { respondUser } from "./service";

/**
 * 📞 SE DISPARA CUANDO TWILIO RECIBE UNA LLAMADA
 */
export const handleReceiveCall = (req: Request, res: Response) => {
  console.info("😀 [handleReceiveCall] started");

  const twiml = new twilio.twiml.VoiceResponse();

  // Iniciamos con turnCount=1
  const gather = twiml.gather({
    input: ["speech"],
    // Agregamos turnCount=1 a la URL de acción
    action: "/twilio/process?turnCount=1",
    method: "POST",
    speechTimeout: "auto",
    language: "es-CO",
    timeout: 6,
    enhanced: true,
    bargeIn: true, // Deja de reproducir audio si el usuario empieza a hablar (mejora UX)
    actionOnEmptyResult: true, // Si no hay voz, ir al process (para manejar error/silencio)
  });

  gather.say(
    {
      voice: "Google.es-US-Chirp3-HD-Aoede",
      language: "es-MX",
    },
    "Hola bienvenido. ¿En qué puedo ayudarle?",
  );

  res.type("text/xml");
  res.send(twiml.toString());

  console.info("😎 [handleReceiveCall] finished");
};

/**
 * 💬 Proceso de Voz (Loop)
 */
export const handleProcessSpeech = async (req: Request, res: Response) => {
  console.info("🎤 [handleProcessSpeech] started");

  const twiml = new twilio.twiml.VoiceResponse();

  // 1. Obtener el turno actual desde la query string
  const maxTurns = 50; // TODO: Límite de seguridad para costos
  let currentTurn = parseInt(req.query.turnCount as string, 10) || 1;

  // 2. Obtener la transcripción
  const speechResult = req.body.SpeechResult || "";

  try {
    // Caso 1: Silencio o Error de reconocimiento (SpeechResult vacío)
    if (!speechResult) {
      // Si es el primer turno y no dijo nada, repetimos.
      // Si ya lleva muchos turnos de silencio, colgamos.
      if (currentTurn > 3) {
        twiml.say(
          {
            voice: "Polly.Mia",
            language: "es-MX",
          },
          "Gracias por su llamada, hasta pronto.",
        );

        twiml.hangup();
      } else {
        twiml.say(
          {
            voice: "Polly.Mia",
            language: "es-MX",
          },
          "Disculpe, no le entendí. ¿Me repite la pregunta?",
        );

        // Mantenemos el mismo turnCount si es solo un rechazo,
        // o lo incrementamos para contar intentos.
        // Para simplicidad de costos, incrementamos.
        const nextTurn = currentTurn + 1;
        const nextGather = twiml.gather({
          input: ["speech"],
          action: `/twilio/process?turnCount=${nextTurn}`,
          method: "POST",
          speechTimeout: "auto",
          language: "es-CO",
          timeout: 6,
          enhanced: true,
          bargeIn: true,
          actionOnEmptyResult: true,
        });
        // El goto debe estar dentro del gather o después?
        // En TwiML, el gather se ejecuta. Al terminar, redirige a action.
        // Aquí solo definimos el gather siguiente.

        // IMPORTANTE: El gather debe ser el primer elemento si quieres escuchar inmediatamente,
        // o podemos poner Say primero y luego Gather.
        // Para este caso: Say -> Gather (espera siguiente input)

        // Corrección de lógica:
        // Si no hubo entrada, ya ejecutamos un say en la línea de arriba dentro del if?
        // NO, en TwiML los elementos se ejecutan secuencialmente.

        // Reestructurando la respuesta para el caso de silencio:
        twiml.clear(); // Limpiamos lo anterior

        twiml.say(
          {
            voice: "Polly.Mia",
            language: "es-MX",
          },
          "Disculpe, no le entendí. ¿Me repite?",
        );

        const retryGather = twiml.gather({
          input: ["speech"],
          action: `/twilio/process?turnCount=${nextTurn}`,
          method: "POST",
          speechTimeout: "auto",
          language: "es-CO",
          timeout: 5,
          enhanced: true,
          bargeIn: true,
          actionOnEmptyResult: true,
        });
      }

      res.type("text/xml");
      res.send(twiml.toString());
      return;
    }

    // ===============================================================
    // Caso 2: El usuario dijo algo
    // 👀 VERIFICACION DE PALABRAS PARA COLGAR 👀
    // ===============================================================

    const lowerSpeech = speechResult.toLowerCase();
    if (
      lowerSpeech.includes("adios") ||
      lowerSpeech.includes("basta") ||
      lowerSpeech.includes("colgar") ||
      lowerSpeech.includes("salir")
    ) {
      twiml.say(
        {
          voice: "Polly.Mia",
          language: "es-MX",
        },
        "Gracias, que tenga un buen día.",
      );

      twiml.hangup();
      res.type("text/xml");
      res.send(twiml.toString());
      return;
    }

    // ===============================================================
    // ⭐⭐⭐⭐⭐⭐⭐ ⭐⭐ POSIBLE COMPRA ⭐⭐⭐⭐⭐⭐⭐ ⭐⭐
    // ===============================================================

    // ===============================================================
    // Consulta a la IA
    if (currentTurn > maxTurns) {
      twiml.say(
        {
          voice: "Polly.Mia",
          language: "es-MX",
        },
        "Llegamos al límite de conversaciones. Gracias.",
      );
      twiml.hangup();
    } else {
      const aiResponse = await respondUser(speechResult);

      // Generar la respuesta con Say + Next Gather
      twiml.say(
        {
          voice: "Polly.Mia",
          language: "es-MX",
        },
        aiResponse,
      );

      const nextTurn = currentTurn + 1;
      const nextGather = twiml.gather({
        input: ["speech"],
        action: `/twilio/process?turnCount=${nextTurn}`,
        method: "POST",
        speechTimeout: "auto",
        language: "es-CO", // Mantén el idioma de reconocimiento
        timeout: 60, // TODO: Espera máx de 60 seg para que empiece a hablar
        enhanced: true,
        bargeIn: true, // Crucial para que no le hables por encima
        actionOnEmptyResult: true,
      });

      // Opcional: Decir "¿Algo más?"

      // nextGather.say(
      //   {
      //     voice: "Polly.Mia",
      //     language: "es-MX",
      //   },
      //   "¿Tiene otra pregunta?",
      // );
    }
  } catch (error) {
    console.error("Error en IA o flujo:", error);

    twiml.say(
      {
        voice: "Polly.Mia",
        language: "es-MX",
      },
      "Se produjo un error interno. Lamento el inconveniente.",
    );
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
  console.info("😎 [handleProcessSpeech] finished");
};

/**
 * ⁉️ Handle errors de Twilio si el webhook falla
 */
export const getErrors = (req: Request, res: Response) => {
  console.error("💢 ERROR Twilio:", req.body);
  // Enviar 200 para no hacer que Twilio reintente infinitely
  res.status(200).send();
};
