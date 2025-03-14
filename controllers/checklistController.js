import { ChecklistModel } from "../models/checklistModel.js";

const ChecklistController = {
    async getChecklists(req, res) {
        try {
            const checklists = await ChecklistModel.getAll();
            res.json({ checklists });  // Devuelve un array de objetos con id y nombre
        } catch (error) {
            console.error('Error fetching checklists:', error);
            res.status(500).json({ message: 'Error fetching checklists' });
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const { nombre_checklist, preguntas } = req.body;

        try {
            const success = await ChecklistModel.update(id, nombre_checklist, preguntas);
            if (success) {
                res.json({ message: "Checklist actualizado correctamente" });
            } else {
                res.status(404).json({ error: "Checklist no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el checklist" });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        try {
            const success = await ChecklistModel.delete(id);
            if (success) {
                res.json({ message: "Checklist eliminado correctamente" });
            } else {
                res.status(404).json({ error: "Checklist no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el checklist" });
        }
    },
    
    async createChecklist(req, res) {
        try {
            const { nombre_checklist, preguntas } = req.body;
            if (!nombre_checklist || !Array.isArray(preguntas) || preguntas.length === 0) {
                return res.status(400).json({
                    message: 'El nombre del checklist y al menos una pregunta son obligatorios'
                });
            }

            const idChecklist = await ChecklistModel.create(nombre_checklist, preguntas);

            res.status(201).json({
                message: 'Checklist y preguntas creados correctamente',
                id_checklist: idChecklist
            });
            
        } catch (error) {
            console.error('Error creando checklist con preguntas:', error);
            res.status(500).json({ message: 'Error al crear checklist y preguntas' });
        }
    }


};

export { ChecklistController };
