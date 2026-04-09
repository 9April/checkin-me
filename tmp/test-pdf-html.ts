import { buildPDF } from '../lib/pdf';
import * as fs from 'fs';

async function test() {
const template = `
<br/>
<h1 style="text-align: center; color: #C5A059;">{{propertyName}}</h1>
<h2 style="text-align: center; color: #B08D43;">GUEST STAY AGREEMENT</h2>
<br/>
<hr style="color: #E5E7EB;"/>
<br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280;"><h3>GUEST</h3><br/><h2 style="color: #1A1A1A;">{{guestName}}</h2></td>
    <td style="color: #6B7280; text-align: right;"><h3>STAY PERIOD</h3><br/><h2 style="color: #1A1A1A;">{{checkinDate}} to {{checkoutDate}}</h2></td>
  </tr>
</table>

<br/>
<hr style="color: #E5E7EB;"/>
<br/>

<h2 style="color: #C5A059; text-align: center;">ACKNOWLEDGEMENT AND CONDITIONS</h2>
<br/>
<h3 style="text-align: center; color: #1A1A1A;">
  I confirm that I have read and agree to respect the rules during my stay.
</h3>

<br/><br/><br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280;"><h3>DATE OF ARRIVAL:</h3><br/><h2 style="color: #1A1A1A;">{{checkinDate}}</h2></td>
    <td style="color: #6B7280; text-align: right;"><h3>SIGNATURE DATE:</h3><br/><h2 style="color: #1A1A1A;">___________________</h2></td>
  </tr>
</table>

<br/>
<!-- SIGNATURE ENGINE BLOCK (FULL WIDTH AUTOMATIC) -->
{{signature}}
`;

  try {
    const bytes = await buildPDF({
      guestName: 'Osama Bin',
      guestEmail: 'osama@example.com',
      checkin: '2026-04-10',
      checkout: '2026-04-12',
      propertyName: 'Mamounia08',
      pdfTemplate: template,
      travelers: [],
      rules: ['No smoking'],
      signature: '',
      idImages: []
    });
    
    fs.writeFileSync('test.pdf', Buffer.from(bytes));
    console.log("PDF generated. Size:", Buffer.from(bytes).length);
  } catch (e) {
    console.error(e);
  }
}

test();
