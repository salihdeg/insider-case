import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body(ValidationPipe) userToRegister: RegisterUserDto) {
        return this.authService.register(userToRegister);
    }

    @Throttle({ short: { ttl: 5000, limit: 3 } })
    @Post('login')
    login(@Body(ValidationPipe) userToLogin: LoginUserDto) {
        return this.authService.login(userToLogin);
    }
}
