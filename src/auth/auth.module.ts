import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.stategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';

@Module({
  imports: [
    UserModule,
    CryptoModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
