const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

const DB_FILE = path.join(__dirname, '..', 'libros.json');
const libroPrueba = { id: 'test123', titulo: 'Libro de Prueba', autor: 'Autor Prueba' };

beforeAll(() => {
    // Asegurarse de que el archivo de libros existe y está vacío
    fs.writeFileSync(DB_FILE, '[]', 'utf8');
});

afterAll(() => {
    // Limpiar el archivo de libros después de las pruebas
    fs.writeFileSync(DB_FILE, '[]', 'utf8');
});

describe('API de Biblioteca', () => {
    it('Debe responder el endpoint raíz', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toMatch(/biblioteca/i);
    });

    it('Debe agregar un libro nuevo', async () => {
        const res = await request(app)
            .post('/libros')
            .send(libroPrueba);
        expect(res.statusCode).toBe(201);
        expect(res.body.libro).toMatchObject(libroPrueba);
    });

    it('Debe obtener todos los libros', async () => {
        const res = await request(app).get('/libros');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(l => l.id === libroPrueba.id)).toBe(true);
    });

    it('Debe buscar un libro por ID', async () => {
        const res = await request(app).get(`/libros/${libroPrueba.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.libro).toMatchObject(libroPrueba);
    });

    it('Debe actualizar un libro', async () => {
        const cambios = { titulo: 'Libro Modificado' };
        const res = await request(app)
            .put(`/libros/${libroPrueba.id}`)
            .send(cambios);
        expect(res.statusCode).toBe(200);
        expect(res.body.libro.titulo).toBe(cambios.titulo);
    });

    it('Debe eliminar un libro', async () => {
        const res = await request(app).delete(`/libros/${libroPrueba.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toMatch(/eliminado/i);
    });

    it('Debe responder 404 si el libro no existe', async () => {
        const res = await request(app).get('/libros/noexiste');
        expect(res.statusCode).toBe(404);
    });
});