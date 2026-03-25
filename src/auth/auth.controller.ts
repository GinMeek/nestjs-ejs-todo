import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './utils/local-auth.guard';
import { FlashService } from 'src/flash/flash.service';
import { AuthBodyObject } from './dto/user-details.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private userService: UserService,
    private readonly flash: FlashService,
  ) {}

  @Get('register')
  @Render('register')
  registerForm(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      this.flash.info(req, 'You are already logged in');

      return res.redirect('/todos');
    }
    return { title: 'Register' };
  }

  @Post('register')
  async register(
    @Body() createBody: AuthBodyObject,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { username, password } = createBody;

    await this.userService.create(username, password);
    this.flash.success(req, 'Account created. Please log in.');

    return res.redirect('login');
  }

  @Get('login')
  @Render('login')
  loginForm(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      this.flash.info(req, 'You are already logged in');
      return res.redirect('/todos');
    }

    return { title: 'Login' };
  }

  @Post('login')
  @Redirect('/todos')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request) {
    this.flash.success(req, 'Logged in successfully');
  }

  @Get('')
  getAuthSession(@Session() session: Record<string, any>) {
    return session;
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) return res.redirect('/todos');

      req.session.destroy((err) => {
        if (err) {
          return res.redirect('/todos');
        }
        res.clearCookie('connect.sid');
        res.redirect('login');
      });
    });
  }
}
