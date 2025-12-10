const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
});

const config = {
    apiUrl: 'http://localhost:3000/api'
};

let allData = [];
let currentPage = 1;
const rowsPerPage = 10;

let chartCategoriasInstance = null;
let chartPagosInstance = null;

async function cargarDashboard() {
    try {
        const res = await fetch(config.apiUrl + '/datos');
        const data = await res.json();
        allData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        actualizarGraficos(allData);
        displayPage(1);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function displayPage(page) {
    currentPage = page;
    const tbody = document.querySelector('#tablaVentas tbody');
    tbody.innerHTML = '';
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = allData.slice(startIndex, endIndex);
    paginatedItems.forEach(v => {
        const precioFormateado = formatoCOP.format(v.precio);
        const envio = v.tipo_envio || 'Standard';
        const calif = v.satisfaccion ? `⭐ ${v.satisfaccion}` : 'N/A';
        const row = `<tr>
            <td>${v.fecha}</td>
            <td>${v.producto}</td>
            <td>${v.categoria}</td>
            <td>${envio}</td>
            <td style="text-align:center">${calif}</td>
            <td style="color: #00e676; font-weight: bold;">${precioFormateado}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function actualizarGraficos(data) {
    Chart.register(ChartDataLabels);

    const categoriasCount = {};
    const pagosCount = {};

    data.forEach(d => {
        categoriasCount[d.categoria] = (categoriasCount[d.categoria] || 0) + 1;
        pagosCount[d.metodo_pago] = (pagosCount[d.metodo_pago] || 0) + 1;
    });

    // Gráfico de Barras
    const ctx1 = document.getElementById('chartCategorias').getContext('2d');
    if (chartCategoriasInstance) chartCategoriasInstance.destroy();
    
    chartCategoriasInstance = new Chart(ctx1, {
        type: 'bar',
        data: { labels: Object.keys(categoriasCount), datasets: [{ label: '# Ventas', data: Object.values(categoriasCount), backgroundColor: '#00e676' }] },
        options: {
            plugins: {
                legend: { display: false },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' }
                }
            },
            scales: {
                y: { ticks: { color: '#fff' } },
                x: { ticks: { color: '#fff' } }
            }
        }
    });

    // Gráfico de Pastel
    const ctx2 = document.getElementById('chartPagos').getContext('2d');
    // --- CORRECCIÓN AQUÍ: de "chartPagiosInstance" a "chartPagosInstance" ---
    if (chartPagosInstance) chartPagosInstance.destroy();

    const coloresGrafico = ['#00e676', '#36a2eb', '#ffce56', '#ff6384', '#9966ff'];

    chartPagosInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(pagosCount),
            datasets: [{
                data: Object.values(pagosCount),
                backgroundColor: coloresGrafico
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                },
                datalabels: {
                    formatter: (value, context) => {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return percentage;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            }
        }
    });
}


document.getElementById('ventaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevaVenta = {
        fecha: new Date().toISOString().split('T')[0],
        producto: document.getElementById('producto').value,
        categoria: document.getElementById('categoria').value,
        precio: document.getElementById('precio').value,
        metodo_pago: document.getElementById('metodo').value,
        tipo_envio: document.getElementById('envio').value,
        satisfaccion: document.getElementById('satisfaccion').value,
        edad_cliente: document.getElementById('edad').value
    };
    try {
        const res = await fetch(config.apiUrl + '/venta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaVenta)
        });
        if (res.ok) {
            alert('¡Venta registrada exitosamente!');
            cargarDashboard();
            document.getElementById('ventaForm').reset();
            if (document.querySelector('output')) document.querySelector('output').value = '5';
        } else {
            const errorData = await res.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        console.error("Error al enviar:", error);
    }
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) displayPage(currentPage - 1);
});

document.getElementById('nextButton').addEventListener('click', () => {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < totalPages) displayPage(currentPage + 1);
});

cargarDashboard();
