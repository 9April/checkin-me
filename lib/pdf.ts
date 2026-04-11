import jsPDF from 'jspdf';

export type Lang = 'EN' | 'FR' | 'SP';

const translations = {
  EN: {
    agreementTitle: 'HOUSE RULES',
    agreementSubtitle: 'Property Rules – Guest Agreement',
    guest: 'Guest',
    email: 'Email',
    dates: 'Dates',
    accordTitle: 'Guest Agreement',
    accordText: 'I confirm that I have read the house rules and I agree to respect them during my stay.',
    nomVoyageur: 'Guest Name',
    idNumber: 'Passport / ID Card',
    date: 'Date',
    signature: 'Signature',
    arrival: 'Estimated Arrival',
    whatsapp: 'WhatsApp',
    docAttachment: 'Document Attachment',
    rules: [
      { t: '1. Check-in / Check-out', d: 'Check-in from 3:00 PM. Check-out before 11:00 AM unless prior agreement with the host.' },
      { t: '2. Number of Guests', d: 'Only persons mentioned in the reservation are authorized to stay. Additional persons must be declared and authorized in advance.' },
      { t: '3. Visitors', d: 'Please inform the host in advance for any visits. Access is reserved only for persons in the reservation.' },
      { t: '4. Noise and Neighbors', d: 'Guests must respect neighbors and avoid excessive noise, especially between 10:00 PM and 8:00 AM.' },
      { t: '5. Parties and Events', d: 'Parties, gatherings, or events are strictly prohibited without host authorization.' },
      { t: '6. No Smoking', d: 'Smoking is strictly prohibited inside. You may smoke outside on the balconies, keeping them clean.' },
      { t: '7. Fireplace Use', d: 'For safety reasons, using the fireplace is strictly prohibited.' },
      { t: '8. Pets', d: 'Pets are not allowed unless prior agreement with the host.' },
      { t: '9. Equipment and Appliances', d: 'Use equipment, furniture, and appliances with care. Contact the host before any unusual manipulation.' },
      { t: '10. Damages', d: 'Guests are liable for any damage. Report any damage immediately to the host.' },
      { t: '11. Cleanliness', d: 'The property must be kept clean and left in a proper state at check-out.' },
      { t: '12. Keys and Access', d: 'Guests are responsible for keys, badges, or access codes. Loss may incur additional fees.' },
      { t: '13. Illegal Activities', d: 'Any illegal activity is strictly prohibited and result in immediate eviction.' },
      { t: '14. Energy Saving', d: 'Please turn off lights, AC, heating, and appliances when not in use.' },
      { t: '15. Assistance', d: 'Contact the host before attempting any repairs.' },
      { t: '16. Security', d: 'Residents must follow security instructions and not use dangerous equipment.' },
    ]
  },
  FR: {
    agreementTitle: 'RÈGLEMENT INTÉRIEUR',
    agreementSubtitle: 'Règlement du logement – Accord du voyageur',
    guest: 'Voyageur',
    email: 'E-mail',
    dates: 'Dates',
    accordTitle: 'Accord du voyageur',
    accordText: 'Je confirme avoir lu le règlement intérieur et je m’engage à le respecter pendant mon séjour.',
    nomVoyageur: 'Nom du voyageur',
    idNumber: 'Passeport / Carte d’identité',
    date: 'Date',
    signature: 'Signature',
    arrival: 'Heure d’arrivée prévue',
    whatsapp: 'WhatsApp',
    docAttachment: 'Pièce jointe',
    rules: [
      { t: '1. Arrivée / Départ', d: 'L’heure d’arrivée est à partir de 15h00. L’heure de départ est avant 11h00 sauf accord préalable avec l’hôte.' },
      { t: '2. Nombre de voyageurs', d: 'Seules les personnes mentionnées dans la réservation sont autorisées à séjourner dans le logement. Toute personne supplémentaire doit être déclarée et autorisée à l’avance par l’hôte.' },
      { t: '3. Visiteurs', d: 'Merci d’informer l’hôte à l’avance en cas de visite. L’accès au logement est réservé uniquement aux personnes indiquées dans la réservation.' },
      { t: '4. Bruit et respect du voisinage', d: 'Les voyageurs doivent respecter le voisinage et éviter tout bruit excessif, surtout entre 22h00 et 08h00.' },
      { t: '5. Fêtes et événements', d: 'Les fêtes, soirées ou rassemblements sont strictement interdits sans autorisation de l’hôte.' },
      { t: '6. Interdiction de fumer', d: 'Il est strictement interdit de fumer à l’intérieur du logement. Il est possible de fumer à l’extérieur, au niveau des deux balcons.' },
      { t: '7. Utilisation de la cheminée', d: 'Pour des raisons de sécurité, l’utilisation de la cheminée est strictement interdite.' },
      { t: '8. Animaux', d: 'Les animaux ne sont pas autorisés sauf accord préalable de l’hôte.' },
      { t: '9. Utilisation des équipements', d: 'Les voyageurs doivent utiliser les équipements, le mobilier et l’électroménager avec soin.' },
      { t: '10. Dégradations', d: 'Les voyageurs sont responsables de tout dommage causé. Tout dommage doit être signalé immédiatement.' },
      { t: '11. Propreté', d: 'Le logement doit être maintenu propre pendant le séjour et laissé dans un état correct au départ.' },
      { t: '12. Clés et accès', d: 'Les voyageurs sont responsables des clés, badges ou codes d’accès. La perte peut entraîner des frais.' },
      { t: '13. Activités illégales', d: 'Toute activité illégale est strictement interdite et peut entraîner l’annulation du séjour.' },
      { t: '14. Économie d’énergie', d: 'Merci d’éteindre les lumières, la climatisation et les appareils lorsque vous ne les utilisez pas.' },
      { t: '15. Assistance', d: 'En cas de problème, veuillez contacter l’hôte avant de tenter toute réparation.' },
      { t: '16. Security', d: 'Les voyageurs doivent respecter les consignes de sécurité et ne pas utiliser d’équipements dangereux.' },
    ]
  },
  SP: {
    agreementTitle: 'REGLAMENTO INTERNO',
    agreementSubtitle: 'Reglamento de la vivienda – Acuerdo del viajero',
    guest: 'Viajero',
    email: 'Correo',
    dates: 'Fechas',
    accordTitle: 'Acuerdo del viajero',
    accordText: 'Confirmo que he leído el reglamento interno y me comprometo a respetarlo durante mi estancia.',
    nomVoyageur: 'Nombre del viajero',
    idNumber: 'Pasaporte / DNI',
    date: 'Fecha',
    signature: 'Firma',
    arrival: 'Hora estimada de llegada',
    whatsapp: 'WhatsApp',
    docAttachment: 'Documento adjunto',
    rules: [
      { t: '1. Llegada / Salida', d: 'La hora de entrada es a partir de las 15:00. La hora de salida es antes de las 11:00 salvo acuerdo previo.' },
      { t: '2. Número de viajeros', d: 'Solo las personas mencionadas en la reserva están autorizadas a alojarse. Las personas adicionales deben ser autorizadas.' },
      { t: '3. Visitantes', d: 'Por favor, informe al anfitrión con antelación en caso de visitas. El acceso está reservado a los registrados.' },
      { t: '4. Ruido y vecindario', d: 'Los viajeros deben respetar el vecindario y evitar ruidos excesivos de 22:00 a 08:00.' },
      { t: '5. Fiestas y eventos', d: 'Las fiestas o reuniones están estrictamente prohibidas sin autorización.' },
      { t: '6. Prohibido fumar', d: 'Está estrictamente prohibido fumar en el interior. Se permite en los balcones manteniendo la limpieza.' },
      { t: '7. Uso de la chimenea', d: 'Por razones de seguridad, el uso de la chimenea está estrictamente prohibido.' },
      { t: '8. Mascotas', d: 'No se admiten mascotas salvo acuerdo previo con el anfitrión.' },
      { t: '9. Uso de equipos', d: 'Los viajeros deben utilizar el mobiliario y electrodomésticos con cuidado y según su uso normal.' },
      { t: '10. Daños', d: 'Los viajeros son responsables de cualquier daño. Informe inmediatamente al anfitrión.' },
      { t: '11. Limpieza', d: 'La vivienda debe mantenerse limpia y dejarse en un estado correcto al salir.' },
      { t: '12. Llaves y acceso', d: 'Los viajeros son responsables de las llaves y códigos. Su pérdida puede conllevar gastos.' },
      { t: '13. Activividades ilegales', d: 'Cualquier actividad ilegal está prohibida y puede causar la cancelación inmediata.' },
      { t: '14. Ahorro de energía', d: 'Por favor, apague luces y aire acondicionado when not in use.' },
      { t: '15. Asistencia', d: 'Contacte con el anfitrión antes de intentar cualquier reparación.' },
      { t: '16. Seguridad', d: 'Los viajeros deben respetar las normas de seguridad et ne pas utiliser d’équipements dangereux.' },
    ]
  }
};

