import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

ApiTags("user")
@Controller({version: "1", path: "user"})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post("register")
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @hasRoles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
