import express from 'express';
import { ChecklistController } from '../controllers/checklistController.js';
import { getPreguntas } from '../controllers/preguntasController.js';
import pool from "../database/db.js";
import moment from 'moment-timezone';

const router = express.Router();

router.get('/fetch', ChecklistController.getChecklists);
router.post('/add', ChecklistController.createChecklist);
router.get('/:idChecklist/preguntas', getPreguntas)
router.put("/:id/update", ChecklistController.update); 
router.delete("/:id/delete", ChecklistController.delete);


// Obtener historial de checklists diferenciando por fecha y hora
router.get('/historial', async (req, res) => {
    try {
        const [checklists] = await pool.query(
            `SELECT c.id_checklist, 
                    c.nombre_checklist, 
                    t.nombre_trabajador, 
                    r.fecha_hora, 
                    r.id_trabajador
            FROM Respuestas r
            JOIN Checklist c ON r.id_checklist = c.id_checklist
            JOIN Trabajadores t ON r.id_trabajador = t.id_trabajador
            GROUP BY r.fecha_hora, r.id_checklist, r.id_trabajador
            ORDER BY r.fecha_hora DESC`
        );

        // Convertir fecha a zona horaria de Lima (GMT-5)
        const checklistsConvertidos = checklists.map(checklist => ({
            ...checklist,
            fecha_hora: moment(checklist.fecha_hora).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')
        }));

        res.json({ checklists: checklistsConvertidos });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});

// Obtener preguntas y respuestas de un checklist específico con fecha y hora
router.get('/historial/:id_trabajador/:id_checklist', async (req, res) => {
    try {
        const { id_trabajador, id_checklist } = req.params;

        // Consulta para obtener las respuestas filtradas por id_trabajador e id_checklist
        const [respuestas] = await pool.query(
            `SELECT r.fecha_hora, p.id_pregunta, p.texto_pregunta, r.respuesta
             FROM Respuestas r
             JOIN Preguntas p ON r.id_pregunta = p.id_pregunta
             WHERE r.id_trabajador = ? AND r.id_checklist = ?
             ORDER BY r.fecha_hora DESC`,
            [id_trabajador, id_checklist]
        );

        // Agrupar las respuestas por fecha_hora
        const respuestasAgrupadas = respuestas.reduce((acc, respuesta) => {
            const fecha = moment(respuesta.fecha_hora).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');

            if (!acc[fecha]) {
                acc[fecha] = [];
            }

            acc[fecha].push({
                id_pregunta: respuesta.id_pregunta,
                texto_pregunta: respuesta.texto_pregunta,
                respuesta: respuesta.respuesta,
            });

            return acc;
        }, {});

        // Convertir las respuestas agrupadas a un array
        const respuestasFinales = Object.keys(respuestasAgrupadas).map(fecha => ({
            fecha_hora: fecha,
            respuestas: respuestasAgrupadas[fecha],
        }));

        // Devolver la respuesta agrupada
        res.json({ respuestas: respuestasFinales });
    } catch (error) {
        console.error('Error al obtener respuestas agrupadas:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});




export default router;
