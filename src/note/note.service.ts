import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.NoteWhereUniqueInput;
      where?: Prisma.NoteWhereInput;
      orderBy?: Prisma.NoteOrderByWithRelationInput;
    },
    userId: number,
  ): Promise<Note[]> {
    const { skip, take, cursor, orderBy } = params;
    return this.prismaService.note.findMany({
      skip,
      take,
      cursor,
      where: {
        user: { id: userId },
      },
      orderBy,
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prismaService.note.findFirst({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note?.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const data = updateNoteDto as Prisma.NoteUpdateInput;

    await this.findOne(id, userId);

    return this.prismaService.note.update({
      data,
      where: {
        id,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prismaService.note.delete({ where: { id } });
  }
}
