import jsPDF from 'jspdf';
import type { Lang } from './lang';
import { PDF_RULES_BY_LANG } from './pdf-rules-i18n';

export type { Lang } from './lang';

const translations = {
  EN: {
    pdfGuestStayAgreement: 'GUEST STAY AGREEMENT',
    pdfGuestLabel: 'GUEST',
    pdfStayPeriodLabel: 'STAY PERIOD',
    pdfAcknowledgementTitle: 'ACKNOWLEDGEMENT AND CONDITIONS',
    pdfDateOfArrivalLabel: 'DATE OF ARRIVAL:',
    pdfDateTo: 'to',
    pdfFooterDefault: '© 2026 • Secure digital registration',
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
    rules: PDF_RULES_BY_LANG.EN,
  },
  FR: {
    pdfGuestStayAgreement: 'CONTRAT DE SÉJOUR',
    pdfGuestLabel: 'VOYAGEUR',
    pdfStayPeriodLabel: 'PÉRIODE DE SÉJOUR',
    pdfAcknowledgementTitle: 'RECONNAISSANCE ET CONDITIONS',
    pdfDateOfArrivalLabel: 'DATE D’ARRIVÉE :',
    pdfDateTo: 'au',
    pdfFooterDefault: '© 2026 • Enregistrement numérique sécurisé',
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
    rules: PDF_RULES_BY_LANG.FR,
  },
  SP: {
    pdfGuestStayAgreement: 'ACUERDO DE ESTANCIA',
    pdfGuestLabel: 'VIAJERO',
    pdfStayPeriodLabel: 'PERÍODO DE ESTANCIA',
    pdfAcknowledgementTitle: 'RECONOCIMIENTO Y CONDICIONES',
    pdfDateOfArrivalLabel: 'FECHA DE LLEGADA:',
    pdfDateTo: 'a',
    pdfFooterDefault: '© 2026 • Registro digital seguro',
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
    rules: PDF_RULES_BY_LANG.SP,
  },
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
  const lang: Lang =
    data.lang === 'FR' || data.lang === 'SP' ? data.lang : 'EN';
  const t = translations[lang];
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
  // Leave room for signature block + footer on every page.
  const textEnd = pageH - margin - 160;
  const maxPages = 2;
  
  const travelersCompact = (data.travelers || [])
    .map((tr, idx) => {
      const label = (lang === 'FR' ? `Voyageur ${idx + 1}` : lang === 'SP' ? `Viajero ${idx + 1}` : `Traveler ${idx + 1}`);
      const parts = [
        tr.country ? `${tr.country}` : '',
        tr.idNumber ? `${tr.idNumber}` : '',
      ].filter(Boolean);
      return parts.length ? `${label}: ${parts.join(' • ')}` : '';
    })
    .filter(Boolean)
    .join('<br/>');

  const sanitizeRuleLine = (s: string) =>
    String(s)
      .replace(/^\s*•\s*/g, '')
      .replace(/^\s*\d+\s*[\.\)]\s*/g, '')
      .trim();

  const augmentRulesFR = (rules: string[]) => {
    // Add a few common Airbnb-style items if missing (kept short to stay within 2 pages).
    const base = rules.map(sanitizeRuleLine).filter(Boolean);
    const has = (needle: RegExp) => base.some((r) => needle.test(r.toLowerCase()));
    const extra: string[] = [];
    if (!has(/bougie|incendie|détecteur|fumée/)) {
      extra.push(`Sécurité incendie : ne pas désactiver les détecteurs, pas de bougies/encens, et respecter les consignes d’évacuation.`);
    }
    if (!has(/poubelle|déchet|tri/)) {
      extra.push(`Déchets : merci de respecter le tri et de sortir les poubelles selon les consignes du logement.`);
    }
    if (!has(/meuble|mobilier|déplacer/)) {
      extra.push(`Mobilier : merci de ne pas déplacer les meubles sans accord de l’hôte.`);
    }
    if (!has(/substance|drogue|stupéfiant|illégal/)) {
      extra.push(`Substances illicites : strictement interdites dans le logement et les parties communes.`);
    }
    if (!has(/fuite|eau|climatisation|dysfonctionnement/)) {
      extra.push(`Climatisation et Eau : signaler immédiatement toute fuite d'eau ou dysfonctionnement majeur.`);
    }
    if (!has(/respect|communication|personnel|staff/)) {
      extra.push(`Communication : maintenir une communication respectueuse avec l'hôte et le personnel.`);
    }
    return [...base, ...extra];
  };

  const effectiveRules =
    lang === 'FR' && Array.isArray(data.rules) && data.rules.length > 0
      ? augmentRulesFR(data.rules)
      : (data.rules || []).map(sanitizeRuleLine).filter(Boolean);

  const toBullets = (lines: string[]) =>
    lines.map((r) => `• ${escapeHtml(r)}`).join('<br/>');

  const builtinLines = t.rules.map((r) => `${r.t}: ${r.d}`);
  const finalRuleLines =
    effectiveRules.length > 0 ? effectiveRules : builtinLines;

  // Two-column rules: needed to fit all rules into 2 pages.
  const mid = Math.ceil(finalRuleLines.length / 2);
  const left = finalRuleLines.slice(0, mid);
  const right = finalRuleLines.slice(mid);
  const houseRulesHtml = `
<table style="width: 100%;">
  <tr>
    <td style="vertical-align: top; width: 50%; font-size: 6px; color: #1A1A1A;">
      ${toBullets(left)}
    </td>
    <td style="vertical-align: top; width: 50%; font-size: 6px; color: #1A1A1A;">
      ${toBullets(right)}
    </td>
  </tr>
</table>`;

  const placeholders: Record<string, string> = {
    '{{guestName}}': data.guestName,
    '{{guestEmail}}': data.guestEmail,
    '{{propertyName}}': data.propertyName,
    '{{checkinDate}}': data.checkin,
    '{{checkoutDate}}': data.checkout,
    '{{checkinHour}}': data.checkinHour || '',
    '{{whatsapp}}': data.whatsapp || '',
    '{{travelersInfo}}': travelersCompact || '',
    '{{houseRules}}': houseRulesHtml,
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
      <h3 style="color: #4B5563; margin: 0; padding: 0; font-size: 10px; font-weight: normal; letter-spacing: 1px;">${t.pdfGuestStayAgreement}</h3>
    </td>
  </tr>
</table>

<br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">${t.pdfGuestLabel}</td>
    <td style="color: #6B7280; font-size: 8px; text-align: right;">${t.pdfStayPeriodLabel}</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{guestName}}</b></td>
    <td style="color: #1A1A1A; text-align: right;"><b>{{checkinDate}} ${t.pdfDateTo} {{checkoutDate}}</b></td>
  </tr>
  <tr>
    <td style="color: #6B7280; font-size: 8px;">${t.email}</td>
    <td style="color: #6B7280; font-size: 8px; text-align: right;">${t.arrival}</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;">{{guestEmail}}</td>
    <td style="color: #1A1A1A; text-align: right;">{{checkinHour}}</td>
  </tr>
  <tr>
    <td style="color: #6B7280; font-size: 8px;">${t.whatsapp}</td>
    <td style="color: #6B7280; font-size: 8px; text-align: right;">${t.docAttachment}</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;">{{whatsapp}}</td>
    <td style="color: #1A1A1A; text-align: right;">{{travelersInfo}}</td>
  </tr>
