const tablaBuyBody = document.querySelector("#tabla-buy tbody");
const tablaSellBody = document.querySelector("#tabla-sell tbody");
const promediosAnteriores = {};

async function obtenerDatos() {
    try {
        const respuesta = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1");
        const criptos = await respuesta.json();

        tablaBuyBody.innerHTML = "";
        tablaSellBody.innerHTML = "";

        let buys = [];
        let sells = [];

        for (let crypto of criptos) {
            const nombre = crypto.id;
            const actual = crypto.current_price;
            const variacion = (Math.random() * 0.1 - 0.05);
            const max1h = actual * (1 + Math.abs(variacion));
            const min1h = actual * (1 - Math.abs(variacion));
            const avg = (max1h + min1h) / 2;
            const senal = actual > avg ? "B" : "S";

            const data = { nombre, actual, max1h, min1h, avg, senal };

            if (senal === "B" && buys.length < 5) buys.push(data);
            if (senal === "S" && sells.length < 5) sells.push(data);

            guardarEnBD(nombre, actual, max1h, min1h, avg, senal);
            actualizarGrafico(nombre, actual, max1h, min1h, avg);
        }

        buys.forEach(crypto => insertarFila(tablaBuyBody, crypto, "success"));
        sells.forEach(crypto => insertarFila(tablaSellBody, crypto, "danger"));

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

function insertarFila(tabla, crypto, estilo) {
    const fila = document.createElement("tr");
    let avgClass = "";
    const { nombre, actual, max1h, min1h, avg, senal } = crypto;

    if (promediosAnteriores[nombre] !== undefined) {
        avgClass = avg > promediosAnteriores[nombre] ? "text-success" : "text-danger";
    }
    promediosAnteriores[nombre] = avg;

    const clase = senal === "B" ? "signal-buy" : "signal-sell";
    const icono = senal === "B" ? "📈" : "📉";
    const texto = senal === "B" ? "BUY" : "SELL";

    fila.innerHTML = `
        <td>${nombre}</td>
        <td class="numeric">${actual.toFixed(8)}</td>
        <td class="numeric">${max1h.toFixed(8)}</td>
        <td class="numeric">${min1h.toFixed(8)}</td>
        <td class="numeric ${avgClass}">${avg.toFixed(8)}</td>
        <td class="signal-cell ${clase}">${icono} ${texto}</td>
    `;
    tabla.appendChild(fila);
}

function guardarEnBD(nombre, actual, max, min, avg, senal) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, actual, max, min, avg, senal })
    }).catch(error => console.error("Error al guardar en BD:", error));
}

// Gráfica
const ctx = document.getElementById("graficoPrecio").getContext("2d");
const datosGrafico = {
    labels: [],
    datasets: [
        { label: "Actual", data: [], borderColor: "blue", fill: false },
        { label: "Highest 1h", data: [], borderColor: "green", fill: false },
        { label: "Lowest 1h", data: [], borderColor: "red", fill: false },
        { label: "Promedio", data: [], borderColor: "orange", fill: false }
    ]
};
const grafico = new Chart(ctx, {
    type: "line",
    data: datosGrafico,
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Criptomoneda" } },
            y: { title: { display: true, text: "Precio (USD)" } }
        }
    }
});

function actualizarGrafico(nombre, actual, max, min, avg) {
    if (!datosGrafico.labels.includes(nombre)) {
        datosGrafico.labels.push(nombre);
        datosGrafico.datasets[0].data.push(actual);
        datosGrafico.datasets[1].data.push(max);
        datosGrafico.datasets[2].data.push(min);
        datosGrafico.datasets[3].data.push(avg);
    } else {
        const index = datosGrafico.labels.indexOf(nombre);
        datosGrafico.datasets[0].data[index] = actual;
        datosGrafico.datasets[1].data[index] = max;
        datosGrafico.datasets[2].data[index] = min;
        datosGrafico.datasets[3].data[index] = avg;
    }
    grafico.update();
}

obtenerDatos();
setInterval(obtenerDatos, 30000);
