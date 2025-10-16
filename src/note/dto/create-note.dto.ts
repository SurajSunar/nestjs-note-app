import { IsNotEmpty, Max, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;
}
