const express = require('express');
const mysql = require("mysql");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const puerto = process.env.PUERTO || 3001;

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    database: "empleadosbd",
    user: "root",
    password: "",
});

conexion.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        conexion.end();
    } else {
        console.log("Conexión exitosa a la base de datos");
    }
});

// Ruta para mostrar todos los empleados
app.get('/api/empleados', (req, res) => {
    conexion.query('SELECT * FROM empleados', (error, filas) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(filas);
        }
    });
});

// Ruta para mostrar un empleado por ID
app.get('/api/empleados/:id', (req, res) => {
    conexion.query('SELECT * FROM empleados WHERE id = ?', [req.params.id], (error, fila) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(fila[0]);
        }
    });
});

// Ruta para crear un empleado
app.post('/api/empleados', (req, res) => {
    const data = req.body;
    const sql = "INSERT INTO empleados SET ?";
    conexion.query(sql, data, (error, resultado) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send({ id: resultado.insertId, ...data });
        }
    });
});

// Ruta para actualizar un empleado
app.put('/api/empleados/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    console.log("Datos recibidos para actualizar:", data);
    const sql = "UPDATE empleados SET ? WHERE id = ?";
    conexion.query(sql, [data, id], (error, resultado) => {
        if (error) {
            console.error("Error al actualizar empleado:", error);
            res.status(500).send(error);
        } else {
            res.send(resultado);
        }
    });
});

// Ruta para eliminar un empleado
app.delete('/api/empleados/:id', (req, res) => {
    conexion.query('DELETE FROM empleados WHERE id = ?', [req.params.id], (error, resultado) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(resultado);
        }
    });
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});
