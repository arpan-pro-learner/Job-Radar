import { IsString, IsOptional, IsUrl, IsInt, Min, Max } from 'class-validator';

export class CreateStartupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsUrl()
  careersUrl?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  hiringScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  remoteScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  techStackScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  growthScore?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  aiSummary?: string;

  @IsOptional()
  @IsString()
  outreachAngle?: string;
}
