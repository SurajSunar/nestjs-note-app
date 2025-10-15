import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    /**
     * check email
     * hash password
     * create user
     * return JWT
     */
    const user = await this.userService.getUserByEmail(registerDto.email);

    if (user) {
      throw new ConflictException('Email already taken');
    }

    const saltRounds = 10;

    const hashPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const { id, name, email } = await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
    });

    return {
      id,
      name,
      email,
      access_token: await this.jwtService.signAsync({ id, name, email }),
    };
  }
}
