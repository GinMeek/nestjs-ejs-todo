import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthenticatedGuard } from '../auth/utils/authenticated.guard';
import { FlashService } from '../flash/flash.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('todos')
@UseGuards(AuthenticatedGuard)
export class TodoController {
  constructor(
    private todoService: TodoService,
    private flash: FlashService,
  ) {}

  @Get()
  @Render('index')
  async index(@GetUser('id') userId: number, @Req() req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const status = req.query.status as string;
    const { todos, totalPages, currentPage } =
      await this.todoService.findPaginatedForUser(userId, page, 5, status);

    return { todos, totalPages, currentPage, status, title: 'Todos' };
  }

  @Post()
  @Redirect('/todos')
  async create(
    @GetUser() user: User,
    @Body() body: CreateTodoDto,
    @Req() req: Request,
  ) {
    try {
      await this.todoService.createForUser({
        title: body.title,
        description: body.description,
        user,
      });
      this.flash.success(req, 'Todo added successfully!');
    } catch (err) {
      this.flash.error(
        req,
        err instanceof Error ? String(err.message) : 'Failed to add todo',
      );
    }
  }

  @Post(':id/toggle')
  @Redirect('/todos')
  async toggle(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    await this.todoService.toggleDone(id, userId);
    this.flash.success(req, 'Todo toggled successfully');
  }

  @Get(':id/edit')
  @Render('edit')
  async edit(@GetUser('id') userId: number, @Param('id') id: string) {
    const todo = await this.todoService.findOneForUser(parseInt(id), userId);
    return { title: 'Edit Todo', todo };
  }

  @Post(':id/update')
  @Redirect('/todos')
  async update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() body: CreateTodoDto,
    @Req() req: Request,
  ) {
    await this.todoService.updateForUser(parseInt(id), body, userId);
    this.flash.success(req, 'Todo updated successfully');
  }

  @Post(':id/delete')
  @Redirect('/todos')
  async delete(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    await this.todoService.removeForUser(parseInt(id), userId);

    this.flash.success(req, 'Delete operation completed succefully!');
  }
}
