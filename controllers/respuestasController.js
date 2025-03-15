import pool from "../database/db.js";
import { Trabajador } from "../models/trabajadorModel.js";
import { sendEmail } from "../services/emailService.js";

export const sendRespuestas = async (req, res) => {
    const respuestas = req.body;

    try {
        for (const respuesta of respuestas) {
            const query = `
                INSERT INTO Respuestas (id_checklist, id_pregunta, id_trabajador, respuesta, fecha_hora)
                VALUES (?, ?, ?, ?, ?)
            `;
            await pool.execute(query, [
                respuesta.id_checklist,
                respuesta.id_pregunta,
                respuesta.id_trabajador,
                respuesta.respuesta,
                respuesta.fecha_hora,
            ]);
        }

        // Obtener información del trabajador
        const [trabajadorResult] = await pool.query(
            'SELECT nombre_trabajador FROM Trabajadores WHERE id_trabajador = ?',
            [respuestas[0].id_trabajador]
        );

        if (trabajadorResult.length === 0) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }
        const nombreTrabajador = trabajadorResult[0].nombre_trabajador;

        // Obtener nombre del checklist
        const [checklistResult] = await pool.query(
            'SELECT nombre_checklist FROM Checklist WHERE id_checklist = ?',
            [respuestas[0].id_checklist]
        );

        if (checklistResult.length === 0) {
            return res.status(404).json({ message: "Checklist no encontrado" });
        }
        const nombreChecklist = checklistResult[0].nombre_checklist;

        // Obtener correos de administradores
        const adminEmails = await Trabajador.getAllAdminsEmails();

        if (adminEmails.length > 0) {
            const subject = `Checklist completado por ${nombreTrabajador}`;
            const message = `${nombreTrabajador} ACABA DE COMPLETAR EL CHECKLIST "${nombreChecklist}", REVISA APPDEN PARA MÁS INFORMACIÓN`;

            // Enviar correo a todos los administradores
            await sendEmail(adminEmails, subject, message);
        }

        res.status(200).json({ message: 'Respuestas almacenadas correctamente y notificación enviada' });

    } catch (error) {
        console.error('Error al almacenar respuestas y enviar notificación:', error);
        res.status(500).json({ error: 'Error al almacenar las respuestas o enviar notificación' });
    }
};
