import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Firestore externo: clientes
const clientesDB = getFirestore(
  initializeApp({
    apiKey: "AIzaSyDrUteyvUOOReYuNO2f4UpAzIobGIDFDfg",
    authDomain: "clientes-db92a.firebaseapp.com",
    projectId: "clientes-db92a"
  }, "clientesApp")
);

// Firestore externo: marcas/modelos
const equiposDB = getFirestore(
  initializeApp({
    apiKey: "AIzaSyD0_eHeUqdM7uQAiIZTQxGN30LP47MehtI",
    authDomain: "marcas-modelos-7349e.firebaseapp.com",
    projectId: "marcas-modelos-7349e"
  }, "equiposApp")
);

// Obtener lista de clientes
export async function obtenerClientes() {
  const snapshot = await getDocs(collection(clientesDB, "clientes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Guardar nuevo cliente
export async function guardarCliente(data) {
  const docRef = await addDoc(collection(clientesDB, "clientes"), data);
  return { id: docRef.id, ...data };
}

// Obtener lista de equipos (marca + modelo)
export async function obtenerEquipos() {
  const marcasSnap = await getDocs(collection(equiposDB, "marcas"));
  const equipos = [];

  for (const marcaDoc of marcasSnap.docs) {
    const marca = marcaDoc.data().nombre;
    const modelosSnap = await getDocs(collection(equiposDB, `marcas/${marcaDoc.id}/modelos`));
    modelosSnap.docs.forEach(modeloDoc => {
      equipos.push({
        id: `${marcaDoc.id}|${modeloDoc.id}`,
        marca,
        modelo: modeloDoc.data().nombre
      });
    });
  }

  return equipos;
}

// Guardar nuevo equipo
export async function guardarEquipo(marcaNombre, modeloNombre) {
  // Buscar o crear marca
  const marcasCol = collection(equiposDB, "marcas");
  const marcasSnap = await getDocs(marcasCol);
  let marcaDoc = marcasSnap.docs.find(doc => doc.data().nombre === marcaNombre);

  if (!marcaDoc) {
    const nuevaMarcaRef = await addDoc(marcasCol, { nombre: marcaNombre });
    marcaDoc = { id: nuevaMarcaRef.id, data: () => ({ nombre: marcaNombre }) };
  }

  const modelosCol = collection(equiposDB, `marcas/${marcaDoc.id}/modelos`);
  const nuevoModeloRef = await addDoc(modelosCol, { nombre: modeloNombre });

  return {
    id: `${marcaDoc.id}|${nuevoModeloRef.id}`,
    marca: marcaDoc.data().nombre,
    modelo: modeloNombre
  };
}
