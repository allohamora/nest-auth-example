import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class RegisterLoginDto {
  @MaxLength(30)
  @IsString()
  @ApiProperty({ maxLength: 30 })
  login: string;

  @IsString()
  @ApiProperty()
  password: string;
}
