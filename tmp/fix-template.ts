const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fixedTemplate = `
<h1 style="text-align: center; color: #C5A059;">{{propertyName}}</h1>
<p style="text-align: center; color: #B08D43;"><b>GUEST STAY AGREEMENT</b></p>
<hr style="color: #E5E7EB;"/>
<br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280;"><b>PRIMARY GUEST</b></td>
    <td style="color: #6B7280;"><b>STAY PERIOD</b></td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{guestName}}</b></td>
    <td style="color: #1A1A1A;"><b>{{checkinDate}} to {{checkoutDate}}</b></td>
  </tr>
</table>

<br/>
<hr style="color: #E5E7EB;"/>
<br/>

<h3 style="color: #C5A059;">PROPERTY RULES & CONDITIONS</h3>
<p>{{houseRules}}</p>

[PAGE_BREAK]

<h3 style="color: #C5A059;">GUEST ACKNOWLEDGEMENT</h3>
<p>I confirm that I have read and understood the house rules and agree to fully comply with them during my stay at <b>{{propertyName}}</b>.</p>

<br/>
<br/>

<br/>
<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280;"><b>DATE</b><br/>___________________</td>
    <td style="color: #B08D43; text-align: right;"><b>GUEST SIGNATURE</b><br/>{{signature}}</td>
  </tr>
</table>
`;

async function main() {
  await prisma.property.updateMany({
    data: { pdfTemplate: fixedTemplate }
  });
  console.log("Template layout fixed and content preserved.");
}

main().finally(() => prisma.$disconnect());
