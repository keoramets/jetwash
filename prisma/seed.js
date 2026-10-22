import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(){
  const passwordHash=await bcrypt.hash('ChangeMe123!',12);
  const clientPasswordHash=await bcrypt.hash('ClientDemo123!',12);
  const company=await prisma.company.upsert({where:{id:'demo-company-jetwash-client'},update:{name:'Apex Industrial Zimbabwe',status:'ACTIVE'},create:{id:'demo-company-jetwash-client',name:'Apex Industrial Zimbabwe',email:'operations@apex.example',phone:'+263 77 555 0199',address:'Industrial Zone B, Harare',city:'Harare',industry:'Manufacturing',status:'ACTIVE'}});
  const admin=await prisma.user.upsert({where:{email:'admin@jetwash.co.zw'},update:{name:'JetWash Administrator',passwordHash,role:'SUPER_ADMIN',status:'ACTIVE'},create:{name:'JetWash Administrator',email:'admin@jetwash.co.zw',passwordHash,role:'SUPER_ADMIN',status:'ACTIVE',emailVerified:new Date()}});
  const staff=await prisma.user.upsert({where:{email:'operations@jetwash.co.zw'},update:{name:'Operations Lead',passwordHash,role:'STAFF',status:'ACTIVE'},create:{name:'Operations Lead',email:'operations@jetwash.co.zw',passwordHash,role:'STAFF',status:'ACTIVE',emailVerified:new Date()}});
  const client=await prisma.user.upsert({where:{email:'client@apex.example'},update:{name:'Marcus Thorne',passwordHash:clientPasswordHash,role:'CLIENT',status:'ACTIVE',companyId:company.id},create:{name:'Marcus Thorne',email:'client@apex.example',passwordHash:clientPasswordHash,phone:'+263 77 555 0110',role:'CLIENT',status:'ACTIVE',companyId:company.id,emailVerified:new Date()}});
  await prisma.clientProfile.upsert({where:{userId:client.id},update:{companyId:company.id,position:'Facility Director',approvalStatus:'APPROVED',approvedById:admin.id,approvedAt:new Date()},create:{userId:client.id,companyId:company.id,position:'Facility Director',approvalStatus:'APPROVED',approvedById:admin.id,approvedAt:new Date()}});

  const services=[
    ['High Pressure Cleaning','high-pressure-cleaning','Industrial','Controlled hydro-cleaning for equipment, floors, tanks, and structural surfaces.'],
    ['Industrial Machinery Cleaning','industrial-machinery-cleaning','Industrial','Precision cleaning around production equipment and sensitive assemblies.'],
    ['Boiler & Tank Restoration','boiler-tank-restoration','Specialized','Scale, residue, and internal surface restoration for contained assets.'],
    ['Cooling Tower Maintenance','cooling-tower-maintenance','Specialized','Cleaning and inspection support for thermal performance and system longevity.'],
    ['Chemical Cleaning','chemical-cleaning','Specialized','Engineered chemical processes for complex contamination and residue removal.'],
    ['Drain & Sewer Technology','drain-sewer-technology','Infrastructure','Inspection, blockage removal, and high-flow jetting.'],
    ['Sludge & Waste','sludge-waste','Environmental','Controlled collection, handling, and disposal workflow support.'],
    ['Fuel Tank Degassing','fuel-tank-degassing','Hazmat','Preparation and gas-free support for inspection and maintenance.'],
    ['Vehicle & Fleet Care','vehicle-fleet-care','Fleet','Commercial vehicle, fleet, and heavy equipment cleaning.']
  ];
  for(const [name,slug,category,shortDescription] of services){await prisma.service.upsert({where:{slug},update:{name,category,shortDescription,fullDescription:shortDescription,isActive:true},create:{name,slug,category,shortDescription,fullDescription:shortDescription,imageUrl:'/images/placeholders/factory-cleaning.svg',isActive:true}})}

  const projects=[
    ['Turbine Restoration: Apex Energy Hub','turbine-restoration-apex','Heavy Equipment'],
    ['Warehouse Floor Rehabilitation','warehouse-floor-rehabilitation','Factories'],
    ['Fleet Tank Decontamination','fleet-tank-decontamination','Tankers']
  ];
  for(const [title,slug,category] of projects){await prisma.project.upsert({where:{slug},update:{title,category},create:{title,slug,category,clientName:'Demo Client',location:'Harare, Zimbabwe',summary:'Demonstration case study placeholder for approved project evidence.',description:'Replace with approved scope, methods, safety controls, and verified outcomes.',imageUrl:'/images/placeholders/factory-cleaning.svg',completionDate:new Date('2024-10-01'),metricsJson:{efficiencyGain:'15.4%',downtimeReduced:'22%'},isFeatured:slug.includes('turbine')}})}

  const quoteRequest=await prisma.quoteRequest.upsert({where:{requestNumber:'QR-DEMO-001'},update:{status:'QUOTED'},create:{requestNumber:'QR-DEMO-001',source:'CLIENT_PORTAL',userId:client.id,companyId:company.id,fullName:client.name,email:client.email,phone:client.phone,companyName:company.name,serviceRequired:'High Pressure Cleaning',location:'Building A4, North Perimeter, Harare',urgency:'Priority',preferredDate:new Date(Date.now()+7*86400000),projectDetails:'Deep-clean an external filtration and process area before the planned maintenance window.',status:'QUOTED',assignedToId:admin.id}});
  let quotation=await prisma.quotation.findUnique({where:{quoteNumber:'QT-DEMO-001'}});
  if(!quotation){quotation=await prisma.quotation.create({data:{quoteNumber:'QT-DEMO-001',quoteRequestId:quoteRequest.id,companyId:company.id,clientId:client.id,createdById:admin.id,issueDate:new Date(),expiryDate:new Date(Date.now()+14*86400000),status:'SENT',subtotal:5100,discount:0,taxRate:15,taxAmount:765,total:5865,notes:'Demo quotation generated by the seed script.',terms:'Quotation valid for 14 days. Scheduling follows written acceptance.',items:{create:[{description:'High-Pressure Steam Cleaning',quantity:1200,unit:'m²',rate:2.5,amount:3000,sortOrder:0},{description:'Chemical Sealant Application',quantity:1200,unit:'m²',rate:1.75,amount:2100,sortOrder:1}]}}})}
  else {await prisma.quotationItem.deleteMany({where:{quotationId:quotation.id}});await prisma.quotation.update({where:{id:quotation.id},data:{quoteRequestId:quoteRequest.id,companyId:company.id,clientId:client.id,status:'SENT',items:{create:[{description:'High-Pressure Steam Cleaning',quantity:1200,unit:'m²',rate:2.5,amount:3000,sortOrder:0},{description:'Chemical Sealant Application',quantity:1200,unit:'m²',rate:1.75,amount:2100,sortOrder:1}]}}})}

  let job=await prisma.job.findUnique({where:{jobNumber:'JW-DEMO-001'}});
  if(!job){job=await prisma.job.create({data:{jobNumber:'JW-DEMO-001',quotationId:quotation.id,quoteRequestId:quoteRequest.id,companyId:company.id,clientId:client.id,title:'Industrial Chemical Purge',serviceType:'High Pressure Cleaning',location:'Building A4, North Perimeter, Harare',description:'Precision cleaning of external filtration systems before maintenance.',scheduledStart:new Date(Date.now()+2*86400000),scheduledEnd:new Date(Date.now()+3*86400000),status:'IN_PROGRESS',priority:'HIGH',assignedTeam:'Alpha Strike',progress:78,createdById:admin.id,staff:{create:{userId:staff.id}}}})}
  else await prisma.job.update({where:{id:job.id},data:{status:'IN_PROGRESS',progress:78,assignedTeam:'Alpha Strike'}});
  await prisma.jobStatusHistory.deleteMany({where:{jobId:job.id}});
  await prisma.jobStatusHistory.createMany({data:[{jobId:job.id,status:'SCHEDULED',note:'Scope and access window confirmed.',changedById:admin.id,createdAt:new Date(Date.now()-4*86400000)},{jobId:job.id,status:'DEPLOYED',note:'Team and equipment deployed.',changedById:staff.id,createdAt:new Date(Date.now()-2*86400000)},{jobId:job.id,status:'IN_PROGRESS',note:'Primary cleaning pass underway.',changedById:staff.id,createdAt:new Date(Date.now()-1*86400000)}]});

  let invoice=await prisma.invoice.findUnique({where:{invoiceNumber:'INV-DEMO-001'}});
  if(!invoice){invoice=await prisma.invoice.create({data:{invoiceNumber:'INV-DEMO-001',jobId:job.id,quotationId:quotation.id,companyId:company.id,clientId:client.id,issueDate:new Date(),dueDate:new Date(Date.now()+14*86400000),status:'SENT',subtotal:5100,taxRate:15,taxAmount:765,total:5865,amountPaid:0,balanceDue:5865,items:{create:[{description:'High-Pressure Steam Cleaning',quantity:1200,rate:2.5,amount:3000,sortOrder:0},{description:'Chemical Sealant Application',quantity:1200,rate:1.75,amount:2100,sortOrder:1}]}}})}

  let chat=await prisma.chat.findFirst({where:{jobId:job.id}});
  if(!chat)chat=await prisma.chat.create({data:{companyId:company.id,clientId:client.id,jobId:job.id,contextType:'JOB',subject:`Job ${job.jobNumber} communications`}});
  if(await prisma.chatMessage.count({where:{chatId:chat.id}})===0){await prisma.chatMessage.createMany({data:[{chatId:chat.id,senderId:admin.id,message:'The site preparation checklist has been approved.',isInternal:false,createdAt:new Date(Date.now()-6*3600000)},{chatId:chat.id,senderId:client.id,message:'Please log the additional chemical units used after completion.',isInternal:false,createdAt:new Date(Date.now()-4*3600000)},{chatId:chat.id,senderId:staff.id,message:'Secondary containment barriers are in place.',isInternal:false,createdAt:new Date(Date.now()-2*3600000)}]})}

  await prisma.notification.deleteMany({where:{userId:client.id,type:{startsWith:'DEMO_'}}});
  await prisma.notification.createMany({data:[{userId:client.id,title:'Quotation ready',message:'QT-DEMO-001 is ready for review.',type:'DEMO_QUOTATION',linkUrl:`/client/quotes/${quotation.id}`},{userId:client.id,title:'Job in progress',message:'JW-DEMO-001 is 78% complete.',type:'DEMO_JOB',linkUrl:`/client/jobs/${job.id}`},{userId:client.id,title:'Invoice issued',message:'INV-DEMO-001 is available in the billing portal.',type:'DEMO_INVOICE',linkUrl:'/client/invoices'}]});

  const settings={companyName:'JetWash [PVT] LTD',companyEmail:'info@jetwash.co.zw',companyPhone:'+263 77 123 4567',companyAddress:'Industrial Park South, Harare, Zimbabwe',paymentInstructions:'Replace with approved banking, EcoCash, PayNow, or other payment instructions.',quotationTerms:'Quotation valid until the stated expiry date. Scheduling is confirmed after written acceptance.'};
  for(const [key,value] of Object.entries(settings))await prisma.siteSetting.upsert({where:{key},update:{value},create:{key,value,group:'seed'}});
  console.log('Seed complete.');
  console.log('Admin: admin@jetwash.co.zw / ChangeMe123!');
  console.log('Client: client@apex.example / ClientDemo123!');
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
