import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateUpdatePostDto {
  @ApiProperty({ maxLength: 30 })
  @MaxLength(30)
  @IsString()
  name: string;

  @ApiProperty({ maxLength: 30 })
  @MaxLength(1000)
  @IsString()
  body: string;
}
