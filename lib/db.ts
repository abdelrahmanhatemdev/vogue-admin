import mysql, { Pool } from "mysql2/promise";

declare global {
  var _mysqlPool: Pool | undefined;
}

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}
const pool:Pool = global._mysqlPool as Pool || undefined;

export default pool;
