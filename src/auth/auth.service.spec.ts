import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('Auth Service Test ', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  let signinDto = new SigninDto();
  (signinDto.email = 'Teza@gmail.com'), (signinDto.password = 'password');

  let secretToken = 'secret-token';

  

  let user = {
    id: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    email: 'example@gmail.com',
    passwordHash: 'password',
    fullname: 'example',
    role: 'dokter'
  }

  
  let payload = {sub: user.id, email: user.email}

  let options = {
    expiresIn: '20m',
    secret: secretToken
  }

  let access_token = 'fake-access-token';

  const prismaService = {
    findFirst: jest.fn(async ({}) => {
      return user;
    }),
  };

  const jwtService = {
    signAsync: jest.fn((payload, options) => {
      return access_token;
    }),
  };

  const configService = {
    get: jest.fn(() => {
        return secretToken;
    }),
  };

  const argonService = {
    verify: jest.fn( async (passwordHash, passwordDto) => {
      if (passwordHash == passwordDto) {
        return true;
      }
      return false;
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService
        },
        {
          provide: JwtService,
          useValue: jwtService
        },
        {
          provide: ConfigService,
          useValue: configService 
        },
        
    ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have signToken function', () => {
    expect(service.signToken).toBeDefined();
  });
  
  it('should signToken and return with jwt token',  () => {
    const result = jwtService.signAsync(payload, options);    
    expect(result).toEqual(access_token);

    expect(jwtService.signAsync).toBeCalled();
  });

  it('should have signin function', () => {
    expect(service.signin).toBeDefined();
  });
  
  it('should signin and return with jwt token', async () => {
    const userSearch = await prismaService.findFirst({where: {
      email: user.email
    }});
    expect(userSearch).toEqual(user);
    expect(prismaService.findFirst).toBeCalled();

    const pwMatches = await argonService.verify(userSearch.passwordHash, signinDto.password)
    expect(pwMatches).toEqual(true);

    const pwNotMatches = await argonService.verify(userSearch.passwordHash, 'wrong password')
    expect(pwMatches).toEqual(true);

    expect(userSearch).toEqual(user);
    expect(prismaService.findFirst).toBeCalled();

    const result = await service.signToken(userSearch.id, userSearch.email, user.role);
    expect(result).toEqual(access_token);
  });

});