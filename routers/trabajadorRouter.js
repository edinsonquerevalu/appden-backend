import express from "express";

import { actualizarCredenciales } from "../controllers/trabajadorController.js";
import { getTrabajadores } from "../controllers/trabajadorController.js";

const router = express.Router();

router.get("/", getTrabajadores);
// Endpoint para actualizar correo y contraseña

router.put("/update", actualizarCredenciales);
export default router;
