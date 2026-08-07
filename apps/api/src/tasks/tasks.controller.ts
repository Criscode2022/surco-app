import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateTaskDto {
  @IsString() @MinLength(3) title!: string;
  @IsString() @MinLength(2) parcelName!: string;
  @IsOptional() @IsString() crop?: string;
  @IsDateString() dueAt!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsEmail() technicianEmail?: string;
}
class StatusDto { @IsEnum(TaskStatus) status!: TaskStatus; }

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasks: TasksService) {}
  @Get()
  list(@Req() req: { user: { userId: string; role: 'FARMER' | 'TECHNICIAN' } }) {
    return this.tasks.list(req.user.userId, req.user.role);
  }
  @Get('stats/summary')
  stats(@Req() req: { user: { userId: string; role: 'FARMER' | 'TECHNICIAN' } }) {
    return this.tasks.summary(req.user.userId, req.user.role);
  }
  @Get(':id')
  get(@Param('id') id: string, @Req() req: { user: { userId: string; role: 'FARMER' | 'TECHNICIAN' } }) {
    return this.tasks.get(id, req.user.userId, req.user.role);
  }
  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: { user: { userId: string; role: string } }) {
    if (req.user.role !== 'FARMER') throw new ForbiddenException();
    return this.tasks.create(req.user.userId, dto);
  }
  @Patch(':id/status')
  status(@Param('id') id: string, @Body() dto: StatusDto, @Req() req: { user: { userId: string; role: 'FARMER' | 'TECHNICIAN' } }) {
    return this.tasks.updateStatus(id, req.user.userId, req.user.role, dto.status);
  }
}
