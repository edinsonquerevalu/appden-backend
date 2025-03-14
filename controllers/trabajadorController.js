import pool from '../database/db.js'
import bcrypt from 'bcrypt';
const getTrabajadores = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT nombre_trabajador, tipo_trabajador, dni_trabajador, estado_trabajador FROM Trabajadores");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener trabajadores:", error);
        res.status(500).json({ message: "Error al obtener los trabajadores" });
    }
};

const actualizarCredenciales = async (req, res) => {
    const { id_trabajador, passwordActual, nuevoEmail, nuevaPassword } = req.body;

    try {
        // Obtener el trabajador por ID
        const [rows] = await pool.query(
            "SELECT password_trabajador FROM Trabajadores WHERE id_trabajador = ?",
            [id_trabajador]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const trabajador = rows[0];

        // **Comparar la contraseña actual ingresada con la almacenada**
        const passwordMatch = await bcrypt.compare(passwordActual, trabajador.password_trabajador);
        if (!passwordMatch) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta" });
        }

        // **Construir la consulta de actualización dinámicamente**
        let query = "UPDATE Trabajadores SET ";
        let queryParams = [];
        
        if (nuevoEmail) {
            query += "email_trabajador = ?, ";
            queryParams.push(nuevoEmail);
        }
        if (nuevaPassword) {
            const hashedPassword = await bcrypt.hash(nuevaPassword, 8);
            query += "password_trabajador = ?, ";
            queryParams.push(hashedPassword);
        }

        // Si no hay cambios, detener la actualización
        if (queryParams.length === 0) {
            return res.status(400).json({ message: "No se han realizado cambios" });
        }

        // Completar la consulta y ejecutarla
        query = query.slice(0, -2) + " WHERE id_trabajador = ?";
        queryParams.push(id_trabajador);
        await pool.query(query, queryParams);

        return res.status(200).json({ message: "Credenciales actualizadas correctamente" });

    } catch (error) {
        console.error("Error al actualizar credenciales:", error);
        return res.status(500).json({ message: "Error al actualizar credenciales" });
    }
};

export { getTrabajadores, actualizarCredenciales };
