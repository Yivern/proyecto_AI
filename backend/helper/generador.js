const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const FILE_NAME = 'trendgear_data.csv';

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
    ]
});

const catalogo = {
    Laptops: ["MacBook Pro 16", "Dell XPS 15", "HP Spectre x360", "Lenovo ThinkPad X1", "Asus ROG Zephyrus"],
    Smartphones: ["iPhone 15 Pro", "Samsung Galaxy S24 Ultra", "Google Pixel 8", "Xiaomi 13T", "Motorola Edge 40"],
    Accesorios: ["Mouse Logitech MX Master 3S", "Teclado Keychron K2", "Webcam Logitech C920", "Hub USB-C Anker", "Cargador GaN 100W"],
    Altavoces: ["Bose SoundLink Mini II", "JBL Flip 6", "Sonos One", "Sony SRS-XB43", "Echo Dot 5th Gen"],
    Monitores: ["Dell UltraSharp U2723QE", "LG UltraGear 27", "Samsung Odyssey G7", "BenQ PD2700U", "Monitor Portátil Arzopa"]
};

const categorias = Object.keys(catalogo);
const metodos = ['Tarjeta Credito', 'Tarjeta Debito', 'Nequi/DaviPlata', 'Efectivo', 'PayPal'];
const envios = ['Express', 'Servientrega', 'Recogida en tienda'];

const datos = [];

console.log("Generando dataset COHERENTE con precios en PESOS COLOMBIANOS...");

for (let i = 0; i < 500; i++) {
    const categoria = faker.helpers.arrayElement(categorias);
    const producto = faker.helpers.arrayElement(catalogo[categoria]);
    
    let precio;
    switch(categoria) {
        case 'Laptops': precio = faker.number.int({ min: 3500000, max: 9000000 }); break;
        case 'Smartphones': precio = faker.number.int({ min: 800000, max: 6500000 }); break;
        case 'Monitores': precio = faker.number.int({ min: 600000, max: 3500000 }); break;
        case 'Altavoces': precio = faker.number.int({ min: 150000, max: 1800000 }); break;
        default: precio = faker.number.int({ min: 80000, max: 500000 }); break;
    }
    precio = Math.ceil(precio / 10000) * 10000;

    let metodo_pago;
    if (precio > 4000000) {
        metodo_pago = faker.helpers.arrayElement(['Tarjeta Credito', 'Tarjeta Debito', 'PayPal']);
    } else {
        metodo_pago = faker.helpers.arrayElement(metodos);
    }
    
    let edad_cliente = faker.number.int({ min: 18, max: 70 });
    if (metodo_pago === 'Nequi/DaviPlata') {
        edad_cliente = faker.number.int({ min: 18, max: 40 });
    }
    
    const tipo_envio = faker.helpers.arrayElement(envios);
    let satisfaccion;
    if (tipo_envio === 'Express' || tipo_envio === 'Recogida en tienda') {
        satisfaccion = faker.number.int({ min: 4, max: 5 });
    } else {
        satisfaccion = faker.number.int({ min: 2, max: 5 });
    }

    const registro = {
        fecha: faker.date.past({ years: 1 }).toISOString().split('T')[0],
        producto: producto,
        categoria: categoria,
        precio: precio,
        metodo_pago: metodo_pago,
        tipo_envio: tipo_envio,
        satisfaccion: satisfaccion,
        edad_cliente: edad_cliente
    };

    datos.push(registro);
}

csvWriter.writeRecords(datos)
    .then(() => {
        console.log(`✅ Dataset coherente generado con éxito.`);
    });
