const usuario = getUsuario();

if (!getToken() || !usuario) {
  window.location.href = "index.html";
}

document.getElementById("nombreUsuario").textContent = usuario.nombre;
document.getElementById("rolUsuario").textContent = usuario.rol;
document.getElementById("btnSalir").addEventListener("click", cerrarSesion);

if (usuario.rol === "admin") {
  document.getElementById("colAcciones").textContent = "Acciones";
}

async function cargarIncidencias() {
  const mensajeErrorTabla = document.getElementById("mensajeErrorTabla");
  mensajeErrorTabla.style.display = "none";
  try {
    const data = await apiFetch("/incidents");
    renderizarTabla(data.incidencias);
  } catch (err) {
    mensajeErrorTabla.textContent = err.message;
    mensajeErrorTabla.style.display = "block";
  }
}

function renderizarTabla(incidencias) {
  const cuerpo = document.getElementById("cuerpoTabla");
  cuerpo.innerHTML = "";

  incidencias.forEach((inc) => {
    const fila = document.createElement("tr");

    let accionesHtml = "";
    if (usuario.rol === "admin") {
      accionesHtml = `
        <td class="acciones-admin">
          <select data-id="${inc.id}" class="selectEstado">
            <option value="abierta" ${inc.estado === "abierta" ? "selected" : ""}>Abierta</option>
            <option value="en_proceso" ${inc.estado === "en_proceso" ? "selected" : ""}>En proceso</option>
            <option value="cerrada" ${inc.estado === "cerrada" ? "selected" : ""}>Cerrada</option>
          </select>
          <button data-id="${inc.id}" class="btnEliminar">Eliminar</button>
        </td>`;
    }

    fila.innerHTML = `
      <td>${inc.id}</td>
      <td>${escapeHtml(inc.titulo)}</td>
      <td>${inc.prioridad}</td>
      <td><span class="estado-badge estado-${inc.estado}">${inc.estado}</span></td>
      <td>${inc.ubicacion || "N/D"}</td>
      <td>${new Date(inc.fechaCreacion).toLocaleString()}</td>
      ${accionesHtml}
    `;
    cuerpo.appendChild(fila);
  });

  if (usuario.rol === "admin") {
    document.querySelectorAll(".selectEstado").forEach((sel) => {
      sel.addEventListener("change", async (e) => {
        const id = e.target.getAttribute("data-id");
        try {
          await apiFetch(`/incidents/${id}`, {
            method: "PUT",
            body: JSON.stringify({ estado: e.target.value })
          });
          cargarIncidencias();
        } catch (err) {
          alert(err.message);
        }
      });
    });

    document.querySelectorAll(".btnEliminar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        try {
          await apiFetch(`/incidents/${id}`, { method: "DELETE" });
          cargarIncidencias();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

document.getElementById("formIncidencia").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensajeErrorForm = document.getElementById("mensajeErrorForm");
  const mensajeExitoForm = document.getElementById("mensajeExitoForm");
  mensajeErrorForm.style.display = "none";
  mensajeExitoForm.style.display = "none";

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const prioridad = document.getElementById("prioridad").value;

  try {
    await apiFetch("/incidents", {
      method: "POST",
      body: JSON.stringify({ titulo, descripcion, prioridad })
    });
    mensajeExitoForm.textContent = "Incidencia registrada correctamente";
    mensajeExitoForm.style.display = "block";
    document.getElementById("formIncidencia").reset();
    cargarIncidencias();
  } catch (err) {
    mensajeErrorForm.textContent = err.message;
    mensajeErrorForm.style.display = "block";
  }
});

cargarIncidencias();
