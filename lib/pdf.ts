import jsPDF from 'jspdf';

export async function buildPDF(data: {
  guestName: string;
  guestEmail: string;
  checkin: string;
  travelers: Array<{
    country: string;
    idNumber: string;
    idFiles: string[];
  }>;
  adults?: number;
  kids?: number;
  rules: string[];
  signature: string;
  idImages: string[];
}) {
  const doc = new jsPDF({ format: 'a4', unit: 'pt' });
  const margin   = 35;
  const pageH    = doc.internal.pageSize.height;
  const sigBlock = 70; // bottom reserve
  const textEnd  = pageH - margin - sigBlock;

  let y = margin + 40; // ultra-tight top

  const addPara = (text: string, fontSize = 16, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, 530);
    const h     = lines.length * fontSize * 1.7; // BIG line spacing
    if (y + h > textEnd) return; // stop if no room
    doc.text(lines, margin, y);
    y += h;
  };

  /* ----------  HEADER (tiny)  ---------- */
  doc.setFontSize(18);
  doc.text('Airbnb Pre-Check-in Agreement', margin, y - 10);
  doc.setFontSize(11);
  doc.text(`Guest: ${data.guestName}`, margin, y + 10);
  doc.text(`Email: ${data.guestEmail}`, margin, y + 25);
  doc.text(`Check-in: ${data.checkin}`, margin, y + 40);
  
  if (data.adults !== undefined || data.kids !== undefined) {
    const adults = data.adults || 0;
    const kids = data.kids || 0;
    const total = adults + kids;
    doc.text(`Travelers: ${total} (${adults} adult${adults !== 1 ? 's' : ''}${kids > 0 ? `, ${kids} kid${kids !== 1 ? 's' : ''}` : ''})`, margin, y + 55);
    y += 70;
  } else {
    y += 55;
  }
  
  // List all travelers' ID information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Travelers Documents:', margin, y + 10);
  doc.setFont('helvetica', 'normal');
  data.travelers.forEach((traveler, index) => {
    const travelerType = index < (data.adults || 0) ? 'Adult' : 'Kid';
    doc.text(`Traveler ${index + 1} (${travelerType}): ${traveler.idNumber} (${traveler.country === 'MA' ? 'Morocco' : 'Other'})`, margin + 10, y + 25 + (index * 15));
  });
  y += 30 + (data.travelers.length * 15);

  /* ----------  HOUSE RULES (max font + max spacing)  ---------- */
  addPara('House Rules', 18, true); // huge title
  data.rules.forEach((r) => addPara(`• ${r}`, 15)); // large bullets + big gaps
  // Check if any traveler is from Morocco
  const hasMoroccoTraveler = data.travelers.some(t => t.country === 'MA');
  if (hasMoroccoTraveler) {
    addPara(
      'Married Moroccan couples: both spouses must present their original passport at check-in as required by local law.',
      14,
      true
    );
  }

  /* ----------  SIGNATURE (bottom 70 pt)  ---------- */
  const sigY = pageH - margin - 55;
  doc.setFontSize(12);
  doc.text('Guest Signature:', margin, sigY);
  if (data.signature) {
    const sig = data.signature.replace(/^data:image\/png;base64,/, '');
    doc.addImage(sig, 'PNG', margin + 150, sigY - 42, 150, 55);
  }

  return doc.output('arraybuffer');
}