import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/crypto/crypto.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}

  public async create({ login, password }: CreateUserDto) {
    const hashedPassword = await this.cryptoService.scryptHash(password);
    const user = this.usersRepository.create({ login, password: hashedPassword });

    try {
      await this.usersRepository.save(user);
    } catch {
      throw new BadRequestException();
    }
  }

  public async findOne(id: number) {
    return await this.usersRepository.findOneOrFail(id);
  }

  public async findOneByLogin(login: string) {
    return await this.usersRepository.findOneOrFail({ where: { login } });
  }
}
