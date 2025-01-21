import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { age, dob, email, firstName, lastName, password } = registerDto;

    const user = await this.getUserByEmail(email);
    if (user) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      age,
      dob,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException('Invalid Credentials');

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) throw new NotFoundException('Invalid Credentials');

    return user;
  }

  async login(user: User) {
    const currUser = await this.getUserByEmail(user.email);

    const payload = { email: currUser.email, sub: currUser._id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    currUser.refreshToken = refreshToken;
    await currUser.save();
    return { user: currUser, token: accessToken };
  }
}
