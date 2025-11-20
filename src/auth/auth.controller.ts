import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

ApiTags('auth')
@Controller({version: '1', path: 'auth'})
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("login")
 async  login( @Res() res: Response, @Body() createAuthDto: CreateAuthDto) {
    const {data, token} =  await this.authService.validate(createAuthDto);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.json({
      data,
      token
    })
  }

  @Post("register")
  async register(@Res() res: Response, @Body() userDto: CreateUserDto){
    const data = await this.userService.create(userDto);
    const token = await this.authService.getToken({
      id:data.id,
      email:data.email
    })
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json({data, token});
  }


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
