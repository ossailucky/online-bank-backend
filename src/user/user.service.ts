import { Injectable,BadRequestException, ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });
  
      if (existingUser) {
        console.log('User with this email already exists:', existingUser.email);
        
        throw new ConflictException('User with this email already exists');
      }

  
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });
    
      // const url = `${process.env.APP_URL}/verify-email?token=${tokenSign}`;
      // await this.mailService.sendEmailVerification(userData.email, url, userData.username);


      return this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findUser(data: CreateAuthDto): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({where:{email: data.email}});
    
      if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        
      return user;
    } catch (error) {
      throw error;
    }
  }

  

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({where:{id}});

      if(!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw error;
      
    }
    
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
