import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

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

  async login(loginDto: LoginDto) {
    /**
     * Get user from db
     * compare password
     * return token
     */
    const user = await this.userService.getUserByEmail(loginDto.email);
    const validPassword = user
      ? await bcrypt.compare(loginDto.password, user.password)
      : false;

    if (!user || !validPassword) {
      throw new UnauthorizedException('Invalid credential');
    }

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
    };
  }
}
