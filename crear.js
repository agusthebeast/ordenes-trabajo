document.getElementById("orden-form").addEventListener("submit", async e => {
  e.preventDefault();

  const accesorios = [...document.querySelectorAll('.checkbox-group input:checked')].map(el => el.value);

  const orden = {
    clienteId: document.getElementById("cliente-select").value,
    equipoId: document.getElementById("equipo-select").value,
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

  try {
    await db.collection("ordenes").add(orden);
    alert("Orden guardada");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error al guardar orden:", error);
    alert("Error al guardar la orden.");
  }
});
