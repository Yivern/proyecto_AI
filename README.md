Este proyecto, TrendGear Analytics, es un sistema de análisis de ventas construido con un enfoque simple y eficiente.

En el Frontend, se utlizó HTML, CSS y JavaScript puros para crear una interfaz limpia que incluye un formulario para registrar nuevas ventas y un dashboard dinámico. Para las visualizaciones, se integró la librería Chart.js, la cual permite generar gráficos de barras y de pastel muy atractivos para analizar las ventas por categoría y los métodos de pago.

El Backend se desarrolló con Node.js y Express, dando enfoque en la gestión de datos. Expone dos endpoints principales: un GET que lee y sirve todos los datos desde un archivo .csv, y un POST que recibe la información de nuevas ventas, la valida y la añade a este mismo archivo, asegurando la persistencia de los datos.

Para poder probar y demostrar la aplicación con datos realistas, se creó un script de ayuda en Node.js. Este script se encarga de generar 500 registros de ventas usando la librería faker, lo que me permitió llenar el archivo .csv con información coherente y visualizarla en el dashboard inmediatamente.
