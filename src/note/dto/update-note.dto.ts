import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;
}
