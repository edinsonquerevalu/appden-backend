import pool from "../database/db.js";

export const getPreguntas = async (req, res) => {
    const idChecklist = req.params.idChecklist;
  
    try {
      const query = 'SELECT * FROM preguntas WHERE id_checklist = ?';
      const [preguntas] = await pool.execute(query, [idChecklist]);
  
      res.status(200).json({ preguntas });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las preguntas' });
    }
  };