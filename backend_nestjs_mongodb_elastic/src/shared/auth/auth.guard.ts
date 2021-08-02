import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authorization = ctx.req.headers.authorization;
    if (!authorization) return false;
    ctx.user = await this.validateToken(authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token');
    }
    const token = auth.split(' ')[1];
    try {
      return jwt.verify(token, 'myJwtSecret');
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
