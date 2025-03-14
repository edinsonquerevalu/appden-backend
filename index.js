import express from "express";
import cors from 'cors';
import authRouter from './routers/authRouter.js';
import checklistRouter from './routers/checklistRouter.js';
import respuestasRouter from './routers/respuestasRouter.js';
import trabajadorRouter from './routers/trabajadorRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRouter);
app.use('/checklist', checklistRouter);
app.use('/respuestas', respuestasRouter);
app.use("/trabajadores", trabajadorRouter);


app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});