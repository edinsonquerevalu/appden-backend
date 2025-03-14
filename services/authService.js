import bcrypt from 'bcrypt';
import { Trabajador } from "../models/trabajadorModel.js";

export const authenticateTrabajador = async (email, password) => {
    const trabajador = await Trabajador.findByEmail(email);

    if (!trabajador) {
        throw new Error('Usuario o contraseña incorrecta'); 
    }

    // Verificar el estado del trabajador
    if (trabajador.estado_trabajador !== 1) {
        throw new Error('El usuario no está activo');
    }

    const passwordMatch = await bcrypt.compare(password, trabajador.password_trabajador);
    if (!passwordMatch) {
        throw new Error('Usuario o contraseña incorrecta');
    }

    return {
        id_trabajador: trabajador.id_trabajador,
        tipo_trabajador: trabajador.tipo_trabajador
    };
};