import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signup(@Body() dto: AuthDto) {
        
        const accessToken = await this.authService.signin(dto);
        return {
            status: 200,
            message: "Successfully Login",
            data: {
                access_token: accessToken
            }
        }
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    signin(@Body() dto: AuthDto) {       
        return this.authService.signup(dto);
    }
}