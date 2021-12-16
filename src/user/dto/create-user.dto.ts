import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(30)
  @IsString()
  login: string;

  @IsString()
  password: string;
}
