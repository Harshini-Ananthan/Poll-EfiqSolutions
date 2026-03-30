import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PollsModule } from './polls/polls.module';
import { VotesModule } from './votes/votes.module';
import { SuperadminModule } from './superadmin/superadmin.module';

@Module({
  imports: [AuthModule, UsersModule, OrganizationsModule, PollsModule, VotesModule, SuperadminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
