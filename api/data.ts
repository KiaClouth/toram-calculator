import {NextApiRequest, NextApiResponse} from "next";
import mysql from "mysql2/promise";

export const getDataInfo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  console.log("草");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    const [rows] = await connection.query("SHOW TABLES");
    res.status(200).json(rows);
  } catch (e) {
    // res.status(500).json({message: e.message});
  }
};
