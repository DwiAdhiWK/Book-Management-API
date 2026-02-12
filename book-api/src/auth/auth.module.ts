import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports:[PrismaModule,
    JwtModule.registerAsync({ inject: [ConfigService],
      useFactory: (config: ConfigService) => ({secret: config.get<string>('JWT_SECRET') || 'super-secret-change-me',
      signOptions: { expiresIn: '1h' },
  }),
})  
  ],
  providers: [AuthService, JwtStrategy, JwtGuard],
  controllers: [AuthController]
})
export class AuthModule {}
