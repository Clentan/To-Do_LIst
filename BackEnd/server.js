const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("empresa.db", (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});

// Create table if it doesn't exist
db.run(
    `CREATE TABLE IF NOT EXISTS usuarios (
    ProductId INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Role TEXT,
    Email TEXT,
    Status TEXT
    )`,
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Tabla creada con exito");
        }
    }
);

// Search function to fetch all users
const search = (callback) => {
    db.all("SELECT * FROM usuarios", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

// Insert data function
const insertData = db.prepare(
    `INSERT INTO usuarios (Name, Role, Email, Status) VALUES (?, ?, ?, ?)`,
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Datos insertados con exito");
        }
    }
);

// Delete data function
const deleteData = db.prepare(
    `DELETE FROM usuarios WHERE ProductId = ?`,
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Datos eliminados con exito");
        }
    }
);

// Modify data function
const modifyData = db.prepare(
    `UPDATE usuarios SET Name = ?, Role = ?, Email = ?, Status = ? WHERE ProductId = ?`,
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Datos modificados con exito");
        }
    }
);

// Create HTTP server
const server = http.createServer((req, res) => {
    // Set headers for CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle GET request to fetch all users
    if (req.method === "GET") {
        search((result) => {
            res.write(JSON.stringify(result));
            res.end();
        });
    }

    // Handle POST request to insert new user
    else if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const parseBody = JSON.parse(body);
            console.log(parseBody);

            insertData.run(
                parseBody.Name,
                parseBody.Role,
                parseBody.Email,
                parseBody.Status
            );
            console.log("Datos creados con exito");
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User created successfully" }));
        });
    }

    // Handle DELETE request to remove user
    else if (req.method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const parseBody = JSON.parse(body);
            console.log(parseBody);

            deleteData.run(parseBody.ProductId, (err) => {
                if (err) {
                    console.error("Error deleting:", err);
                } else {
                    console.log("Datos eliminados con exito");
                }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User deleted successfully" }));
        });
    }

    // Handle PUT request to update user
    else if (req.method === "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const parseBody = JSON.parse(body);
            console.log(parseBody);

            modifyData.run(
                parseBody.Name,
                parseBody.Role,
                parseBody.Email,
                parseBody.Status,
                parseBody.ProductId
            );
            console.log("Datos actualizados con exito");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated successfully" }));
        });
    }

    // Handle unsupported HTTP methods
    else {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
});

// Start the server
const port = 8000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