export async function buildPDF(data: {
  guestName: string;
  guestEmail: string;
  checkin: string;
  checkout: string;
  propertyName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  pdfTemplate?: string | null;
  pdfFooter?: string | null;
  travelers: Array<{
    country: string;
    idNumber: string;
    idFiles: string[];
  }>;
  rules: string[];
  signature: string;
  idImages: string[];
  lang?: Lang;
  checkinHour?: string;
  whatsapp?: string;
}) {
  const lang = data.lang || 'EN';
  const t = translations[lang as keyof typeof translations] || translations.EN;
  const primaryColor = data.primaryColor || '#EF4444';

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 239, g: 68, b: 68 };
  };

  const rgb = hexToRgb(primaryColor);
  const doc = new jsPDF({ format: 'a4', unit: 'pt' });
  
  const margin = 45;
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;
  const textEnd = pageH - margin - 100;
  
  const placeholders: Record<string, string> = {
    '{{guestName}}': data.guestName,
    '{{guestEmail}}': data.guestEmail,
    '{{propertyName}}': data.propertyName,
    '{{checkinDate}}': data.checkin,
    '{{checkoutDate}}': data.checkout,
    '{{checkinHour}}': data.checkinHour || '',
    '{{houseRules}}': (data.rules && data.rules.length > 0 
      ? data.rules.map(r => `<b>• ${r}</b>`) 
      : t.rules.map(r => `<b>${r.t}</b><br/>${r.d}`)
    ).join('<br/>'),
    '{{signature}}': '[SIGNATURE_PLACEHOLDER]',
  };

  let template = data.pdfTemplate || '';
  if (!template || template.trim() === '') {
     template = `
<table style="width: 100%; border-bottom: 0.5px solid #C5A059; padding-bottom: 20px;">
  <tr>
    <td style="width: 80px; vertical-align: middle;">
      <!-- LOGO AREA (Automatically placed top-left) -->
    </td>
    <td style="padding-left: 20px; vertical-align: middle;">
      <h1 style="color: #C5A059; margin: 0; padding: 0; line-height: 1;">{{propertyName}}</h1>
      <h3 style="color: #4B5563; margin: 0; padding: 0; font-size: 10px; font-weight: normal; letter-spacing: 1px;">GUEST STAY AGREEMENT</h3>
    </td>
  </tr>
</table>

<br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">GUEST</td>
    <td style="color: #6B7280; font-size: 8px; text-align: right;">STAY PERIOD</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{guestName}}</b></td>
    <td style="color: #1A1A1A; text-align: right;"><b>{{checkinDate}} to {{checkoutDate}}</b></td>
  </tr>
</table>

<br/>
<hr style="color: #C5A059; height: 0.5px;"/>
<br/>

<h3 style="color: #C5A059; text-align: center; letter-spacing: 2px;">ACKNOWLEDGEMENT AND CONDITIONS</h3>
<br/>
<small style="color: #1A1A1A;">
{{houseRules}}
</small>
<br/>
<p style="text-align: center; color: #1A1A1A; font-style: italic;">
  ${t.accordText || 'I confirm that I have read and agree to respect the rules.'}
</p>

<br/><br/>

<table style="width: 100%; border-top: 0.5px solid #E5E7EB; padding-top: 20px;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">DATE OF ARRIVAL:</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{checkinDate}}</b></td>
  </tr>
</table>

<br/>
<!-- SIGNATURE ENGINE BLOCK -->
{{signature}}
`;
  }
  
  Object.entries(placeholders).forEach(([tag, val]) => {
    template = template.split(tag).join(val || '');
  });

  const setColor = (c: {r: number, g: number, b: number}) => doc.setTextColor(c.r, c.g, c.b);
  const setDrawColor = (c: {r: number, g: number, b: number}) => doc.setDrawColor(c.r, c.g, c.b);
  const setFillColor = (c: {r: number, g: number, b: number}) => doc.setFillColor(c.r, c.g, c.b);

  const drawFrame = () => {
    // Purposefully removed to remove the red outline
  };

  let y = margin + 5;
  drawFrame();

  let logoBottomY = y;
  if (data.logoUrl) {
    try {
      let logoData = data.logoUrl;
      // If it's a relative path starting with /uploads, it's an old local file
      if (logoData.startsWith('/uploads')) {
         logoData = `https://${process.env.VERCEL_URL || 'localhost:3000'}/public${logoData}`;
      }
      
      const logoSize = 60;
      // Wrap addImage in a more descriptive error check
      doc.addImage(logoData, 'PNG', margin, y, logoSize, logoSize, undefined, 'MEDIUM');
      logoBottomY = y + logoSize + 10;
    } catch (e: any) {
      console.warn("⚠️ PDF Logo could not be loaded (likely 404 or invalid format). Proceeding without logo.");
      console.error("  Detail:", e.message);
    }
  }

  const parseStyles = (styleStr: string | null) => {
    if (!styleStr) return {};
    const styles: Record<string, string> = {};
    styleStr.split(';').forEach(s => {
      const [k, v] = s.split(':').map(x => x.trim().toLowerCase());
      if (k && v) styles[k] = v;
    });
    return styles;
  };

  const renderHTMLContent = (html: string) => {
    // Advanced Tag Splitter: Separates tags from text nodes
    const bits = html.split(/(<[^>]+>)/g);
    
    let alignStack: ('left' | 'center' | 'right')[] = ['left'];
    let currentAlign: 'left' | 'center' | 'right' = 'left';
    
    let currentFontSize = 10;
    let isBold = false;
    let currentColor = { r: 75, g: 85, b: 99 };
    
    // Table State
    let tableMode = false;
    let colIndex = 0;
    let rowStartY = 0;
    let rowMaxY = 0;

    bits.forEach((bit) => {
      if (!bit || bit.trim() === '') return;

      if (bit.startsWith('<!--')) return; // Ignore HTML Comments entirely

      if (bit.startsWith('<')) {
        const tagName = bit.match(/<\/?([a-z1-6]+)/i)?.[1]?.toLowerCase();
        const styles = parseStyles(bit.match(/style="([^"]+)"/i)?.[1] || null);

        // Self-closing tags that shouldn't affect state nesting
        const isSelfClosing = bit.endsWith('/>') || ['br', 'hr', 'img', 'input'].includes(tagName || '');

        if (bit.startsWith('</')) {
           // Pop alignment stack on tag close
           if (alignStack.length > 1) {
             alignStack.pop();
             currentAlign = alignStack[alignStack.length - 1];
           }

           if (tagName === 'td') {
             if (y > rowMaxY) rowMaxY = y;
             colIndex++;
           } else if (tagName === 'tr') {
             y = rowMaxY + 5;
           } else if (tagName === 'table') {
             tableMode = false;
             y += 10;
             if (y < logoBottomY) y = logoBottomY;
           } else if (['h1', 'h2', 'h3', 'p', 'small'].includes(tagName || '')) {
             y += 10; // Extra spacing after block elements
             currentFontSize = 10;
             isBold = false;
             setColor({r: 75, g: 85, b: 99});
           }
           if (tagName === 'b' || tagName === 'strong') isBold = false;
           return;
        }

        // Handle explicit page breaks
        if (styles['page-break-before'] === 'always') {
          doc.addPage();
          drawFrame();
          y = margin + 10;
        }

        // Push state for NON-self-closing tags
        if (!isSelfClosing) {
          if (styles['text-align']) {
            currentAlign = styles['text-align'] as any;
            alignStack.push(currentAlign);
          } else {
            alignStack.push(currentAlign);
          }
        }
        
        if (styles['color']) {
          const c = hexToRgb(styles['color']);
          currentColor = c;
        }

        switch(tagName) {
          case 'table':
            tableMode = true;
            y += 5;
            break;
          case 'tr':
            colIndex = 0;
            rowStartY = y;
            rowMaxY = y;
            break;
          case 'td':
            y = rowStartY; // Reset Y to top of row for this column
            break;
          case 'div':
            y += 5;
            break;
          case 'h1':
            currentFontSize = 24;
            isBold = true;
            if (tableMode && colIndex === 1) {
              y += 5; // Start property name slightly down from logo top
            } else {
              y += 20;
            }
            setColor(rgb);
            break;
          case 'h2':
            currentFontSize = 16;
            isBold = true;
            y += 15;
            setColor({r: 26, g: 26, b: 26});
            break;
          case 'h3':
            currentFontSize = 10;
            isBold = true;
            if (tableMode && colIndex === 1) {
               y += 15; // Spacing for GUEST STAY AGREEMENT sub-header
            } else {
               currentFontSize = 12; // Standard H3 size
               y += 12;
            }
            // If it's a subheader, make it light black/gray
            if (currentFontSize === 10) {
              setColor({r: 75, g: 85, b: 99});
            } else {
              setColor(rgb);
            }
            break;
          case 'p':
            currentFontSize = 10;
            y += 8;
            break;
          case 'b':
          case 'strong':
            isBold = true;
            break;
          case 'small':
            currentFontSize = 8;
            break;
          case 'hr':
            setDrawColor(rgb); // Use Gold for lines
            doc.setLineWidth(0.5); // Very thin lines
            doc.line(margin, y - 5, pageW - margin, y - 5);
            y += 10;
            break;
          case 'br':
            y += 12;
            break;
        }
      } else {
        // Text Node
        const text = bit.trim();
        if (!text) return;
        
        if (text === '[PAGE_BREAK]') {
          doc.addPage();
          drawFrame();
          y = margin + 10;
          return;
        }

        if (text === '[SIGNATURE_PLACEHOLDER]') {
          const sigAreaY = y;
          setFillColor({r: 253, g: 252, b: 249});
          doc.roundedRect(margin, sigAreaY, pageW - margin * 2, 80, 10, 10, 'F');
          setDrawColor(rgb);
          doc.rect(margin, sigAreaY, pageW - margin * 2, 80, 'S');

          if (data.signature) {
            const sig = data.signature.replace(/^data:image\/png;base64,/, '');
            doc.addImage(sig, 'PNG', margin + (pageW / 2) - 100, sigAreaY + 10, 200, 60, undefined, 'MEDIUM'); 
          }
          setColor(rgb);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(t.signature.toUpperCase(), margin + (pageW / 2), sigAreaY + 72, { align: 'center' });
          y += 100;
          return;
        }

        if (y > textEnd) { doc.addPage(); drawFrame(); y = margin + 10; }

        doc.setFontSize(currentFontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        setColor(currentColor);
        
        let colWidth = pageW - margin * 2;
        if (tableMode) {
          colWidth = colWidth / 2; // Split into 2 columns for data
        }

        const lines = doc.splitTextToSize(text, colWidth - 10);
        lines.forEach((l: string) => {
          let x = margin;
          
          if (tableMode) {
            if (currentAlign === 'center') {
              x = margin + (colIndex * colWidth) + (colWidth / 2);
            } else if (currentAlign === 'right') {
              x = margin + ((colIndex + 1) * colWidth) - 10; // -10 for padding
            } else {
              x = margin + (colIndex * colWidth);
            }
          } else if (currentAlign === 'center') {
            x = pageW / 2;
          } else if (currentAlign === 'right') {
            x = pageW - margin;
          }
          
          doc.text(l, x, y, { align: currentAlign });
          y += (currentFontSize * 1.4);
        });
        
        if (tableMode && y > rowMaxY) {
           rowMaxY = y;
        }
      }
    });
  };

  renderHTMLContent(template);

  doc.setFontSize(7);
  setColor({r: 156, g: 163, b: 175});
  const footerText = data.pdfFooter || `© 2026 Admin • Secure Digital Registration`;
  doc.text(footerText, pageW / 2, pageH - 25, { align: 'center' });

  return doc.output('arraybuffer');
}