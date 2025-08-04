const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const DB_FILE = './libros.json';

app.use(express.json());

// Leer libros
function leerLibros() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Guardar libros
function guardarLibros(libros) {
    fs.writeFileSync(DB_FILE, JSON.stringify(libros, null, 2), 'utf8');
}

// Endpoint raíz
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Biblioteca funcionando', estado: 'OK' });
});

// Obtener todos los libros
app.get('/libros', (req, res) => {
    const libros = leerLibros();
    res.json(libros);
});

// Agregar un libro
app.post('/libros', (req, res) => {
    const libros = leerLibros();
    const nuevo = req.body;

    if (!nuevo.id || !nuevo.titulo || !nuevo.autor) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (libros.some(l => l.id === nuevo.id)) {
        return res.status(409).json({ error: 'Ya existe un libro con ese ID' });
    }

    libros.push(nuevo);
    guardarLibros(libros);
    res.status(201).json({ mensaje: 'Libro agregado', libro: nuevo });
});

// Buscar libro por ID
app.get('/libros/:id', (req, res) => {
    const libros = leerLibros();
    const libro = libros.find(l => l.id === req.params.id);

    if (!libro) {
        return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ libro });
});

// Actualizar libro
app.put('/libros/:id', (req, res) => {
    const libros = leerLibros();
    const idx = libros.findIndex(l => l.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Libro no encontrado' });
    }

    libros[idx] = { ...libros[idx], ...req.body };
    guardarLibros(libros);
    res.json({ mensaje: 'Libro actualizado', libro: libros[idx] });
});

// Eliminar libro
app.delete('/libros/:id', (req, res) => {
    const libros = leerLibros();
    const nuevos = libros.filter(l => l.id !== req.params.id);

    if (nuevos.length === libros.length) {
        return res.status(404).json({ error: 'Libro no encontrado' });
    }

    guardarLibros(nuevos);
    res.json({ mensaje: 'Libro eliminado' });
});

// Exportar app para pruebas
module.exports = app;

// Iniciar servidor solo si es el archivo principal
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor de biblioteca corriendo en http://localhost:${PORT}`);
    });
}
//prueba1