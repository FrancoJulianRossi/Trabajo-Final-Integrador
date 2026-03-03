// src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Middleware para validar los datos de entrada para un item de carrusel.
 * Valida que los campos requeridos estén presentes y sean del tipo correcto.
 */
export const validateCarouselItem = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, order, isActive } = req.body;

  // Validar que title no esté vacío
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      message:
        'El campo "title" es requerido y debe ser una cadena de texto no vacía.',
    });
  }

  // Validar que order sea un número válido
  if (order === undefined || order === null) {
    return res.status(400).json({
      message: 'El campo "order" es requerido y debe ser un número.',
    });
  }

  const orderNum = parseInt(order, 10);
  if (isNaN(orderNum) || orderNum < 0) {
    return res.status(400).json({
      message: 'El campo "order" debe ser un número no negativo.',
    });
  }

  // Validar que isActive sea un booleano
  if (isActive === undefined || isActive === null) {
    return res.status(400).json({
      message: 'El campo "isActive" es requerido y debe ser un booleano.',
    });
  }

  const isActiveBool = isActive === "true" || isActive === true;
  if (
    typeof isActive !== "boolean" &&
    isActive !== "true" &&
    isActive !== "false"
  ) {
    return res.status(400).json({
      message:
        'El campo "isActive" debe ser un booleano o las cadenas "true"/"false".',
    });
  }

  // Validar que subtitle sea una cadena si está presente
  if (
    req.body.subtitle !== undefined &&
    typeof req.body.subtitle !== "string"
  ) {
    return res.status(400).json({
      message: 'El campo "subtitle" debe ser una cadena de texto.',
    });
  }

  // Validar que link sea una cadena si está presente
  if (req.body.link !== undefined && typeof req.body.link !== "string") {
    return res.status(400).json({
      message: 'El campo "link" debe ser una cadena de texto.',
    });
  }

  next();
};
