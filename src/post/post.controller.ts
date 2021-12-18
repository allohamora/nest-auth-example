import {
  Controller,
  UseGuards,
  Post as RestPost,
  Put,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiException({ statusCode: HttpStatus.NOT_FOUND })
  @ApiOkResponse({ type: Post })
  @Get(':id')
  public async get(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return await this.postService.get(id);
  }

  @ApiException({ statusCode: HttpStatus.FORBIDDEN })
  @ApiOkResponse({ description: 'post deleted' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Post))
  public async delete(@Param('id', ParseIntPipe) id: number, @CurrentAbility() ability: AppAbility): Promise<void> {
    return await this.postService.delete(id, ability);
  }

  @ApiException({ statusCode: HttpStatus.FORBIDDEN })
  @ApiCreatedResponse({ type: Post })
  @ApiBearerAuth()
  @RestPost()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Post))
  public async create(@Body() createPostDto: CreateUpdatePostDto, @CurrentUser() user: User): Promise<Post> {
    return await this.postService.create(createPostDto, user);
  }

  @ApiException({ statusCode: HttpStatus.FORBIDDEN })
  @ApiOkResponse({ type: Post })
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Post))
  public async update(
    @Body() updatePostDto: CreateUpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
    @CurrentAbility() ability: AppAbility,
  ): Promise<Post> {
    return await this.postService.update(updatePostDto, id, ability);
  }
}
