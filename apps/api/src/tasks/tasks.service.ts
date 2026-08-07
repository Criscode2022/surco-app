import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(userId: string, role: Role) {
    const where = role === 'FARMER' ? { farmerId: userId } : { technicianId: userId };
    return this.prisma.fieldTask.findMany({
      where,
      orderBy: { dueAt: 'asc' },
      include: {
        farmer: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        parcel: true,
      },
    });
  }

  async get(id: string, userId: string, role: Role) {
    const t = await this.prisma.fieldTask.findUnique({
      where: { id },
      include: {
        farmer: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        parcel: true,
      },
    });
    if (!t) throw new NotFoundException();
    if (role === 'FARMER' && t.farmerId !== userId) throw new ForbiddenException();
    if (role === 'TECHNICIAN' && t.technicianId !== userId) throw new ForbiddenException();
    return t;
  }

  async create(
    farmerId: string,
    data: { title: string; parcelName: string; crop?: string; notes?: string; dueAt: string; technicianEmail?: string },
  ) {
    let parcel = await this.prisma.parcel.findFirst({ where: { farmerId, name: data.parcelName } });
    if (!parcel) {
      parcel = await this.prisma.parcel.create({
        data: {
          name: data.parcelName,
          crop: data.crop || 'Cultivo',
          hectares: 1,
          farmerId,
        },
      });
    }
    let technicianId: string | null = null;
    let status: TaskStatus = 'PENDING';
    if (data.technicianEmail) {
      const tech = await this.prisma.user.findUnique({ where: { email: data.technicianEmail } });
      if (!tech || tech.role !== 'TECHNICIAN') throw new NotFoundException('Técnico no encontrado');
      technicianId = tech.id;
      status = 'ACTIVE';
    }
    const code =
      'SU-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      String(new Date().getDate()).padStart(2, '0') +
      '-' +
      String(Math.floor(Math.random() * 900) + 100);
    return this.prisma.fieldTask.create({
      data: {
        code,
        title: data.title,
        notes: data.notes || '',
        dueAt: new Date(data.dueAt),
        farmerId,
        technicianId,
        parcelId: parcel.id,
        status,
      },
      include: { parcel: true, technician: true, farmer: true },
    });
  }

  async updateStatus(id: string, userId: string, role: Role, status: TaskStatus) {
    const t = await this.prisma.fieldTask.findUnique({ where: { id } });
    if (!t) throw new NotFoundException();
    if (role === 'FARMER' && t.farmerId !== userId) throw new ForbiddenException();
    if (role === 'TECHNICIAN' && t.technicianId !== userId) throw new ForbiddenException();
    if (role === 'TECHNICIAN' && !['ACTIVE', 'DONE', 'CANCELLED'].includes(status)) {
      throw new ForbiddenException('Estado no permitido para técnico');
    }
    return this.prisma.fieldTask.update({
      where: { id },
      data: { status },
      include: { parcel: true, technician: true, farmer: true },
    });
  }

  async summary(userId: string, role: Role) {
    const where = role === 'FARMER' ? { farmerId: userId } : { technicianId: userId };
    const rows = await this.prisma.fieldTask.findMany({ where, select: { status: true } });
    const byStatus: Record<TaskStatus, number> = { PENDING: 0, ACTIVE: 0, DONE: 0, CANCELLED: 0 };
    for (const r of rows) byStatus[r.status] += 1;
    return { total: rows.length, open: byStatus.PENDING + byStatus.ACTIVE, byStatus };
  }
}
