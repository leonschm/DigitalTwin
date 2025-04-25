import { IsEmail, IsString, IsOptional, IsBoolean, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProfileDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}

class AIConfigurationDto {
  @IsString()
  @IsOptional()
  interactionStyle?: string;

  @IsInt()
  @IsOptional()
  maxInteractionsPerDay?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredTopics?: string[];

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  responseLength?: string;
}

export class UpdateGemeoDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateNested()
  @Type(() => ProfileDto)
  @IsOptional()
  profile?: ProfileDto;

  @ValidateNested()
  @Type(() => AIConfigurationDto)
  @IsOptional()
  aiConfiguration?: AIConfigurationDto;
}