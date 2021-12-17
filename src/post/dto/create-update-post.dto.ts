import { IsString, MaxLength } from 'class-validator';

export class CreateUpdatePostDto {
  @MaxLength(30)
  @IsString()
  name: string;

  @MaxLength(1000)
  @IsString()
  body: string;
}
