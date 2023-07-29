import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SigninDto } from './dto/signin.dto';

describe('Auth Controller Test ', () => {
  let controller: AuthController;
  let service: AuthService;

  let signinDto = new SigninDto();
  (signinDto.email = 'Teza@gmail.com'), (signinDto.password = 'password');

  let access_token = 'fake-access-token';

  const authService = {
    signin: jest.fn(() => {
        return access_token;
    }),

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
            provide: AuthService,
            useValue: authService
        }
    ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have signin function', () => {
    expect(controller.signin).toBeDefined();
  });
  
  it('should signin and return with user', async () => {
    const result = await controller.signin(signinDto);
    
    expect(result).toEqual({
        status: 200,
        message: "Successfully Login",
        data: {
            access_token: access_token
        }
    });

    expect(service.signin).toBeCalled();

  });


});