import { CategoryEntify } from "../entities/category.entity";

export class ReturnCategory{
    id!: number;
    name!: string;

    constructor(categoryEntity:CategoryEntify){
        this.id=categoryEntity.id;
        this.name=categoryEntity.name;
    }
}