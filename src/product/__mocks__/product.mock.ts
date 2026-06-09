import { categoryMock } from "@/category/__mocks__/categoty.mock";
import { ProductEntify } from "../entities/product.entity";

export const productMock: ProductEntify = {
    categoryId: categoryMock.id,
    createdAt: new Date(),
    id: 7435,
    image: 'http://image.com',
    name: 'name product mock',
    price: 34.3,
    updatedAt: new Date(),
}