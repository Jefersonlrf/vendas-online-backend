import { ProductEntify } from "../entities/product.entity";

export class ReturnProduct{
    id:number;
    name:string;
    price:number;
    image:string;

    constructor(productEntity: ProductEntify){
        this.id=productEntity.id;
        this.name=productEntity.name;
        this.price=productEntity.price;
        this.image=productEntity.image;
    }
}