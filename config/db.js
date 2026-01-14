import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abhishek",          // 👈 CHANGE THIS IF YOU SET A PASSWORD
  database: "campushub_db",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

export default db;
