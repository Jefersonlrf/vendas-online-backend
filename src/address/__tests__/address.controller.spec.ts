import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { userEntityMock } from '@/user/__mocks__/user.mock';
import { addressMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';
import { ReturnAddressDto } from '../dtos/returnAddress.dto';


describe('AddressController', () => {
    let addressController: AddressController;
    let addressService: AddressService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AddressService,
                    useValue: {
                        createAddress: jest.fn().mockResolvedValue(addressMock),
                        findAddressByUserId: jest.fn().mockResolvedValue([addressMock]),
                    },

                },
            ],
            controllers: [AddressController],
        }).compile();

        addressController = module.get<AddressController>(AddressController);
        addressService = module.get<AddressService>(AddressService);
    });

    it('should be defined', () => {
        expect(addressController).toBeDefined();
        expect(addressService).toBeDefined();
    });

    it('should address Entity in createAddress', async () => {
        const address = await addressController.createAddress(
            createAddressMock,
            userEntityMock.id,
        );

        expect(address).toEqual(addressMock);
    });

    it('should address Entity in findAddressByUserId', async () => {
        const addresses = await addressController.findAddressByUserId(userEntityMock.id);

        expect(addresses).toEqual([
            {
                complement: addressMock.complement,
                numberAddress: addressMock.numberAddress,
                cep: addressMock.cep,
            }
        ])
    });
});
