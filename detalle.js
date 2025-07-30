const params = new URLSearchParams(window.location.search);
const ordenId = params.get("id");

const obsInput = document.getElementById("obs-tecnico");
const precioInput = document.getElementById("precio");
const fotoInput = document.getElementById("foto");
const form = document.getElementById("detalle-form");

async function cargarDatos() {
  const docRef = db.collection("ordenes").doc(ordenId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const data = docSnap.data();
    const detalles = data.detallesTecnico || {};
    obsInput.value = detalles.observaciones || "";
    precioInput.value = detalles.precio || "";
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

  await db.collection("ordenes").doc(ordenId).update({ detallesTecnico: detalles });

  alert("Detalle técnico guardado");
  window.location.href = "ver.html";
});

cargarDatos();
