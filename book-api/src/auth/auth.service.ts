import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}


    async register(registerDto:RegisterDto){
        //Check email
        const existing = await this.prisma.user.findUnique({
            where: {email: registerDto.email}
        });

        if(existing){
            throw new BadRequestException('Email already registered');
        }
        
        // Hash password
        const hashed = await bcrypt.hash(registerDto.password,10);
        
        //Create user
        const user = await this.prisma.user.create({
            data: {
                    email: registerDto.email.trim(),
                    password: hashed,
                    name: registerDto.name
            }, 
            select: { id: true, email: true, name: true },
        })

        //Return JWT
        return this.signToken(user.id, user.email)
    }

    async login(loginDto: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: {email: loginDto.email},
        })

        if(!user){
            throw new UnauthorizedException('Invalid Email or Password')
        }

        const valid = await bcrypt.compare(loginDto.password, user.password)

        if(!valid){
           throw new UnauthorizedException('Invalid email or password');
        }

        return this.signToken(user.id, user.email)
    }

    private signToken(userId: number, email: string){
        const payload = {sub: userId, email};

        return{
            access_token: this.jwtService.sign(payload)
        };
    }
}
