import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';
import { cityMock } from '../__mocks__/city.mock';
import { stateMock } from '@/state/__mocks__/state.mock';




describe('CityController', () => {
    let cityController: CityController;
    let cityService: CityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CityService,
                    useValue: {
                        getAllCitiesByStateId: jest.fn().mockResolvedValue([cityMock]),
                    },
                },
            ],
            controllers: [CityController],
        }).compile();

        cityController = module.get<CityController>(CityController);
        cityService = module.get<CityService>(CityService);
    });

    it('should be defined', () => {
        expect(cityController).toBeDefined();
        expect(cityService).toBeDefined();
    });

    it('should return cityEntity in getAllCitiesByStateId', async () => {
        const city = await cityController.getAllCitiesByStateId(stateMock.id);

        expect(city).toEqual([cityMock]);
    })

});
