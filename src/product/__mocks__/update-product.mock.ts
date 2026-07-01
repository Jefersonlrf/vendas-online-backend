import { categoryMock } from '@/category/__mocks__/categoty.mock';
import { updatePorductDTO } from '../dtos/update-product.dto';

export const updateProductMock: updatePorductDTO = {
  categoryId: categoryMock.id,
  image: 'dalldasldkacskdlcsakdlk',
  name: 'name mock dasdsadproduct',
  price: 25.0,
};
