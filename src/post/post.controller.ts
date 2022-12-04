import {
  Controller,
  UseGuards,
  Post as HttpPost,
  Put,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Action } from 'src/casl/action.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { CurrentAbility } from 'src/casl/current-ability.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { User } from 'src/user/user.entity';
import { ApiException } from 'src/utils/api-exception.decorator';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiOkResponse({ type: Post, isArray: true })
  public getMany(): Promise<Post[]> {
    return this.postService.getMany();
  }

  @Get(':id')
  @ApiException({ statusCode: HttpStatus.NOT_FOUND })
  @ApiOkResponse({ type: Post })
  public getOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return this.postService.getOne(id);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Post))
  @Auth()
  public async delete(@Param('id', ParseIntPipe) id: number, @CurrentAbility() ability: AppAbility): Promise<void> {
    return this.postService.delete(id, ability);
  }

  @HttpPost()
  @ApiCreatedResponse({ type: Post })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Post))
  @Auth()
  public async create(@Body() createPostDto: CreateUpdatePostDto, @CurrentUser() user: User): Promise<Post> {
    return this.postService.create(createPostDto, user);
  }

  @Put(':id')
  @ApiOkResponse({ type: Post })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Post))
  @Auth()
  public update(
    @Body() updatePostDto: CreateUpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
    @CurrentAbility() ability: AppAbility,
  ): Promise<Post> {
    return this.postService.update(updatePostDto, id, ability);
  }
}
