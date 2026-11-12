const mysql = require('mysql2');

// Connection Pool use karne se connection disconnect hone ki problem khatam ho jati hai
const db = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'YourNewStrongPassword123!',
  database: 'u205680228_cricket_score',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database Connection Failed:', err.message);
    return;
  }
  console.log('MySQL Database Connected Successfully via Pool!');
  connection.release(); // Connection wapas pool me bhej diya
});

module.exports = db;


// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'srv664.hstgr.io', // ya '82.25.121.115'
//   user: 'u205680228_cricket_live',
//   password: 'Cricket@Kaushal25',
//   database: 'u205680228_cricket_score',
//   port: 3001
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to Hostinger MySQL Database successfully!');
// });

// module.exports = db;








// const mysql2 = require('mysql2');

// const db = mysql2.createConnection({
//   host: 'localhost',
//   user: 'root',         // Apna MySQL username dalein (default 'root' hota hai)
//   password: 'YourNewStrongPassword123!',         // Apna MySQL password dalein (agar koi password set nahi hai toh ise khali chhordein '')
//   database: 'u205680228_cricket_score',
//   port: 3306
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Local Database connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to Local MySQL Database successfully!');
// });
// const PORT = 3306;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// module.exports = db;