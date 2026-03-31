import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.organizationsService.getProfile(req.user.organizationId);
  }

  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() data: any) {
    return this.organizationsService.updateProfile(req.user.organizationId, data);
  }
}
