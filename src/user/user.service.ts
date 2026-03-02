import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserPayload } from '../common/interfaces/user-payload.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, password: hashed });
    return this.repo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.repo.findOne({ where: { username } });
    return result || null;
  }

  async findById(userId: number): Promise<UserPayload | null> {
    const result = await this.repo.findOne({ where: { id: userId } });
    if (!result) {
      return null;
    }
    const { id, username } = result;
    return { id, username };
  }
}
