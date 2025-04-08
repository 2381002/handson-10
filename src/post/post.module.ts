import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";


@Module({
    imports: [TypeOrmModule.forFeature([Posts])],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule{}