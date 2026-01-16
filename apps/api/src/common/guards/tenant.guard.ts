import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.tenantId) {
      throw new ForbiddenException("Tenant context missing");
    }
    request.tenantId = user.tenantId;
    return true;
  }
}
