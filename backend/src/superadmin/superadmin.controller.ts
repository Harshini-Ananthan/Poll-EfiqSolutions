import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('superadmin')
@UseGuards(JwtAuthGuard)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('dashboard-stats')
  async getStats(@Request() req: any) {
    return this.superadminService.getDashboardStats(req.user.organizationId);
  }

  @Get('users')
  async getUsers(@Request() req: any) {
    return this.superadminService.getOrganizationUsers(req.user.organizationId);
  }
}
