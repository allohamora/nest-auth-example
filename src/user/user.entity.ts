import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Session } from 'src/auth/session.entity';
import { Role } from 'src/casl/role.enum';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ maxLength: 30 })
  @Index({ unique: true })
  @Column({ length: 30 })
  login: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ enum: Role, default: Role.User })
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
