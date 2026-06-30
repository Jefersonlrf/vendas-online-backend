import { Test, TestingModule } from '@nestjs/testing';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { returnLoginMock } from '../__mocks__/return-login.mock';
import { loginUserMock } from '../__mocks__/login-user.mock';


describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn().mockResolvedValue(returnLoginMock),
                        findAduthByUserId: jest.fn().mockResolvedValue({}),
                    },
                },
            ],
            controllers: [AuthController],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
        expect(authService).toBeDefined();
    });

    it('should return userLogin', async () => {
        const userLogin = await authController.login(loginUserMock);

        expect(userLogin).toEqual(returnLoginMock);
    });

});
