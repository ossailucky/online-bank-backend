import { Injectable,BadRequestException, ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto, ResetPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    
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

  async forgotPassword(email: string) {
    try {
      const user = await this.usersRepository.findOne({where:{ email: email} });
    if (!user) throw new NotFoundException('User not found');
  
    const token = this.jwtService.sign({ email: user.email }, {
      secret: process.env.JWT_RESET_SECRET,
      expiresIn: '15m',
    });
  
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`; // or frontend URL
  
    await this.mailService.sendPasswordReset(user.email,resetUrl,user.fullName);
  
    return { message: 'Password reset link sent to your email.' };
    } catch (error) {
      throw error;
      
    }
    
  }

  async resetPassword(dto: ResetPasswordDto, token:string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET,
      });
  
      const user = await this.usersRepository.findOne({where: { email: payload.email }});
      if (!user) throw new NotFoundException('User not found');
  
      user.password = await bcrypt.hash(dto.newPassword, 10);
      await this.usersRepository.save(user);
  
      return { message: 'Password reset successfully.' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired reset token.');
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

  

 async findAll(): Promise<User[]> {
  try {
    const users = await this.usersRepository.find();
    if(!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  } catch (error) {
    throw error;
    
  }
    
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if(!user) throw new NotFoundException('User not found');

      Object.assign(user,updateUserDto);

      await this.usersRepository.save(user);
      return `user info updated successfully`;
    } catch (error) {
      
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if(!user) throw new NotFoundException('User not found');
      await this.usersRepository.remove(user);
      return `User has been removed`;
    } catch (error) {
      throw error;
      
    }
  }
}
