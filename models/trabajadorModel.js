import bcrypt from "bcrypt";
import pool from "../database/db.js";

class Trabajador {
    constructor(nombre, dni, email, tipo, estado = 1) {
        this.nombre = nombre;
        this.dni = dni;
        this.email = email;
        this.tipo = tipo;
        this.estado = estado;
    }

    static async findByEmail(email) {
        try {
            const [results] = await pool.query(
                'SELECT id_trabajador, nombre_trabajador, dni_trabajador, email_trabajador, tipo_trabajador, password_trabajador, estado_trabajador FROM Trabajadores WHERE email_trabajador = ?', 
                [email]
            );
            return results[0]; // Devuelve el primer resultado de la consulta
        } catch (error) {
            console.error('Error en la consulta:', error);
            throw new Error('Error al ejecutar la consulta');
        }
    }

    static async getAllAdminsEmails() {
        try {
            const [results] = await pool.query(
                'SELECT email_trabajador FROM Trabajadores WHERE tipo_trabajador = "ADMIN"'
            );
            return results.map(admin => admin.email_trabajador);
        } catch (error) {
            console.error('Error al obtener correos de administradores:', error);
            throw new Error('Error al obtener correos de administradores');
        }
    }
    

}

class Admin extends Trabajador {
    constructor(nombre, dni, email, tipo = 'ADMIN', estado = 1) {
        super(nombre, dni, email, tipo, estado);
    }

    static verificarAcceso(trabajador) {
        if (trabajador.tipo !== 'ADMIN') {
            throw new Error('Acceso denegado. Exclusivo para ADMIN');
        }
    }

    async agregarTrabajador(nombre, dni, email, tipo, password, estado = 1) {
        Admin.verificarAcceso(this);

        try {
            const hashedPassword = await bcrypt.hash(password, 8);

            const sql = `
            INSERT INTO Trabajadores (nombre_trabajador, dni_trabajador, email_trabajador, tipo_trabajador, password_trabajador, estado_trabajador) VALUES (?, ?, ?, ?, ?, ?);
            `;

            const [result] = await pool.query(sql, [
                nombre,
                dni,
                email,
                tipo,
                hashedPassword,
                estado,
            ]);

            return {
                message: 'Trabajador agregado correctamente',
                trabajadorId: result.insertId
            };

        } catch (error) {
            console.error('Error al agregar trabajador: ', error.message);
            throw new Error('Error al agregar trabajador');
        }
    }
}

export { Trabajador, Admin };