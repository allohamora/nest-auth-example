import { IsString, MaxLength } from 'class-validator';

export class RegisterLoginDto {
  @MaxLength(30)
  @IsString()
  login: string;

  @IsString()
  password: string;
}
