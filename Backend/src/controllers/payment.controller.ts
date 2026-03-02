import { Request, Response } from "express";
import paymentService from "../services/payment.service";

/**
 * Crea una preferencia de Mercado Pago para el pago de tickets
 * Body: { userId, screeningId, seatIds: number[] }
 */
export const createPreference = async (req: Request, res: Response) => {
  try {
    const { userId, screeningId, seatIds } = req.body;

    // Validar que se proporcionen los datos necesarios
    if (!userId || !screeningId || !seatIds || !Array.isArray(seatIds)) {
      return res.status(400).json({
        message:
          "Missing or invalid required fields: userId, screeningId, seatIds",
      });
    }

    if (seatIds.length === 0) {
      return res.status(400).json({
        message: "At least one seat must be selected",
      });
    }

    // Llamar al servicio para crear la preferencia
    const preference = await paymentService.createPreference(
      userId,
      screeningId,
      seatIds,
    );

    return res.status(201).json({
      success: true,
      message: "Preference created successfully",
      data: preference,
    });
  } catch (error: any) {
    console.error("Error creating preference:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Webhook para recibir notificaciones de Mercado Pago
 * Actualiza el estado de la reserva cuando se aprueba el pago
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    // Mercado Pago envía diferentes tipos de notificaciones
    // Nos interesa "payment" cuando el estado es "approved"
    if (type === "payment") {
      const paymentId = data?.id;

      if (!paymentId) {
        return res.status(400).json({
          message: "Missing payment ID in webhook",
        });
      }

      // Aquí deberías buscar la preferencia usando el payment ID
      // Para este flujo simple, asumimos que el external_reference
      // viene en las notificaciones de Mercado Pago

      // Este es un punto de inicio; necesitarás integrar con la API
      // de Mercado Pago para obtener los detalles del pago
      console.log("Webhook received for payment:", paymentId);
    }

    // Responder inmediatamente a Mercado Pago
    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Webhook mejorado que maneja payment.updated notifications
 * Mercado Pago envía el external_reference en la notificación
 */
export const handleMercadopagoWebhook = async (req: Request, res: Response) => {
  try {
    // 1. Extraer el ID (Soporta tanto Webhooks por body como IPNs por query)
    const paymentId =
      req.body?.data?.id || req.query?.["data.id"] || req.query?.id;
    const type = req.body?.type || req.query?.topic;

    // 2. Responder SIEMPRE 200 inmediatamente a Mercado Pago para evitar reintentos infinitos
    res.status(200).send("OK");

    // Si no hay ID o no es un evento de pago, ignoramos (pero ya respondimos 200)
    if (type !== "payment" || !paymentId) {
      return;
    }

    console.log(
      `🔔 Webhook recibido! Consultando detalles del pago ID: ${paymentId}...`,
    );

    // 3. Buscar la información COMPLETA del pago en la API de Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!mpResponse.ok) {
      console.error(
        "❌ Error al consultar la API de Mercado Pago para el pago:",
        paymentId,
      );
      return;
    }

    const paymentInfo = await mpResponse.json();

    // 4. Ahora sí, extraemos los datos reales
    const status = paymentInfo.status;
    const externalReference = paymentInfo.external_reference;

    console.log(
      `✅ Pago ${paymentId} encontrado. Estado: [${status}] - Reserva ID: [${externalReference}]`,
    );

    // 5. Actualizar la base de datos
    if (status === "approved" && externalReference) {
      await paymentService.approveReservation(externalReference);
      console.log(
        `🎉 ¡Reserva ${externalReference} aprobada exitosamente en la base de datos!`,
      );
    }
  } catch (error: any) {
    console.error("❌ Error en el webhook de Mercado Pago:", error);
    // Nota: Como ya enviamos el res.status(200) arriba, no podemos enviar otra respuesta aquí.
  }
};

/**
 * Obtiene el estado actual de una reserva
 * Params: reservationId
 */
export const getReservationStatus = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;

    if (!reservationId) {
      return res.status(400).json({
        message: "Reservation ID is required",
      });
    }

    const reservation = await paymentService.getReservationStatus(
      parseInt(reservationId, 10),
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error: any) {
    console.error("Error getting reservation status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Cancela una reserva (solo si está en estado Pending)
 * Params: reservationId
 */
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;

    if (!reservationId) {
      return res.status(400).json({
        message: "Reservation ID is required",
      });
    }

    const reservation = await paymentService.cancelReservation(
      parseInt(reservationId, 10),
    );

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (error: any) {
    console.error("Error cancelling reservation:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};