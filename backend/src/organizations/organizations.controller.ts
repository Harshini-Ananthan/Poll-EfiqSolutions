import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';

@Controller('organizations')
@UseGuards(FirebaseAuthGuard)
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
