import jsPDF from "jspdf";
import Logo from "../assets/logo.png";
import autoTable from "jspdf-autotable";

function generateBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export async function createInvoice(
  info: Factura,
  factura_id: number,
  cliente: Cliente,
  descargar = false
) {
  let trackings = info.trackings.map(
    ({ numero_tracking, peso, base, precio }) => [
      numero_tracking,
      String(peso),
      String(base.toFixed(2)),
      String(precio.toFixed(2)),
    ]
  );

  let totalSum = 0;

  info.trackings.forEach((tracking) => {
    totalSum += tracking.precio;
  });

  let total = totalSum.toFixed(2);

  const doc = new jsPDF("p", "pt", "a4", true);

  doc.addImage(Logo, "PNG", 15, 15, 145, 145, "", "FAST");
  autoTable(doc, {
    body: [
      [
        {
          content: "Factura",
          styles: {
            halign: "right",
            fontSize: 20,
          },
        },
      ],
    ],
    theme: "plain",
  });

  const fecha = new Date().toLocaleDateString("en-GB");

  autoTable(doc, {
    body: [
      [
        {
          content: `Factura No. ${factura_id}`,
          styles: {
            halign: "right",
            fontSize: 14,
            textColor: "red",
            fontStyle: "bold",
          },
        },
      ],
      [
        {
          content: `Fecha: ${fecha}`,
          styles: {
            halign: "right",
            fontSize: 14,
          },
        },
      ],
    ],
    styles: {
      cellPadding: { top: 0, bottom: 0, left: 5, right: 5 },
    },
    theme: "plain",
  });

  autoTable(doc, {
    head: [
      [
        {
          content: `${cliente.nombre} ${cliente.apellido}`,
          styles: {
            halign: "left",
            fontSize: 13,
          },
        },
        "",
      ],
    ],
    body: [
      [
        {
          content: `Casillero: ${info.casillero}`,
          styles: {
            halign: "left",
            fontSize: 13,
          },
        },
        {
          content: `Total: $${total}`,
          styles: {
            fontSize: 16,
            halign: "right",
            fontStyle: "bold",
          },
        },
      ],
    ],
    theme: "plain",
    styles: {
      cellPadding: { left: 5, right: 5, top: 0, bottom: 0 },
    },
  });

  autoTable(doc, {
    head: [
      [
        { content: "Numero de Tracking", styles: { halign: "left" } },
        "Peso (lbs)",
        "Precio",
        "Total",
      ],
    ],
    body: trackings,
    theme: "striped",
    headStyles: {
      fillColor: "#343a40",
      halign: "right",
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Subtotal:",
          styles: { halign: "right", fontStyle: "bold" },
        },
        { content: `$${total}`, styles: { halign: "right" } },
      ],
      [
        {
          content: "Total:",
          styles: {
            halign: "right",
            fontStyle: "bold",
          },
        },
        {
          content: `$${total}`,
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    columnStyles: {
      1: { cellWidth: 100 },
    },
    styles: {
      fontSize: 12,
    },
    theme: "plain",
  });

  autoTable(doc, {
    head: [["Terminos y Condiciones"]],
    body: [
      [
        "\u2022 TBoxExpress aplica cargos por peso o volumen para cargas extra dimensionada.",
      ],
      [
        "\u2022 TBoxExpress no se hará responsable por daño en mercancia mal empacada por exportación.",
      ],
      [
        "\u2022 TBoxExpress no se hace responsable por mercancia extraviada entregada por USPS.",
      ],
      [
        "\u2022 TBoxExpress no se hace responsable por paquetes, despues de 1 mes de no ser retirado en la oficina.",
      ],
    ],
    headStyles: {
      fontSize: 13,
    },
    styles: { cellPadding: 4 },
    theme: "plain",
    pageBreak: "avoid",
  });

  autoTable(doc, {
    body: [
      ["Entregado por:___________________", "Recibido por:___________________"],
    ],
    theme: "plain",
    pageBreak: "avoid",
  });

  autoTable(doc, {
    head: [["Datos Bancarios para Transferencia"]],
    body: [
      ["Banco General"],
      ["Nombre: TBoxExpress"],
      ["Tipo de Cuenta: "],
      ["Cuenta: "],
    ],
    styles: { halign: "center" },
    pageBreak: "avoid",
    theme: "plain",
  });

  autoTable(doc, {
    didDrawPage: function (data) {
      let str =
        "TBoxExpress | Teléfono +507 6362-8879\nDentro de Bisuteria y Accesorios Thrive, plaza Brisas Mall, local 25, fondo izquierdo, a lado de Optica Sosa";
      doc.setFontSize(11);

      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 40);
    },
  });

  if (descargar) {
    doc.save(`Factura-${factura_id}.pdf`);
  }

  const base = await generateBase64(doc.output("blob"));
  return base;
}
