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
  Logger,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'generated/prisma';

@Controller('api/notes')
export class NoteController {
  logger = new Logger(NoteController.name);

  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req: Request) {
    const { id: userId } = req['user'] as User;

    this.logger.log(req['user']);

    return await this.noteService.create(
      {
        ...createNoteDto,
      },
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Request() req: { user: { id: number } },
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
  ) {
    try {
      this.logger.log('take=', take, 'skip=', skip);
      return await this.noteService.findAll(
        {
          take: take || 10,
          skip: skip || 0,
        },
        req.user.id,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error while fetching notes');
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: number } },
  ) {
    try {
      const note = await this.noteService.findOne(+id, req.user.id);
      return note;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: { user: { id: number } },
  ) {
    try {
      return this.noteService.update(+id, updateNoteDto, req.user.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: { id: number } },) {
    try {
      return this.noteService.remove(+id, req.user.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
