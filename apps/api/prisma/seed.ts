import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  await prisma.fieldTask.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.user.deleteMany();
  const hash = await bcrypt.hash('password123', 10);
  const farmer = await prisma.user.create({
    data: { email: 'campo@surco.agro', passwordHash: hash, name: 'Inés Roura', role: 'FARMER' },
  });
  const tech = await prisma.user.create({
    data: { email: 'tecnico@surco.agro', passwordHash: hash, name: 'Pol Vidal', role: 'TECHNICIAN' },
  });
  const p1 = await prisma.parcel.create({
    data: { name: 'Bancal Nord', crop: 'Olivo arbequina', hectares: 2.4, farmerId: farmer.id },
  });
  const p2 = await prisma.parcel.create({
    data: { name: 'Surco Baix', crop: 'Almendro', hectares: 1.1, farmerId: farmer.id },
  });
  const base = new Date();
  base.setHours(8, 0, 0, 0);
  await prisma.fieldTask.createMany({
    data: [
      { code: 'SU-0807-01', title: 'Riego gota a gota', notes: '2 h sector A', status: 'ACTIVE', dueAt: new Date(base.getTime()), farmerId: farmer.id, technicianId: tech.id, parcelId: p1.id },
      { code: 'SU-0807-02', title: 'Revisión plagas', notes: 'Trampas feromonas', status: 'PENDING', dueAt: new Date(base.getTime() + 86400000), farmerId: farmer.id, technicianId: null, parcelId: p1.id },
      { code: 'SU-0807-03', title: 'Poda de mantenimiento', notes: '', status: 'DONE', dueAt: new Date(base.getTime() - 86400000), farmerId: farmer.id, technicianId: tech.id, parcelId: p2.id },
      { code: 'SU-0807-04', title: 'Análisis de suelo', notes: 'Muestras 3 puntos', status: 'PENDING', dueAt: new Date(base.getTime() + 2*86400000), farmerId: farmer.id, technicianId: tech.id, parcelId: p2.id },
      { code: 'SU-0807-05', title: 'Abonado orgánico', notes: 'Compost 4 t/ha', status: 'ACTIVE', dueAt: new Date(base.getTime() + 3*86400000), farmerId: farmer.id, technicianId: tech.id, parcelId: p1.id },
    ],
  });
  console.log('SURCO seed OK');
}
main().finally(() => prisma.$disconnect());
