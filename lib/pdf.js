import 'server-only';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { money } from '@/lib/format';

function text(page, font, value, x, y, size=10, color=rgb(0.08,0.15,0.22)) {
  page.drawText(String(value ?? ''), { x, y, size, font, color });
}
function line(page, y) { page.drawLine({ start: {x:45,y}, end:{x:550,y}, thickness:0.5, color:rgb(.82,.87,.92) }); }

export async function quotationPdf(quote) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595,842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawRectangle({ x:0,y:762,width:595,height:80,color:rgb(.04,.13,.20) });
  text(page,bold,'JETWASH (PVT) LTD',45,805,18,rgb(.25,1,.65));
  text(page,regular,'Precision Industrial Services',45,785,10,rgb(1,1,1));
  text(page,bold,'QUOTATION',440,805,16,rgb(1,1,1));
  text(page,regular,quote.quoteNumber,440,785,9,rgb(1,1,1));
  text(page,bold,'Prepared for',45,725,11);
  text(page,regular,quote.company.name,45,707,12);
  text(page,regular,quote.company.address || '',45,690,9);
  text(page,bold,'Issue date',390,725,9); text(page,regular,new Date(quote.issueDate).toLocaleDateString(),465,725,9);
  text(page,bold,'Expiry date',390,708,9); text(page,regular,new Date(quote.expiryDate).toLocaleDateString(),465,708,9);
  line(page,665);
  text(page,bold,'Description',50,642,10); text(page,bold,'Qty',340,642,10); text(page,bold,'Rate',400,642,10); text(page,bold,'Amount',490,642,10);
  let y=618;
  for (const item of quote.items.slice(0,18)) {
    text(page,regular,item.description.slice(0,48),50,y,9);
    text(page,regular,Number(item.quantity).toFixed(2),340,y,9);
    text(page,regular,money(item.rate),400,y,9);
    text(page,regular,money(item.amount),490,y,9);
    y-=24;
  }
  line(page,y+8); y-=20;
  text(page,bold,'Subtotal',390,y,10); text(page,regular,money(quote.subtotal),490,y,10); y-=20;
  text(page,bold,'Discount',390,y,10); text(page,regular,money(quote.discount),490,y,10); y-=20;
  text(page,bold,`Tax (${Number(quote.taxRate)}%)`,390,y,10); text(page,regular,money(quote.taxAmount),490,y,10); y-=28;
  page.drawRectangle({x:380,y:y-10,width:170,height:35,color:rgb(.02,.48,.30)});
  text(page,bold,'TOTAL',395,y+2,12,rgb(1,1,1)); text(page,bold,money(quote.total),475,y+2,12,rgb(1,1,1));
  text(page,bold,'Terms',45,155,10); text(page,regular,(quote.terms || 'Quotation valid until the expiry date. Work begins after written acceptance.').slice(0,100),45,137,8);
  text(page,regular,'Thank you for choosing JetWash.',45,70,9,rgb(.25,.35,.45));
  return pdf.save();
}

export async function invoicePdf(invoice) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595,842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawRectangle({x:0,y:762,width:595,height:80,color:rgb(.04,.13,.20)});
  text(page,bold,'JETWASH (PVT) LTD',45,805,18,rgb(.25,1,.65));
  text(page,bold,'INVOICE',455,805,16,rgb(1,1,1)); text(page,regular,invoice.invoiceNumber,435,785,9,rgb(1,1,1));
  text(page,bold,'Bill to',45,725,11); text(page,regular,invoice.company.name,45,705,12); text(page,regular,invoice.company.address || '',45,688,9);
  text(page,bold,'Issue',390,725,9); text(page,regular,new Date(invoice.issueDate).toLocaleDateString(),455,725,9);
  text(page,bold,'Due',390,708,9); text(page,regular,new Date(invoice.dueDate).toLocaleDateString(),455,708,9);
  line(page,665); text(page,bold,'Description',50,642,10); text(page,bold,'Qty',350,642,10); text(page,bold,'Rate',410,642,10); text(page,bold,'Amount',495,642,10);
  let y=618;
  for (const item of invoice.items.slice(0,18)) { text(page,regular,item.description.slice(0,48),50,y,9); text(page,regular,Number(item.quantity).toFixed(2),350,y,9); text(page,regular,money(item.rate),410,y,9); text(page,regular,money(item.amount),495,y,9); y-=24; }
  line(page,y+8); y-=20;
  text(page,bold,'Subtotal',390,y,10); text(page,regular,money(invoice.subtotal),490,y,10); y-=20;
  text(page,bold,'Tax',390,y,10); text(page,regular,money(invoice.taxAmount),490,y,10); y-=20;
  text(page,bold,'Paid',390,y,10); text(page,regular,money(invoice.amountPaid),490,y,10); y-=28;
  page.drawRectangle({x:380,y:y-10,width:170,height:35,color:rgb(.02,.48,.30)}); text(page,bold,'BALANCE',392,y+2,11,rgb(1,1,1)); text(page,bold,money(invoice.balanceDue),480,y+2,11,rgb(1,1,1));
  text(page,bold,'Payment instructions',45,145,10); text(page,regular,'Contact accounts@jetwash.co.zw for bank and mobile payment instructions.',45,127,9);
  return pdf.save();
}
