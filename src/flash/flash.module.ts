import { Module } from '@nestjs/common';
import { FlashService } from './flash.service';

@Module({ providers: [FlashService], exports: [FlashService] })
export class FlashModule {}
