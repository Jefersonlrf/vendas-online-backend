import { categoryMock } from "@/category/__mocks__/categoty.mock";
import { CreateProductDTO } from "../dtos/create-product.dto";

export const createProduct: CreateProductDTO={
    categoryId:categoryMock.id,
    image: 'lddfjsljfsljdlfsjfljs',
    name: "name mock product",
    price: 25.90,
};