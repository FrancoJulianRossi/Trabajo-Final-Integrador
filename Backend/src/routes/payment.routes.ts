import { Router } from "express";
import {
  createPreference,
  handleMercadopagoWebhook,
  getReservationStatus,
  cancelReservation,
} from "../controllers/payment.controller";

const router = Router();

/**
 * POST /api/payments/create-preference
 * Crea una preferencia de Mercado Pago
 * Body: { userId, screeningId, seatIds: number[] }
 */
router.post("/payments/create-preference", createPreference);

/**
 * POST /api/payments/webhook
 * Webhook para recibir notificaciones de Mercado Pago
 * Mercado Pago enviará notificaciones POST a este endpoint
 */
router.post("/payments/webhook", handleMercadopagoWebhook);

/**
 * GET /api/payments/reservation/:reservationId
 * Obtiene el estado de una reserva
 */
router.get("/payments/reservation/:reservationId", getReservationStatus);

/**
 * DELETE /api/payments/reservation/:reservationId
 * Cancela una reserva (solo si está en estado Pending)
 */
router.delete("/payments/reservation/:reservationId", cancelReservation);

export default router;