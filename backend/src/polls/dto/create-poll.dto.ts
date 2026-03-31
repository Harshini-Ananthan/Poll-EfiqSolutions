import { IsString, IsArray, IsOptional, IsBoolean, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PollOptionDto {
  @IsString()
  optionText: string;

  @IsOptional()
  @IsString()
  type?: string; // e.g. "Veg", "Non-veg"
}

export class CreatePollDto {
  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options: PollOptionDto[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsBoolean()
  sendPushNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  allowVoteEdit?: boolean;

  @IsOptional()
  @IsBoolean()
  sendReminder?: boolean;
}
