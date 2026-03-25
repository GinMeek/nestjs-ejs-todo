import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';
import { FindTodoWhere } from '../common/types/request-with-user.type';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  createForUser(payLoad: Partial<Todo>) {
    if (!payLoad.user) {
      throw new Error('User unauthorized or not logged in');
    }
    const t = this.repo.create({ ...payLoad });
    return this.repo.save(t);
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: { user: true } });
  }

  async findByUser(user: User) {
    const todos = await this.repo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
    return todos;
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOneForUser(id: number, userId: number) {
    const todo = await this.findOne(id);

    if (!todo || todo?.user.id !== userId)
      throw new Error('Not found or unauthorized');
    return todo;
  }

  async updateForUser(id: number, attrs: Partial<Todo>, userId: number) {
    const todo = await this.findOne(id);
    if (!todo || todo.user.id !== userId)
      throw new Error('Not found or unauthorized');
    return this.repo.update(id, attrs);
  }

  async toggleDone(id: number, userId: number): Promise<Todo> {
    const todo = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!todo) throw new NotFoundException();
    todo.done = !todo.done;
    const newTodo = await this.repo.save(todo);

    return newTodo;
  }

  async removeForUser(id: number, userId: number) {
    const todo = await this.findOne(id);
    if (!todo || todo.user.id !== userId)
      throw new Error('Not found or unauthorized');
    await this.repo.delete(id);
  }

  async findPaginatedForUser(
    userId: number,
    page = 1,
    limit = 5,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: Partial<FindTodoWhere> = { user: { id: userId } };
    if (status === 'done') where.done = true;
    if (status === 'pending') where.done = false;

    const [todos, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['user'],
    });
    const totalPages = Math.ceil(total / limit);
    return { todos, totalPages, currentPage: page };
  }
}
