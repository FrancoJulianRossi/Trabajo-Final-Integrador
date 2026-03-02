// src/controllers/carousel.controller.ts

import { Request, Response } from "express";
import { Carousel } from "../models/carousel.model";
import fs from "fs/promises";
import path from "path";

const getBaseUrl = (req: Request) => `${req.protocol}://${req.get("host")}`;

export const getPublicItems = async (req: Request, res: Response) => {
  try {
    const activeItems = await Carousel.findAll({
      where: { isActive: true },
      order: [["order", "ASC"]],
    });
    res.status(200).json(activeItems);
  } catch (error) {
    console.error("Error fetching public carousel items:", error);
    res.status(500).json({ message: "Error fetching carousel items" });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Carousel.findAll({
      order: [["order", "ASC"]],
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    res.status(500).json({ message: "Error fetching carousel items" });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      link,
      order,
      isActive,
      desktopImageUrl: providedDesktopUrl,
      mobileImageUrl: providedMobileUrl,
    } = req.body;
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const desktopFiles = files?.desktopImage;
    const mobileFiles = files?.mobileImage;

    // Validar que se proporcione una imagen (ya sea archivo o URL)
    if (!desktopFiles || desktopFiles.length === 0) {
      if (!providedDesktopUrl) {
        return res.status(400).json({
          message:
            "Se requiere imagen de escritorio: sube un archivo o proporciona una URL.",
        });
      }
    }

    // Determinar URLs finales: usar archivos si existen, sino URLs proporcionadas
    const desktopImageUrl =
      desktopFiles && desktopFiles.length > 0
        ? `${getBaseUrl(req)}/uploads/carousel/${desktopFiles[0]!.filename}`
        : providedDesktopUrl;

    const mobileImageUrl =
      mobileFiles && mobileFiles.length > 0
        ? `${getBaseUrl(req)}/uploads/carousel/${mobileFiles[0]!.filename}`
        : providedMobileUrl || null;

    const newItem = await Carousel.create({
      title,
      subtitle: subtitle || null,
      link: link || null,
      order: parseInt(order, 10) || 0,
      isActive: isActive === "true" || isActive === true,
      desktopImageUrl,
      mobileImageUrl: mobileImageUrl || null,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating carousel item:", error);
    res.status(500).json({ message: "Error creating carousel item" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      link,
      order,
      isActive,
      desktopImageUrl: providedDesktopUrl,
      mobileImageUrl: providedMobileUrl,
    } = req.body;
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const item = await Carousel.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    const desktopFiles = files?.desktopImage;
    const mobileFiles = files?.mobileImage;

    // Si se sube una nueva imagen de escritorio, elimina la anterior
    try {
      // Helper to safely delete a local upload file if it exists and URL is local
      const tryDeleteLocalFile = async (url?: string) => {
        if (!url) return;
        const baseUrl = getBaseUrl(req);
        const appearsLocal =
          url.startsWith(baseUrl) ||
          url.startsWith("/uploads/") ||
          url.includes("/uploads/carousel/");
        if (!appearsLocal) return;

        const oldFilename = path.basename(url);
        const filePath = path.resolve("uploads", "carousel", oldFilename);
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (err) {
          // If file doesn't exist or can't be accessed, ignore silently
          return;
        }
      };

      if (desktopFiles && desktopFiles.length > 0) {
        await tryDeleteLocalFile(item.desktopImageUrl);
        item.desktopImageUrl = `${getBaseUrl(req)}/uploads/carousel/${desktopFiles[0]!.filename}`;
      } else if (providedDesktopUrl) {
        // Si se proporciona una URL, usarla
        item.desktopImageUrl = providedDesktopUrl;
      }

      if (mobileFiles && mobileFiles.length > 0) {
        await tryDeleteLocalFile(item.mobileImageUrl || undefined);
        item.mobileImageUrl = `${getBaseUrl(req)}/uploads/carousel/${mobileFiles[0]!.filename}`;
      } else if (providedMobileUrl) {
        item.mobileImageUrl = providedMobileUrl;
      }
    } catch (error) {
      console.error(`Error al procesar imágenes para el item ${id}:`, error);
      // No bloqueamos la actualización si ocurre algún error al procesar imágenes
    }

    // Actualizar propiedades del item
    if (title !== undefined) item.title = title;
    if (subtitle !== undefined) item.subtitle = subtitle || null;
    if (link !== undefined) item.link = link || null;
    if (order !== undefined) item.order = parseInt(order, 10);
    if (isActive !== undefined)
      item.isActive = isActive === "true" || isActive === true;

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    console.error("Error updating carousel item:", error);
    res.status(500).json({ message: "Error updating carousel item" });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Carousel.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    // Eliminar imágenes asociadas del sistema de archivos
    try {
      // reuse local-delete logic: only remove if looks like local upload and exists
      const tryDeleteLocalFile = async (url?: string) => {
        if (!url) return;
        const appearsLocal =
          url.startsWith(getBaseUrl(req)) ||
          url.startsWith("/uploads/") ||
          url.includes("/uploads/carousel/");
        if (!appearsLocal) return;
        const oldFilename = path.basename(url);
        const filePath = path.resolve("uploads", "carousel", oldFilename);
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (err) {
          return;
        }
      };

      await tryDeleteLocalFile(item.desktopImageUrl);
      if (item.mobileImageUrl) {
        await tryDeleteLocalFile(item.mobileImageUrl);
      }
    } catch (error) {
      console.error(
        `Error al eliminar archivos de imagen para el item ${id}:`,
        error,
      );
      // No devolvemos un error al cliente si los archivos no existían
    }

    await item.destroy();
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error deleting carousel item:", error);
    res.status(500).json({ message: "Error deleting carousel item" });
  }
};
