import { CacheService } from '@/cache/cache.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cityMock } from '../__mocks__/city.mock';
import { CityService } from '../city.service';
import { CityEntity } from '../entities/city.entity';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn().mockResolvedValue(cityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
    expect(cacheService).toBeDefined();
  });

  it('should return findOne City', async () => {
    const city = await service.findCityById(cityMock.id);

    expect(city).toEqual(cityMock);
  });

  it('should return error findOne not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findCityById(cityMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return Cities in getAllCitiesByStateId', async () => {
    const spy = jest.spyOn(cityRepository, 'find');
    const city = await service.getAllCitiesByStateId(cityMock.id);

    expect(city).toEqual([cityMock]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should return Cities from repository when cache is empty', async () => {
    jest.spyOn(cityRepository, 'find').mockResolvedValue([cityMock]);

    jest
      .spyOn(cacheService, 'getCache')
      .mockImplementation(async (_key, callback) => callback());

    const cities = await service.getAllCitiesByStateId(cityMock.id);

    expect(cities).toEqual([cityMock]);

    expect(cityRepository.find).toHaveBeenCalledWith({
      where: {
        stateId: cityMock.id,
      },
    });
  });
});
