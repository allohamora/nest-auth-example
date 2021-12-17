import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 1000 })
  body: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;
}
