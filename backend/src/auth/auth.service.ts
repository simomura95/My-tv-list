import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(authDto: AuthDto): Promise<any> {
    const { username, password } = authDto
    if (!username || !password) {
      throw new BadRequestException('All fields must be filled')
    }

    const exists = await this.usersService.findOne(username)
    if (exists) {
      throw new BadRequestException('Username already in use')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)  
    const user = await this.usersService.create({ username, password: hash})
    
    const payload = { sub: user._id, username: user.username }; // cosa voglio inserire nel payload dell'user, che poi viene restituito da function auth/profile
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username
    };
  }
  

  async signIn(authDto: AuthDto): Promise<any> {
    const { username, password } = authDto
    const user = await this.usersService.findOne(username)
    if (!user) {
      throw new NotFoundException('Username not found')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException('Wrong password')
    }

    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload), // quando va con successo, ottengo il token nel json
      username: user.username
    };
  }
}
