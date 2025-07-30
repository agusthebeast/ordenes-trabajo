import { db } from "./firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const estadoSelect = document.getElementById("estado-select");
const subestadoSelect = document.getElementById("subestado-select");
const ordenesLista = document.getElementById("ordenes-lista");

const subestadosPorEstado = {
  "en observaciones": ["esperando repuestos", "esperando respuesta de cliente", "siendo revisado"],
  "para retirar": ["reparado", "sin reparar (devolución)", "no hizo falla"]
};

estadoSelect.addEventListener("change", () => {
  const estado = estadoSelect.value;
  subestadoSelect.innerHTML = `<option value="todos">Todos</option>`;
  subestadoSelect.disabled = true;

  if (subestadosPorEstado[estado]) {
    subestadoSelect.disabled = false;
    subestadosPorEstado[estado].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subestadoSelect.appendChild(opt);
    });
  }

  mostrarOrdenes();
});

subestadoSelect.addEventListener("change", mostrarOrdenes);

async function mostrarOrdenes() {
  ordenesLista.innerHTML = "Cargando...";
  const snapshot = await getDocs(collection(db, "ordenes"));
  const estadoFiltro = estadoSelect.value;
  const subFiltro = subestadoSelect.value;

  let html = "";

  snapshot.forEach(docSnap => {
    const o = docSnap.data();
    const id = docSnap.id;

    if (
      (estadoFiltro !== "todos" && o.estado !== estadoFiltro) ||
      (subestadoSelect.disabled === false && subFiltro !== "todos" && o.subestado !== subFiltro)
    ) return;

    html += `
      <div class="card">
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Equipo:</strong> ${o.equipoId}</p>
        <p><strong>Cliente:</strong> ${o.clienteId}</p>
        <p><strong>Falla:</strong> ${o.falla}</p>
        <p><strong>Accesorios:</strong> ${o.accesorios.join(", ")}</p>
        <p><strong>Garantía:</strong> ${o.garantia ? "Sí" : "No"}</p>
        <p><strong>Plazo:</strong> ${o.plazoRevision}</p>
        <p><strong>Estado:</strong>
          <select data-id="${id}" class="estado-select">
            <option ${o.estado === "sin revisar" ? "selected" : ""}>sin revisar</option>
            <option ${o.estado === "en observaciones" ? "selected" : ""}>en observaciones</option>
            <option ${o.estado === "para retirar" ? "selected" : ""}>para retirar</option>
          </select>
        </p>
        <p><strong>Subestado:</strong>
          <input type="text" data-id="${id}" class="subestado-input" value="${o.subestado || ""}">
        </p>
        <a class="btn" href="detalle.html?id=${id}">✏️ Detalles técnicos</a>
      </div>
    `;
  });

  ordenesLista.innerHTML = html;

  document.querySelectorAll(".estado-select").forEach(sel => {
    sel.addEventListener("change", async () => {
      const ref = doc(db, "ordenes", sel.dataset.id);
      await updateDoc(ref, { estado: sel.value });
    });
  });

  document.querySelectorAll(".subestado-input").forEach(input => {
    input.addEventListener("change", async () => {
      const ref = doc(db, "ordenes", input.dataset.id);
      await updateDoc(ref, { subestado: input.value });
    });
  });
}

mostrarOrdenes();
