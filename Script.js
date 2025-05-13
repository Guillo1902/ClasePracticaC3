const tablaBody = document.querySelector("#tabla-crypto tbody");

// Objeto para guardar el promedio anterior por cripto
const promediosAnteriores = {};

async function obtenerDatos() {
    try {
        const respuesta = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1");
        const criptos = await respuesta.json();

        tablaBody.innerHTML = "";

        for (let crypto of criptos) {
            const nombre = crypto.id;
            const actual = crypto.current_price;

            const variacion = (Math.random() * 0.1 - 0.05);
            const max1h = actual * (1 + Math.abs(variacion));
            const min1h = actual * (1 - Math.abs(variacion));
            const avg = (max1h + min1h) / 2;
            const senal = actual > avg ? "B" : "S";

            insertarFila(nombre, actual, max1h, min1h, avg, senal);
            guardarEnBD(nombre, actual, max1h, min1h, avg, senal);
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

function insertarFila(nombre, actual, max, min, avg, senal) {
    const fila = document.createElement("tr");

    // Color para AVG Price
    let avgClass = "";
    if (promediosAnteriores[nombre] !== undefined) {
        if (avg > promediosAnteriores[nombre]) {
            avgClass = "text-success"; // verde
        } else if (avg < promediosAnteriores[nombre]) {
            avgClass = "text-danger"; // rojo
        }
    }

    promediosAnteriores[nombre] = avg;

    // Color para Signal
    const signalClass = senal === "B" ? "bg-success text-white fw-bold" : "bg-danger text-white fw-bold";

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>${actual.toFixed(8)}</td>
        <td>${max.toFixed(8)}</td>
        <td>${min.toFixed(8)}</td>
        <td class="${avgClass}">${avg.toFixed(8)}</td>
        <td class="${signalClass}">${senal}</td>
    `;
    tablaBody.appendChild(fila);
}

function guardarEnBD(nombre, actual, max, min, avg, senal) {
    fetch("guardar_datos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            actual,
            max,
            min,
            avg,
            senal
        })
    }).catch(error => console.error("Error al guardar en BD:", error));
}

obtenerDatos();
setInterval(obtenerDatos, 30000);


const fila = document.createElement("tr");
fila.innerHTML = `
    <td>Bitcoin</td>
    <td>$42,000</td>
    <td>$42,500</td>
    <td>$41,000</td>
    <td>$41,800</td>
    <td class="signal-cell signal-buy">BUY</td>
`;
document.querySelector("#tabla-crypto tbody").appendChild(fila);
