import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/casl/action.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  public create({ name, body }: CreateUpdatePostDto, author: User) {
    const post = this.postRepository.create({ name, body, author });

    return this.postRepository.save(post);
  }

  public getOne(id: number) {
    return this.postRepository.findOneOrFail(id);
  }

  public getMany() {
    return this.postRepository.find();
  }

  public async update({ name, body }: CreateUpdatePostDto, id: number, ability: AppAbility) {
    const post = await this.postRepository.findOneOrFail(id);

    if (ability.cannot(Action.Update, post)) {
      throw new ForbiddenException();
    }

    post.name = name;
    post.body = body;

    return this.postRepository.save(post);
  }

  public async delete(id: number, ability: AppAbility) {
    const post = await this.postRepository.findOneOrFail(id);

    if (ability.cannot(Action.Delete, post)) {
      throw new ForbiddenException();
    }

    await this.postRepository.delete({ id });
  }
}
