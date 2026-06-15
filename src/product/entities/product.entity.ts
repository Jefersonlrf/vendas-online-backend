import { CartProductEntity } from "@/cart-product/entities/cart-product.entity";
import { CategoryEntify } from "@/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product')
export class ProductEntify {
    @PrimaryGeneratedColumn('rowid')
    id!: number;

    @Column({ name: 'name', nullable: false })
    name!: string;

    @Column({ name: 'category_id', nullable: false })
    categoryId!: number;

    @Column({ name: 'price', nullable: false, type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ name: 'image', nullable: false })
    image!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;


    @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.product)
    cartProduct?: CartProductEntity[];

    @ManyToOne(
        () => CategoryEntify,
        (category: CategoryEntify) => category.products,
    )

    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category?: CategoryEntify;
}
