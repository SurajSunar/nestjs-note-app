import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'generated/prisma';

@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req: Request) {
    const { id: userId } = req['user'] as User;

    return await this.noteService.create(
      {
        ...createNoteDto,
      },
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.noteService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const note = await this.noteService.findOne(+id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.noteService.remove(+id);
    } catch (error) {
      throw new NotFoundException('Note not found')
    }
  }
}
