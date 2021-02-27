import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '@photobook/data';

import { Auth } from '../../entities';
import { ConfigEnum } from '../../config/typeorm.config';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>(ConfigEnum.JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { email } = payload;
    const user = await this._authRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;

    return user;
  }
}
