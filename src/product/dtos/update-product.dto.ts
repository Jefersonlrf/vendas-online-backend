import { IsNumber, IsString } from 'class-validator';

export class updatePorductDTO {
  @IsNumber()
  categoryId!: number;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsString()
  image!: string;
}
