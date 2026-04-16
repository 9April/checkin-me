import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateAgreementPDF(elementId: string, filename: string = 'agreement.pdf') {
  console.log('[PDF] Starting generation for ID:', elementId);
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
    // This helps html2canvas see the full document at A4 dimensions
    element.style.transform = 'none';
    element.style.width = '210mm';
    document.body.style.overflow = 'visible';
    
    console.log('[PDF] Running html2canvas...');
    const canvas = await html2canvas(element, {
      scale: 2, // Slightly lower scale for better compatibility/speed during debug
      useCORS: true,
      logging: true, // Enable html2canvas logs
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
    
    console.log('[PDF] Saving file:', filename);
    // 3. Save the PDF
    pdf.save(filename);
    console.log('[PDF] Success!');
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error);
    alert('Error generating PDF: ' + (error instanceof Error ? error.message : String(error)));
  }
}
