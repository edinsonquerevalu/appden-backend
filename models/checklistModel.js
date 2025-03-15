import pool from "../database/db.js";

class ChecklistModel {
    static async getAll() {
        const [rows] = await pool.query('SELECT id_checklist, nombre_checklist FROM Checklist');
        return rows.map(row => ({
            id: row.id_checklist,
            nombre_checklist: row.nombre_checklist
        }));
    }

    static async create(nombreChecklist, preguntas) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [checklistResult] = await connection.query(
                'INSERT INTO Checklist (nombre_checklist) VALUES (?)',
                [nombreChecklist]
            );

            const idChecklist = checklistResult.insertId;

            for (const pregunta of preguntas) {
                await connection.query(
                    'INSERT INTO preguntas (id_checklist, texto_pregunta) VALUES (?, ?)',
                    [idChecklist, pregunta]
                );
            }

            await connection.commit();
            return idChecklist;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(idChecklist, nuevoNombre, preguntas) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Actualizar el nombre del checklist
            await connection.query(
                'UPDATE Checklist SET nombre_checklist = ? WHERE id_checklist = ?',
                [nuevoNombre, idChecklist]
            );

            // Obtener preguntas existentes
            const [preguntasExistentes] = await connection.query(
                'SELECT id_pregunta FROM preguntas WHERE id_checklist = ?',
                [idChecklist]
            );

            const idsPreguntasExistentes = preguntasExistentes.map(p => p.id_pregunta);
            const idsPreguntasRecibidas = preguntas.map(p => p.id).filter(id => id); // Solo IDs válidos

            // Eliminar preguntas que ya no están en la lista
            const idsParaEliminar = idsPreguntasExistentes.filter(id => !idsPreguntasRecibidas.includes(id));
            if (idsParaEliminar.length > 0) {
                await connection.query('DELETE FROM Respuestas WHERE id_pregunta IN (?)', [idsParaEliminar]);
                await connection.query('DELETE FROM preguntas WHERE id_pregunta IN (?)', [idsParaEliminar]);
            }

            // Insertar nuevas preguntas (las que no tienen ID)
            for (const pregunta of preguntas) {
                if (!pregunta.id) {
                    await connection.query(
                        'INSERT INTO preguntas (id_checklist, texto_pregunta) VALUES (?, ?)',
                        [idChecklist, pregunta.texto_pregunta]
                    );
                }
            }

            // Actualizar preguntas existentes
            for (const pregunta of preguntas) {
                if (pregunta.id) {
                    await connection.query(
                        'UPDATE preguntas SET texto_pregunta = ? WHERE id_pregunta = ?',
                        [pregunta.texto_pregunta, pregunta.id]
                    );
                }
            }

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }



    static async delete(idChecklist) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Elimina las respuestas primero
            await connection.query('DELETE FROM Respuestas WHERE id_checklist = ?', [idChecklist]);

            // Elimina las preguntas asociadas
            await connection.query('DELETE FROM preguntas WHERE id_checklist = ?', [idChecklist]);

            // Finalmente elimina el checklist
            const [result] = await connection.query('DELETE FROM Checklist WHERE id_checklist = ?', [idChecklist]);

            await connection.commit();

            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export { ChecklistModel };
