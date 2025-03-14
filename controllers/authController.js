import { authenticateTrabajador } from '../services/authService.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { id_trabajador, tipo_trabajador } = await authenticateTrabajador(email, password);
        res.json({ 
            message: 'Login exitoso',
            id_trabajador: id_trabajador,
            tipo_trabajador: tipo_trabajador 
        });
    } catch (error) {
        if (error.message === 'El usuario no está activo') {
            res.status(403).json({ message: error.message }); // 403 Forbidden
        } else {
            res.status(401).json({ message: error.message }); // 401 Unauthorized
        }
    }
};