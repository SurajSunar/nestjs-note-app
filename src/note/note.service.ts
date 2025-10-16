import { Injectable } from '@nestjs/common';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';
import { Note, Prisma } from 'generated/prisma';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const data = {
      ...createNoteDto,
      user: {
        connect: { id: userId },
      },
    } as Prisma.NoteCreateInput;
    return await this.prismaService.note.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NoteWhereUniqueInput;
    where?: Prisma.NoteWhereInput;
    orderBy?: Prisma.NoteOrderByWithRelationInput;
  }): Promise<Note[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.note.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: number) {
    return this.prismaService.note.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const data = updateNoteDto as Prisma.NoteUpdateInput;
    return this.prismaService.note.update({
      data,
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    return this.prismaService.note.delete({ where: { id } });
  }
}
