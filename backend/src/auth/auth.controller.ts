import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, UseGuards, Patch, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req: any, @Body() body: any) {
    return this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
}
