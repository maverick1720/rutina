let dataSemanal = {};
let dataDiario = {};
const emojis = ["😃", "😐", "😴"]; // Estados de cumplimiento

// Cargar rutina (por defecto SEMANAL)
async function loadRoutine(type = "SEMANAL") {
  const file = type === "SEMANAL" ? "SEMANAL.json" : "DIARIO.json";
  try {
    const response = await fetch(file);
    const data = await response.json();
    if (type === "SEMANAL") {
      dataSemanal = data;
    } else {
      dataDiario = data;
    }
    renderTable(data, type);
  } catch (error) {
    console.error("Error al cargar JSON:", error);
  }
}

// Renderizar tabla
function renderTable(data, type) {
  const container = document.getElementById("routine-table");
  let html = '<table><thead><tr><th>📅 Día</th>';

  const dias = Object.keys(data);
  const horas = Object.keys(data[dias[0]]);

  for (const hora of horas) html += `<th>${hora}</th>`;
  html += '<th>✅ Cumplimiento</th></tr></thead><tbody>';

  for (const dia of dias) {
    html += `<tr><td style="font-weight:bold;">${dia}</td>`;
    for (const hora of horas) {
      html += `<td contenteditable="true" oninput="actualizarTarea('${dia}','${hora}',this.innerText,'${type}')">${data[dia][hora]}</td>`;
    }
    const emoji = data[dia].emoji || "😃";
    html += `<td class="emoji" onclick="toggleEmoji('${dia}','${type}',this)">${emoji}</td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Cambiar el emoji de cumplimiento
function toggleEmoji(dia, type, element) {
  const dataset = type === "SEMANAL" ? dataSemanal : dataDiario;
  const currentEmoji = dataset[dia].emoji || "😃";
  const index = (emojis.indexOf(currentEmoji) + 1) % emojis.length;
  dataset[dia].emoji = emojis[index];
  element.textContent = emojis[index];
  guardarDatos(type, dataset);
}

// Guardar tareas al editar
function actualizarTarea(dia, hora, valor, type) {
  const dataset = type === "SEMANAL" ? dataSemanal : dataDiario;
  dataset[dia][hora] = valor;
  guardarDatos(type, dataset);
}

// Guardar datos en localStorage
function guardarDatos(type, data) {
  localStorage.setItem(type, JSON.stringify(data));
}

// Al cargar la página
window.onload = async () => {
  const semanalGuardado = localStorage.getItem("SEMANAL");
  const diarioGuardado = localStorage.getItem("DIARIO");

  if (semanalGuardado && diarioGuardado) {
    dataSemanal = JSON.parse(semanalGuardado);
    dataDiario = JSON.parse(diarioGuardado);
    renderTable(dataSemanal, "SEMANAL");
  } else {
    await loadRoutine("SEMANAL");
    await loadRoutine("DIARIO");
  }
};
