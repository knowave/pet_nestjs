import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/common/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    return this.userService.getUser(payload.id);
  }
}
