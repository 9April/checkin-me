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
    console.log('[PDF] Preparing element for capture...');
    
    // Store original states
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;
    const originalWidth = element.style.width;
    const originalMargin = element.style.margin;
    const originalPosition = element.style.position;
    const originalTop = element.style.top;
    const originalLeft = element.style.left;
    const originalZIndex = element.style.zIndex;
    const originalOverflow = document.body.style.overflow;
    
    // A4 in pixels at 96 dpi
    const A4_W_PX = Math.round(210 * 3.7795);
    const A4_H_PX = Math.round(297 * 3.7795);

    // CRITICAL: LuxuryAgreement applies CSS transform:scale() and wrapper height restrictions for viewports.
    // We must reset both the print-area and its a4-wrapper parent so html2canvas sees the full 1:1 A4 layout.
    const a4Wrapper = element.closest('.a4-wrapper') as HTMLElement | null;
    const prevWrapperHeight = a4Wrapper?.style.height ?? '';
    const prevWrapperOverflow = a4Wrapper?.style.overflow ?? '';

    // Detach from normal document flow and place at exact top-left to avoid scroll/margin offsets resulting in blank captures
    element.style.position = 'fixed';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.margin = '0px';
    element.style.zIndex = '9999'; // Positive z-index ensures it renders above background
    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';
    element.style.width = `${A4_W_PX}px`;
    document.body.style.overflow = 'visible';

    if (a4Wrapper) {
      a4Wrapper.style.height = `${A4_H_PX}px`;
      a4Wrapper.style.overflow = 'visible';
    }
    
    console.log('[PDF] Running html2canvas at 3× scale (~288 DPI)...');
    // Scroll window to top temporarily to ensure absolute coordinates match
    const prevScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
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
      x: 0,
      y: 0,
    });

    window.scrollTo(0, prevScrollY);

    console.log('[PDF] Capture complete, restoring styles...');
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
    element.style.width = originalWidth;
    element.style.margin = originalMargin;
    element.style.position = originalPosition;
    element.style.top = originalTop;
    element.style.left = originalLeft;
    element.style.zIndex = originalZIndex;
    document.body.style.overflow = originalOverflow;
    
    if (a4Wrapper) {
      a4Wrapper.style.height = prevWrapperHeight;
      a4Wrapper.style.overflow = prevWrapperOverflow;
    }

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
