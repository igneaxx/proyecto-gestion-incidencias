const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow,
  TableCell, WidthType, ImageRun, AlignmentType, BorderStyle, PageBreak,
  ShadingType
} = require("docx");

const c = require("./contenido");

const ROOT = path.join(__dirname, "..");

function pngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function imageParagraph(relPath, maxWidth, caption) {
  const fullPath = path.join(ROOT, relPath);
  const { width, height } = pngSize(fullPath);
  const scale = maxWidth / width;
  const w = Math.round(maxWidth);
  const h = Math.round(height * scale);

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(fullPath),
          transformation: { width: w, height: h },
          type: "png"
        })
      ]
    })
  ];
  if (caption) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: caption, italics: true, size: 18, color: "555555" })]
    }));
  }
  return children;
}

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } });
}
function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    children: text.split("\n\n").length > 1
      ? text.split("\n\n").flatMap((t, i) => i === 0 ? [new TextRun(t)] : [new TextRun({ text: t, break: 1 })])
      : [new TextRun(text)],
    ...opts
  });
}

function cellText(text, opts = {}) {
  return new TableCell({
    width: { size: opts.size || 2000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: "1F2933" } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: !!opts.header, color: opts.header ? "FFFFFF" : "000000", size: opts.fontSize || 19 })]
    })]
  });
}

function tableFromRows(headerCells, rows, colWidths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerCells.map((text, i) => cellText(text, { header: true, size: colWidths[i] }))
      }),
      ...rows.map((row) => new TableRow({
        children: row.map((text, i) => cellText(String(text), { size: colWidths[i] }))
      }))
    ]
  });
}

const sections = [];

// ---------- PORTADA ----------
sections.push(
  new Paragraph({ text: "", spacing: { before: 1200 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "DESARROLLO WEB INTEGRAL", bold: true, size: 32 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120 },
    children: [new TextRun({ text: c.portada.actividad, size: 24 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [new TextRun({ text: c.portada.titulo, bold: true, size: 28 })]
  }),
  new Paragraph({ text: "", spacing: { before: 800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Integrantes:", bold: true, size: 22 })]
  }),
  ...c.portada.integrantes.map((n) => new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: n, size: 22 })]
  })),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300 },
    children: [new TextRun({ text: `Grupo: ${c.portada.grupo}`, size: 22 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100 },
    children: [new TextRun({ text: `Fecha: ${c.portada.fecha}`, size: 22 })]
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ---------- INTRODUCCION ----------
sections.push(h1("Introduccion"), p(c.introduccion));

// ---------- PARTE A ----------
sections.push(h1("Parte A. Investigacion"));
c.parteA.forEach((item) => {
  sections.push(h3(item.pregunta));
  sections.push(p(item.respuesta));
});

// ---------- PARTE B ----------
sections.push(new Paragraph({ children: [new PageBreak()] }));
sections.push(h1("Parte B. Analisis y diseno de la solucion"));

sections.push(h2("1. Diagrama de arquitectura"));
sections.push(p(c.parteB.arquitecturaTexto));
sections.push(...imageParagraph("docs/diagrama.png", 560, "Figura 1. Arquitectura del Sistema de Gestion de Incidencias"));

sections.push(h2("2. Diseno de API REST"));
sections.push(tableFromRows(
  ["Metodo", "Ruta", "Proposito", "Entrada", "Respuesta", "Auth"],
  c.parteB.endpoints.map((e) => [e.metodo, e.ruta, e.proposito, e.entrada, e.respuesta, e.auth]),
  [700, 1600, 2400, 2200, 2600, 700]
));

sections.push(h2("3. Modelo de seguridad"));
sections.push(p(c.parteB.modeloSeguridad));

sections.push(h2("4. Proteccion de datos"));
sections.push(tableFromRows(
  ["Dato / recurso a proteger", "Medida aplicada"],
  c.parteB.proteccionDatos.map((d) => [d.recurso, d.medida]),
  [3000, 6000]
));

sections.push(h2("5. Manejo de errores"));
sections.push(tableFromRows(
  ["Codigo HTTP", "Ejemplo de uso en el sistema"],
  c.parteB.manejoErrores.map((e) => [e.codigo, e.ejemplo]),
  [2200, 6800]
));

sections.push(h2("6. Integracion de API externa"));
sections.push(p(c.parteB.apiExterna));

sections.push(h2("7. Identificacion de riesgos"));
sections.push(tableFromRows(
  ["Riesgo", "Vulnerabilidad asociada", "Impacto", "Accion preventiva"],
  c.parteB.riesgos.map((r) => [r.riesgo, r.vulnerabilidad, r.impacto, r.accion]),
  [2000, 2300, 2300, 2400]
));

// ---------- PARTE C ----------
sections.push(new Paragraph({ children: [new PageBreak()] }));
sections.push(h1("Parte C. Evidencia practica"));
sections.push(p(
  "Se implemento una demostracion minima funcional con backend en Node.js/Express " +
  "(8 endpoints, incluyendo autenticacion con JWT, validacion de datos, control de " +
  "acceso por rol y consumo de la API externa ipwho.is) y un frontend en HTML/CSS/JS " +
  "que consume dichos endpoints. A continuacion se muestran capturas de la ejecucion " +
  "real del sistema. El codigo fuente completo, con estructura organizada por capas " +
  "(routes, middleware, data) y su README con instrucciones de ejecucion, se entrega " +
  "junto a este reporte en la carpeta del proyecto."
));

sections.push(h2("Pantalla de inicio de sesion"));
sections.push(...imageParagraph("evidencias/01_login.png", 420, "Figura 2. Login del sistema"));

sections.push(h2("Panel del administrador"));
sections.push(p("El administrador visualiza todas las incidencias registradas y cuenta con controles para cambiar el estado y eliminar incidencias."));
sections.push(...imageParagraph("evidencias/02_dashboard_admin.png", 500, "Figura 3. Panel del administrador (rol: admin)"));

sections.push(h2("Panel del usuario"));
sections.push(p("El usuario normal solo visualiza sus propias incidencias y no cuenta con controles administrativos, lo que evidencia el control de acceso por rol implementado en el backend."));
sections.push(...imageParagraph("evidencias/03_dashboard_usuario.png", 500, "Figura 4. Panel del usuario (rol: usuario)"));

sections.push(h2("Manejo de errores de validacion"));
sections.push(p("Al intentar registrar una incidencia con datos invalidos (titulo y descripcion demasiado cortos), la API responde con codigo 400 y un mensaje descriptivo, el cual se muestra directamente en la interfaz."));
sections.push(...imageParagraph("evidencias/04_error_validacion.png", 420, "Figura 5. Error de validacion (HTTP 400) reflejado en la interfaz"));

// ---------- CONCLUSIONES ----------
sections.push(new Paragraph({ children: [new PageBreak()] }));
sections.push(h1("Conclusiones"));
sections.push(p(c.conclusiones));

// ---------- REFERENCIAS ----------
sections.push(h1("Referencias"));
c.fuentes.forEach((f) => {
  sections.push(new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text: f, size: 20 })]
  }));
});

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 21 } }
    }
  },
  sections: [{ properties: {}, children: sections }]
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = path.join(ROOT, "Reporte_Actividad_Unidad_III.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Reporte generado en:", outPath);
});
