// lib/pdf.ts
import jsPDF from 'jspdf';

export async function buildPDF(data: {
  guestName: string;
  guestEmail: string;
  checkin: string;
  idImages: string[]; // base64 jpeg/png
  signature: string;  // base64 png
}) {
  const doc = new jsPDF({ format: 'a4', unit: 'pt' });

  // header
  doc.setFontSize(20);
  doc.text('Airbnb Pre-check-in Agreement', 40, 60);
  doc.setFontSize(12);
  doc.text(`Guest: ${data.guestName}`, 40, 100);
  doc.text(`Email: ${data.guestEmail}`, 40, 120);
  doc.text(`Check-in: ${data.checkin}`, 40, 140);

  // ID images
  let y = 180;
  for (const [idx, base64] of data.idImages.entries()) {
    const pure = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    doc.addImage(pure, 'JPEG', 40, y, 250, 160);
    y += 180;
    if (idx % 2 === 1) y += 20; // space after pair
  }

  // signature
  if (data.signature) {
    const sigPure = data.signature.replace(/^data:image\/png;base64,/, '');
    y += 20;
    doc.text('Guest signature:', 40, y);
    doc.addImage(sigPure, 'PNG', 40, y + 10, 250, 60);
  }

  return doc.output('arraybuffer'); // binary PDF
}