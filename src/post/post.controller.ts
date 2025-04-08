import { Body, Controller, Delete, Get, Post, Put, NotFoundException, Param, Query, Req } from "@nestjs/common";
import { CreatePostDTO } from "./create-post.dto";
import { JwtPayloadDTO } from "src/auth/dto/jwt-payload.dto";
import { Posts } from "./post.entity";
import { PostService } from "./post.service";
import { ApiParam, ApiQuery } from "@nestjs/swagger";
import { request } from "http";


@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}
    @Post()
    async create(@Req() request: Request, @Body() CreatePostDTO: CreatePostDTO) {
        const userJwtPayload: JwtPayloadDTO = request['user']; 

        const posts: Posts = new Posts();
        posts.content = CreatePostDTO.content;
        posts.image_url = CreatePostDTO.image_url;
        posts.title = CreatePostDTO.title;
        posts.user_id = userJwtPayload.sub;
        await this.postService.save(posts);
    }

    @Get()
    @ApiQuery({name: 'page', required: false, type: Number, example: 1})
    @ApiQuery({name: 'limit', required: false, type: Number, example: 10})
    async findAll(
        @Req() request: Request,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Posts[]> {
        const userJwtPayload: JwtPayloadDTO = request['user'];
        return await this.postService.findByUserId(userJwtPayload.sub, page, limit);
    }

    @Get(':id')
    @ApiParam({name: 'id', type: Number, description: 'ID of the post'})
    async findOne(
        @Req() request: Request,
        @Param('id') id: number
    ) {
        const userJwtPayload: JwtPayloadDTO = request['user'];
        return await this.postService.findByUserIdAndPostId(userJwtPayload.sub, id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
    async updateOne(
        @Req() request: Request,
        @Param('id') id: number,
        @Body() createPostDTO: CreatePostDTO
    ) {
        const userJwtPayload: JwtPayloadDTO = request['user'];
        const post: Posts = await this.postService.findByUserIdAndPostId(userJwtPayload.sub, id);
        if (post.id == null) {
            throw new NotFoundException();
        }
        post.title = createPostDTO.title;
        post.content = createPostDTO.content;
        post.image_url = createPostDTO.image_url;
        await this.postService.save(post);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
    async deleteOne(@Req() request: Request, @Param('id') id: number) {
        const userJwtPayload: JwtPayloadDTO = request['user'];
        const post: Posts = await this.postService.findByUserIdAndPostId(userJwtPayload.sub, id);

        if(post.id == null) {
            throw new NotFoundException();
        }

        await this.postService.deleteById(id);
    }
}

