const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.all("SELECT source, COUNT(*) as count FROM startup GROUP BY source;", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.table(rows);
    }
    db.close();
});