</table>

<br/>
<hr style="color: #C5A059; height: 0.5px;"/>
<br/>

<h3 style="color: #C5A059; text-align: center; letter-spacing: 2px;">${t.pdfAcknowledgementTitle}</h3>
<br/>
<small style="color: #1A1A1A; font-size: 6px;">
{{houseRules}}
</small>
<br/>
<p style="text-align: center; color: #1A1A1A; font-style: italic;">
  ${t.accordText}
</p>

<br/><br/>

<table style="width: 100%; border-top: 0.5px solid #E5E7EB; padding-top: 20px;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">${t.pdfDateOfArrivalLabel}</td>
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
          if (doc.getNumberOfPages() < maxPages) {
            doc.addPage();
            drawFrame();
            y = margin + 10;
          }
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
        if (styles['font-size']) {
          const raw = styles['font-size'];
          const n = parseFloat(raw.replace('px', '').replace('pt', ''));
          if (!Number.isNaN(n) && n > 0) {
            currentFontSize = Math.max(5, Math.min(24, n));
          }
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
            // Keep legal/rules text compact by default.
            currentFontSize = Math.min(currentFontSize, 7);
            break;
          case 'hr':
            setDrawColor(rgb); // Use Gold for lines
            doc.setLineWidth(0.5); // Very thin lines
            doc.line(margin, y - 5, pageW - margin, y - 5);
            y += 10;
            break;
          case 'br':
            // Scale vertical spacing with font size to fit within 2 pages.
            y += Math.max(5, currentFontSize * 0.9);
            break;
        }
      } else {
        // Text Node
        const text = bit.trim();
        if (!text) return;
        
        if (text === '[PAGE_BREAK]') {
          if (doc.getNumberOfPages() < maxPages) {
            doc.addPage();
            drawFrame();
            y = margin + 10;
          }
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

        if (y > textEnd && doc.getNumberOfPages() < maxPages) {
          doc.addPage();
          drawFrame();
          y = margin + 10;
        }

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
          y += (currentFontSize <= 8 ? currentFontSize * 1.15 : currentFontSize * 1.35);
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
  const footerText = data.pdfFooter || t.pdfFooterDefault;
  doc.text(footerText, pageW / 2, pageH - 25, { align: 'center' });

  return doc.output('arraybuffer');
}