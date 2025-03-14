import { Trabajador, Admin } from '../models/trabajadorModel.js';

export const registrarTrabajador = async (req, res) => {
    const { emailAdmin, nombre, dni, email, password, tipo } = req.body;

    try {
        const trabajador = await Trabajador.findByEmail(emailAdmin);

        if (!trabajador) {
            return res.status(403).json({ message: 'El administrador no existe.' });
        }

        const admin = new Admin(
            trabajador.nombre_trabajador,
            trabajador.dni_trabajador,
            trabajador.email_trabajador,
            trabajador.tipo_trabajador,
            trabajador.estado_trabajador
        );

        Admin.verificarAcceso(admin);

        const resultado = await admin.agregarTrabajador(nombre, dni, email, tipo, password);

        res.json(resultado);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
