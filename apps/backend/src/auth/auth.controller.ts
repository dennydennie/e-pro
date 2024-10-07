/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private service: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<UserDto> {
    const user = await this.service.login(body.email, body.password);

    return UserDto.fromDomain(user);
  }

}
