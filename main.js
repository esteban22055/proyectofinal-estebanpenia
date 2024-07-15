// Función para cargar trámites desde un archivo JSON local
const cargarTramites = async () => {
    try {
        const response = await fetch('tramites.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los trámites:', error);
        return [];
    }
};

// Función para llenar el select de trámites
const llenarSelectTramites = async () => {
    const tramites = await cargarTramites();
    const selectTramite = document.getElementById("tramite");

    tramites.forEach(tramite => {
        const option = document.createElement("option");
        option.value = tramite.id;
        option.textContent = tramite.nombre;
        selectTramite.appendChild(option);
    });
};

// Función para validar email
const validarEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(String(email).toLowerCase());

// Función para manejar el formulario de trámites
const manejarFormulario = async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const tramiteId = document.getElementById("tramite").value;
    const cuotas = document.getElementById("cuotas").value;

    if (!validarEmail(email)) {
        alert("Email no válido. Por favor, ingrese un email correcto.");
        return;
    }

    const tramites = await cargarTramites();
    const tramite = tramites.find(t => t.id === tramiteId);

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <p>Trámite: ${tramite.nombre}</p>
        <p>Costo: $${tramite.costo}</p>
        <p>Cuotas: ${cuotas}</p>
        <p>Resumen de pago:</p>
        <ul>
            ${Array.from({ length: parseInt(cuotas) }, (_, i) => `<li>Cuota ${i + 1}: $${(tramite.costo / cuotas).toFixed(2)}</li>`).join('')}
        </ul>
        <button id="confirmarBtn">Confirmar Trámite</button>
        <button id="cancelarBtn">Cancelar Trámite</button>
    `;

    document.getElementById("confirmarBtn").addEventListener("click", () => {
        resultadoDiv.innerHTML = "<p>Trámite Confirmado.</p>";
        // Guardar datos en localStorage
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("apellido", apellido);
        localStorage.setItem("email", email);
        localStorage.setItem("tramite", tramite.nombre);
        localStorage.setItem("cuotas", cuotas);
    });

    document.getElementById("cancelarBtn").addEventListener("click", () => {
        resultadoDiv.innerHTML = "<p>Trámite Cancelado.</p>";
    });
};

// Llenar el select de trámites al cargar la página
document.addEventListener("DOMContentLoaded", llenarSelectTramites);

// Manejar el envío del formulario
document.getElementById("tramiteForm").addEventListener("submit", manejarFormulario);
