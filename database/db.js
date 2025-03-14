import {createPool} from "mysql2/promise";
import 'dotenv/config'


// También funciona
// import dotenv from "dotenv";
// dotenv.config({ path: '../.env' });

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de conexiones creado');

export default pool