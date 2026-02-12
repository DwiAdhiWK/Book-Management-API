import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[PrismaModule,
    JwtModule.registerAsync({ inject: [ConfigService],
      useFactory: (config: ConfigService) => ({secret: config.get<string>('JWT_SECRET') || 'super-secret-change-me',
      signOptions: { expiresIn: '1h' },
  }),
})  
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
