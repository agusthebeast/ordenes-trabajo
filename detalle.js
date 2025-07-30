import { db } from "./firebase-config.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { subirImagenCloudinary } from "./cloudinary.js";

const params = new URLSearchParams(window.location.search);
const ordenId = params.get("id");

const obsInput = document.getElementById("obs-tecnico");
const precioInput = document.getElementById("precio");
const fotoInput = document.getElementById("foto");
const form = document.getElementById("detalle-form");

async function cargarDetalle() {
  const ref = doc(db, "ordenes", ordenId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    obsInput.value = data.detallesTecnico?.observaciones || "";
    precioInput.value = data.detallesTecnico?.precio || 0;
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  let imagenURL = "";
  const file = fotoInput.files[0];
  if (file) {
    imagenURL = await subirImagenCloudinary(file);
  }

  const detalles = {
    observaciones: obsInput.value,
    precio: parseFloat(precioInput.value),
    imagen: imagenURL
  };

  const ref = doc(db, "ordenes", ordenId);
  await updateDoc(ref, { detallesTecnico: detalles });

  alert("Detalle técnico guardado");
  window.location.href = "ver.html";
});

cargarDetalle();
