const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "chat"
});

function _beginTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) return reject(err);
            resolve(connection);
        });
    });
}

function _commit(connection) {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function _rollback(connection) {
    return new Promise((resolve) => {
        connection.rollback(() => {
            resolve();
        });
    });
}

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            resolve(connection);
        });
    });
}

function query(statement, params = []) {
    const connection = this.connection || pool;
    return new Promise((resolve, reject) => {
        connection.query(statement, params, function (error, results) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

async function transaction(run) {
    const connection = await getConnection();
    try {
        await _beginTransaction(connection);
        await run(query.bind({ connection }));
        await _commit(connection);
    } catch (e) {
        console.error("[datbase] \t❌ transaction failed: ", e);
        await _rollback(connection);
    } finally {
        connection.release();
    }
}

async function runMigrations() {
    await query(`
        CREATE TABLE IF NOT EXISTS __migration (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        );
    `);
    const migrationsDirectory = path.join(__dirname, "../db-migrations");
    for (const file of fs.readdirSync(migrationsDirectory)) {
        const results = await query("SELECT * FROM __migration WHERE name=?", [file]);
        if (results.length > 0) continue;
        const sqlStatement = fs.readFileSync(path.join(migrationsDirectory, file), "utf-8");
        await query(sqlStatement);
        await query("INSERT INTO __migration SET ?", {
            name: file
        });
        console.log("[database] \t✅ Database migration ran: ", file);
    }
    console.log("[database] \t👍 All database migrations ran.");
}

module.exports = { query, runMigrations, getConnection, transaction };