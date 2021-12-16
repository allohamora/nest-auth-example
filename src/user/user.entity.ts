import { Session } from 'src/auth/session.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 30 })
  login: string;

  @Column()
  password: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
