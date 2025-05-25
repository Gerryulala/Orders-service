import { IsNumber, IsArray, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsArray()
  productos: { nombre: string; cantidad: number; precio: number }[];

  @IsNumber()
  total: number;

  @IsString()
  estado: string;
}
