import {
  Controller,
  Get,
  Inject,
  Post,
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

interface AuthBodyObject {
  username: string;
  password: string;
}

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

      return res.redirect('/');
    }
    return { title: 'Register' };
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { username, password } = req.body as AuthBodyObject;
    await this.userService.create(username, password);
    this.flash.success(req, 'Account created. Please log in.');
    res.redirect('login');
  }

  @Get('login')
  @Render('login')
  loginForm(@Req() req: Request, @Res() res: Response) {
    this.flash.info(req, 'Please log in to continue');
    this.flash.error(req, 'This is an error message example');

    if (req.user) {
      this.flash.info(req, 'You are already logged in');
      return res.redirect('/');
    }

    return { title: 'Login' };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request, @Res() res: Response) {
    this.flash.success(req, 'Logged in successfully');
    res.redirect('/');
  }

  @Get('')
  getAuthSession(@Session() session: Record<string, any>) {
    console.log(session);
    console.log('Session ID:', session.id);

    return session;
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {});
    this.flash.success(req, 'Logged out');
    res.redirect('login');
  }
}
