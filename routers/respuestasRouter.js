import express from 'express';
import { sendRespuestas } from '../controllers/respuestasController.js';

const router = express.Router();

router.post('/send', sendRespuestas);

export default router;