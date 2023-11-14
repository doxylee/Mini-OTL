import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimetableCreateInput } from './repository.dto';

@Injectable()
export class TimetableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TimetableCreateInput) {
    return this.prisma.timetable.create({ data });
  }
}
