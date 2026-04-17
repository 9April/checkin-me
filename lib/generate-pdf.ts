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
    const originalWidth = element.style.width;
    const originalOverflow = document.body.style.overflow;
    
    // Temporarily force 1:1 scale and fixed width for capture
    element.style.transform = 'none';
    element.style.width = '210mm';
    document.body.style.overflow = 'visible';
    
    console.log('[PDF] Running html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 210 * 3.7795,
      height: 297 * 3.7795,
      allowTaint: false,
    });

    console.log('[PDF] Capture complete, restoring styles...');
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.width = originalWidth;
    document.body.style.overflow = originalOverflow;

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
