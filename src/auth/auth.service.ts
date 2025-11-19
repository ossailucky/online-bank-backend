import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthorizeDto, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate (authDto: CreateAuthDto): Promise<any> {
    try {
      const user = await this.userService.findUser(authDto);
      if(!user){
        throw new HttpException('Invalid credentials',HttpStatus.NOT_FOUND);
      }
      else{
        const { password} = authDto;

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
          throw new HttpException('Incorrect password',HttpStatus.NOT_ACCEPTABLE);
        }
        else{
          const token = await this.getToken({
            id: user.id, 
            email: user.email
           });

           const data = await this.userService.findUser(authDto);

           return {
            data,
            token
          };
        }    
      }
    
      
    } catch (error) {
      throw error;
      
    }
   
  }

  async getToken(user: AuthorizeDto){ 
    return this.jwtService.sign(user);
   }


  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
