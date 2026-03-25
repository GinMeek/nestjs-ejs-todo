import { IsString, Length } from 'class-validator';

export class AuthBodyObject {
  @IsString()
  username: string;

  @IsString()
  @Length(6, 32)
  password: string;
}
