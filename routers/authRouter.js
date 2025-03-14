import express from 'express';
import { login } from '../controllers/authController.js';
import { registrarTrabajador } from '../controllers/registroController.js';

const router = express.Router();

router.post('/login', login);
router.post('/admin/registrar-trabajador', registrarTrabajador);
export default router;
