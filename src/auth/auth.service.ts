import { DatabaseService } from './../database/database.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService
    ) { }

    async register(userToRegister: RegisterUserDto) {

        await this.checkUserAlreadyExist(userToRegister.email);

        const hashedPassword = await this.hashPassword(userToRegister.password);

        const user = await this.databaseService.user.create({
            data: {
                ...userToRegister,
                password: hashedPassword,
            }
        });

        return this.createToken(user.email);
    }

    async login(userToLogin: LoginUserDto) {

        const loginUser = await this.checkUserNotExist(userToLogin.email);

        await this.comparePasswords(userToLogin.password, loginUser.password);

        return this.createToken(loginUser.email);
    }

    async createToken(email: string) {
        return this.jwtService.signAsync({ email });
    }

    async hashPassword(pass: string) {
        return bcrypt.hash(pass, 10);
    }

    // BUSINESS LOGIC

    async checkUserAlreadyExist(email: string) {
        const userExist = await this.databaseService.user.findUnique({
            where: {
                email: email,
            }
        });

        if (userExist) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
    }

    async checkUserNotExist(email: string) {
        const userExist = await this.databaseService.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!userExist) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
        }

        return userExist;
    }

    async comparePasswords(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        return isPasswordValid;
    }
}
