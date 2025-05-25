import { IsNumber, IsArray, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsArray()
  productos: { nombre: string; cantidad: number; precio: number }[];

  @IsNumber()
  total: number;

  @IsString()
  estado: string;
}
