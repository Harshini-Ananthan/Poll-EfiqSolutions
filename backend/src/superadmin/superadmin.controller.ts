import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateOrganizationStatusDto } from './dto/update-organization-status.dto';

@Controller('superadmin')
@UseGuards(FirebaseAuthGuard)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) { }

  @Get('dashboard-stats')
  async getStats(@Request() req: any, @Query('date') date?: string) {
    if (req.user.role === 'SUPER_ADMIN') {
      return this.superadminService.getDashboardStats();
    }
    return this.superadminService.getTenantDashboardStats(req.user.organizationId, date);
  }

  @Get('organizations')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async getOrganizations(@Query('search') search?: string) {
    return this.superadminService.listOrganizations(search);
  }

  @Get('organizations/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async getOrganization(@Param('id') id: string) {
    return this.superadminService.getOrganization(id);
  }

  @Patch('organizations/:id/status')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateOrganizationStatus(@Param('id') id: string, @Body() body: UpdateOrganizationStatusDto) {
    return this.superadminService.updateOrganizationStatus(id, body.isEnabled);
  }

  @Get('admins')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async getAdmins(@Query('search') search?: string) {
    return this.superadminService.listAdmins(search);
  }

  @Post('admins')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async createAdmin(@Body() body: CreateAdminDto) {
    return this.superadminService.createAdmin(body);
  }

  @Patch('admins/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateAdmin(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    return this.superadminService.updateAdmin(id, body);
  }

  @Post('admins/:id/reset-password')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async resetAdminPassword(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    return this.superadminService.updateAdmin(id, { password: body.password });
  }

  @Get('activity')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async getActivity() {
    return this.superadminService.getActivity();
  }

  @Get('users')
  async getUsers(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.superadminService.getOrganizationUsers(req.user.organizationId, startDate, endDate);
  }

  @Post('users')
  async createUser(@Request() req: any, @Body() userData: any) {
    return this.superadminService.createUser(req.user.organizationId, userData);
  }
}
