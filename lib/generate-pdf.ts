import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateAgreementPDF(elementId: string, filename: string = 'agreement.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // 1. Capture the element with high resolution
    // Store original transform to restore it later
    const originalTransform = element.style.transform;
    const originalWidth = element.style.width;
    
    // Temporarily force 1:1 scale and fixed width for capture
    element.style.transform = 'none';
    element.style.width = '210mm';
    
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x scale is a good balance between quality and file size
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 210 * 3.7795,
      height: 297 * 3.7795,
    });

    // Restore original styles
    element.style.transform = originalTransform;
    element.style.width = originalWidth;

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    
    // 2. Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions are 210 x 297 mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    
    // 3. Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
