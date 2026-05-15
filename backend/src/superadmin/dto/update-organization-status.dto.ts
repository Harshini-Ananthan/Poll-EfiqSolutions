import { IsBoolean } from 'class-validator';

export class UpdateOrganizationStatusDto {
  @IsBoolean()
  isEnabled: boolean;
}
