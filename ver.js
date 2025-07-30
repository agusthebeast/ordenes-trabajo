async function cargarOrdenes() {
  const container = document.getElementById("ordenes-lista");
  const snapshot = await db.collection("ordenes").get();

  let html = "";
  snapshot.forEach(doc => {
    const o = doc.data();
    html += `<div class="card">
      <p><strong>Cliente:</strong> ${o.clienteId}</p>
      <p><strong>Equipo:</strong> ${o.equipoId}</p>
      <p><strong>Falla:</strong> ${o.falla}</p>
      <p><strong>Accesorios:</strong> ${o.accesorios.join(", ")}</p>
      <p><strong>Estado:</strong> ${o.estado}</p>
      <p><strong>Subestado:</strong> ${o.subestado || "-"}</p>
    </div>`;
  });

  container.innerHTML = html;
}

cargarOrdenes();
