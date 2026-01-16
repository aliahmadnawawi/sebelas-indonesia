import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const superTenantId =
      this.configService.get<string>("SUPERADMIN_TENANT_ID") || "super-tenant";
    if (!user || user.tenantId !== superTenantId) {
      throw new ForbiddenException("Superadmin only");
    }
    return true;
  }
}
