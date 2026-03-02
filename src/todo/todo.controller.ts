import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthenticatedGuard } from '../auth/utils/authenticated.guard';
import type { RequestWithUser } from '../common/types/request-with-user.type';

@Controller('todos')
@UseGuards(AuthenticatedGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @Render('index')
  async index(@Req() req: RequestWithUser) {
    const page = parseInt(req.query.page as string) || 1;
    const status = req.query.status as string;
    const userId = req.user.id;
    // find todos only for req.user.id
    const { todos, totalPages, currentPage } =
      await this.todoService.findPaginatedForUser(userId, page, 5, status);
    return { todos, totalPages, currentPage, status, title: 'Todos' };
  }

  @Post()
  @Redirect('/todos')
  async create(@Body() body: CreateTodoDto, @Req() req: RequestWithUser) {
    try {
      await this.todoService.createForUser({
        title: body.title,
        description: body.description,
        user: req.user,
      });
      req.flash('success', 'Todo added successfully!');
    } catch (err) {
      req.flash('error', 'Failed to add todo');
    }
  }

  @Post(':id/toggle')
  async toggle(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    await this.todoService.toggleDone(id, userId);
    res.redirect('/');
  }

  @Get(':id/edit')
  @Render('edit')
  async edit(@Param('id') id: string, @Req() req: RequestWithUser) {
    console.log(id, typeof id);
    const userId = req.user.id;
    const todo = await this.todoService.findOneForUser(parseInt(id), userId);
    return { title: 'Edit Todo', todo };
  }

  @Post(':id/update')
  async update(
    @Param('id') id: string,
    @Body() body: CreateTodoDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    await this.todoService.updateForUser(parseInt(id), body, userId);
    res.redirect('/');
  }

  @Post(':id/delete')
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    await this.todoService.removeForUser(parseInt(id), userId);
    res.redirect('/');
  }
}
