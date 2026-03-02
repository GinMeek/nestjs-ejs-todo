import { IsString, IsOptional, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Length(1, 200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
