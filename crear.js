import { db } from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
import {
  obtenerClientes,
  guardarCliente,
  obtenerEquipos,
  guardarEquipo
} from "./utils.js";

const clienteSelect = document.getElementById("cliente-select");
const equipoSelect = document.getElementById("equipo-select");
const buscarCliente = document.getElementById("buscar-cliente");
const buscarEquipo = document.getElementById("buscar-equipo");

// Cargar listas al iniciar
let listaClientes = [];
let listaEquipos = [];

async function cargarListas() {
  listaClientes = await obtenerClientes();
  listaEquipos = await obtenerEquipos();
  actualizarSelects();
}

function actualizarSelects() {
  clienteSelect.innerHTML = listaClientes.map(c =>
    `<option value="${c.id}">${c.nombre} ${c.apellido} (${c.dni})</option>`
  ).join("");

  equipoSelect.innerHTML = listaEquipos.map(e =>
    `<option value="${e.id}">${e.marca} ${e.modelo}</option>`
  ).join("");
}

document.getElementById("nuevo-cliente").onclick = async () => {
  const nombre = prompt("Nombre:");
  const apellido = prompt("Apellido:");
  const dni = prompt("DNI:");
  const domicilio = prompt("Domicilio:");
  const localidad = prompt("Localidad:");
  const celular = prompt("Celular:");
  const correo = prompt("Correo electrónico (opcional):");

  const nuevo = await guardarCliente({ nombre, apellido, dni, domicilio, localidad, celular, correo });
  listaClientes.push(nuevo);
  actualizarSelects();
};

document.getElementById("nuevo-equipo").onclick = async () => {
  const marca = prompt("Marca:");
  const modelo = prompt("Modelo:");
  const nuevo = await guardarEquipo(marca, modelo);
  listaEquipos.push(nuevo);
  actualizarSelects();
};

// Buscar en tiempo real
buscarCliente.addEventListener("input", () => {
  const q = buscarCliente.value.toLowerCase();
  clienteSelect.innerHTML = listaClientes
    .filter(c => `${c.nombre} ${c.apellido} ${c.dni}`.toLowerCase().includes(q))
    .map(c => `<option value="${c.id}">${c.nombre} ${c.apellido} (${c.dni})</option>`)
    .join("");
});

buscarEquipo.addEventListener("input", () => {
  const q = buscarEquipo.value.toLowerCase();
  equipoSelect.innerHTML = listaEquipos
    .filter(e => `${e.marca} ${e.modelo}`.toLowerCase().includes(q))
    .map(e => `<option value="${e.id}">${e.marca} ${e.modelo}</option>`)
    .join("");
});

// Guardar orden
document.getElementById("orden-form").addEventListener("submit", async e => {
  e.preventDefault();

  const accesorios = [...document.querySelectorAll('.checkbox-group input:checked')].map(el => el.value);
  const orden = {
    clienteId: clienteSelect.value,
    equipoId: equipoSelect.value,
    accesorios,
    falla: document.getElementById("falla").value,
    observaciones: document.getElementById("observaciones").value,
    garantia: document.getElementById("garantia").value === "true",
    plazoRevision: document.getElementById("plazo").value,
    estado: "sin revisar",
    subestado: "",
    detallesTecnico: {
      observaciones: "",
      precio: 0,
      imagen: ""
    }
  };

  await addDoc(collection(db, "ordenes"), orden);
  alert("Orden guardada");
  window.location.href = "index.html";
});

cargarListas();
