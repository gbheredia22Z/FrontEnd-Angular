import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {



  constructor() { }

  imprimir(encabezado: string[], cuerpo: Array<any>, titulo: string, guardar?: boolean) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: 'a4',
    });

    doc.setFontSize(16);
    doc.text(titulo, doc.internal.pageSize.width / 2, 25, { align: 'center' });
    // Añadir logo (reemplaza 'path/to/logo.png' con la ruta de tu logo)
    const logoX = doc.internal.pageSize.width - 30; // Ajusta la posición X del logo
    const logoY = 10; // Ajusta la posición Y del logo
    doc.addImage('../../../assets/brain_naranja.png', 'PNG', logoX, logoY, 20, 20);


    const tableOptions = {
      head: [encabezado],
      body: cuerpo,
      startY: 30,
    };

    autoTable(doc, tableOptions);

    if (guardar) {
      const hoy = new Date();
      doc.save(hoy.getDate() + hoy.getMonth() + hoy.getFullYear() + hoy.getTime() + '.pdf');
    } else {
      const data = doc.output();
      window.open(URL.createObjectURL(new Blob([data], { type: 'application/pdf' })));
    }
  }

  imprimirExcel(encabezado: string[], cuerpo: Array<any>, titulo: string, guardar?: boolean) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([encabezado, ...cuerpo]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');

    if (guardar) {
      // Guardar como archivo Excel
      XLSX.writeFile(wb, `${titulo}.xlsx`);
    } else {
      // Abrir en el navegador
      const blob = XLSX.write(wb, { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', type: 'blob' } as any);
      const url = URL.createObjectURL(blob);
      window.open(url);
    }
  }

  

}
