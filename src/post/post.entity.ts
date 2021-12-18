import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ maxLength: 30 })
  @Column({ length: 30 })
  name: string;

  @ApiProperty({ maxLength: 1000 })
  @Column({ length: 1000 })
  body: string;

  @ApiProperty()
  @Column()
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;
}
