import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config"; 
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@ Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: "1d",
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [UserService, AuthService],
})
export class AuthModule {}