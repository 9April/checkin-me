import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateAgreementPDF(
  elementId: string, 
  filename: string = 'agreement.pdf',
  action: 'save' | 'print' = 'save'
) {
  console.log(`[PDF] Starting ${action} for ID:`, elementId);
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('[PDF] Element not found:', elementId);
    alert('Error: Document container not found. Please refresh the page.');
    return;
  }

  try {
    // 1. Capture the element with high resolution
    console.log('[PDF] Preparing element clone for capture...');
    
    // A4 in pixels at 96 dpi
    const A4_W_PX = Math.round(210 * 3.7795);
    const A4_H_PX = Math.round(297 * 3.7795);

    // Create a clone of the element to avoid any live-DOM interference (scroll, z-index, wrapper overflow)
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Force the clone to render off-screen with exact A4 dimensions at 1:1 scale
    clone.style.position = 'absolute';
    clone.style.top = '0px';
    clone.style.left = '-9999px';
    clone.style.margin = '0px';
    clone.style.transform = 'none';
    clone.style.width = `${A4_W_PX}px`;
    clone.style.height = `${A4_H_PX}px`;
    clone.style.overflow = 'visible';
    
    // Append clone to body so it escapes all parent wrappers with overflow: hidden
    document.body.appendChild(clone);
    
    // Wait a brief moment to ensure fonts/images in the clone are ready
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    console.log('[PDF] Running html2canvas on clone at 3× scale (~288 DPI)...');
    
    const canvas = await html2canvas(clone, {
      scale: 3, // High resolution, matching form submission
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_W_PX,
      height: A4_H_PX,
      windowWidth: A4_W_PX,
      windowHeight: A4_H_PX,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
    });

    // Cleanup clone
    document.body.removeChild(clone);

    console.log('[PDF] Converting canvas to image data...');
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    
    console.log('[PDF] Initializing jsPDF...');
    // 2. Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions are 210 x 297 mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    
    if (action === 'save') {
      console.log('[PDF] Saving file:', filename);
      pdf.save(filename);
    } else {
      console.log('[PDF] Opening print dialog...');
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Clean up after some time
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 1000);
        }, 100);
      };
    }
    
    console.log('[PDF] Success!');
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error);
    alert('Error generating PDF: ' + (error instanceof Error ? error.message : String(error)));
  }
}
