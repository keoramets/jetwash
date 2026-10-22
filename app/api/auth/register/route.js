import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registrationSchema } from '@/lib/validators';
import { rateLimit,requestIp,validOrigin,jsonError } from '@/lib/security';
import { sendEmail,emailShell } from '@/lib/email';
import { notifyUsers,logActivity } from '@/lib/activity';

export async function POST(request){
 if(!validOrigin(request))return jsonError('Invalid request origin.',403);
 if(!rateLimit(`register:${requestIp(request)}`,{limit:5,windowMs:60*60_000}).allowed)return jsonError('Too many registrations from this network.',429);
 const parsed=registrationSchema.safeParse(await request.json().catch(()=>({})));
 if(!parsed.success)return jsonError('Check the registration fields.',422,parsed.error.flatten());
 const d=parsed.data;const email=d.email.toLowerCase();
 if(await prisma.user.findUnique({where:{email}}))return jsonError('An account already exists for this email.',409);
 const passwordHash=await bcrypt.hash(d.password,12);
 const user=await prisma.$transaction(async tx=>{
   const company=await tx.company.create({data:{name:d.companyName,email:d.companyEmail.toLowerCase(),phone:d.companyPhone||null,address:d.companyAddress,industry:d.industry,status:'PENDING'}});
   const created=await tx.user.create({data:{name:d.name,email,passwordHash,phone:d.phone||null,role:'CLIENT',status:'PENDING_APPROVAL',companyId:company.id}});
   await tx.clientProfile.create({data:{userId:created.id,companyId:company.id,position:d.position,approvalStatus:'PENDING'}});
   return created;
 });
 const admins=await prisma.user.findMany({where:{role:{in:['SUPER_ADMIN','ADMIN']},status:'ACTIVE'},select:{id:true,email:true}});
 await notifyUsers(admins.map(a=>a.id),{title:'New client registration',message:`${d.name} registered ${d.companyName}.`,type:'CLIENT_REGISTRATION',linkUrl:'/admin/approvals'});
 await sendEmail({to:email,subject:'JetWash registration received',html:emailShell('Registration received',`<p>Thank you, ${d.name}. Your ${d.companyName} portal registration is awaiting administrator approval.</p>`)});
 await Promise.all(admins.map(a=>sendEmail({to:a.email,subject:`Client approval required: ${d.companyName}`,html:emailShell('New client registration',`<p>${d.name} (${email}) registered ${d.companyName}.</p><p>Review the request in the admin portal.</p>`)})));
 await logActivity({actorId:user.id,action:'CLIENT_REGISTERED',entityType:'User',entityId:user.id,metadata:{companyName:d.companyName}});
 return Response.json({ok:true},{status:201});
}
