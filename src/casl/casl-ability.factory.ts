import { User } from 'src/user/user.entity';
import { AbilityBuilder, InferSubjects, Ability, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Post } from 'src/post/post.entity';
import { Action } from './action.enum';
import { Role } from './role.enum';
import { Injectable } from '@nestjs/common';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    switch (user.role) {
      case Role.Admim: {
        can(Action.Manage, 'all');
      }
      case Role.User: {
        can(Action.Create, Post);
        can(Action.Manage, Post, { authorId: user.id });
      }
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
