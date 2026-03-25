import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from './todo.entity';
import { FlashModule } from '../flash/flash.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), FlashModule],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
