const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3000;
const FILE_NAME = './helper/trendgear_data.csv';

app.use(cors());
app.use(express.json());

const csvWriter = createCsvWriter({
    path: FILE_NAME,
    fieldDelimiter: ';',
    header: [
        {id: 'fecha', title: 'fecha'},
        {id: 'producto', title: 'producto'},
        {id: 'categoria', title: 'categoria'},
        {id: 'precio', title: 'precio'},
        {id: 'metodo_pago', title: 'metodo_pago'},
        {id: 'tipo_envio', title: 'tipo_envio'},
        {id: 'satisfaccion', title: 'satisfaccion'},
        {id: 'edad_cliente', title: 'edad_cliente'}
    ],
    append: true
});

app.post('/api/venta', async (req, res) => {
    const { fecha, producto, categoria, precio, metodo_pago, tipo_envio, satisfaccion } = req.body;

    if (!producto || !categoria || !precio || !metodo_pago) return res.status(400).json({ error: "Faltan campos obligatorios." });
    if (parseFloat(precio) <= 0) return res.status(400).json({ error: "El precio debe ser positivo." });

    try {
        await csvWriter.writeRecords([req.body]);
        console.log('Venta guardada:', req.body);
        res.status(201).json({ message: "Venta registrada con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al escribir en el archivo." });
    }
});

app.get('/api/datos', (req, res) => {
    const results = [];

    if (!fs.existsSync(FILE_NAME)) return res.json([]);

    fs.createReadStream(FILE_NAME)
        .pipe(csvParser({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        });
});

app.listen(PORT, () => {
    console.log(`Backend de TrendGear corriendo en http://localhost:${PORT}`);
});
