import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column("json")
  productos: { nombre: string; cantidad: number; precio: number }[];

  @Column()
  total: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ default: 'PENDIENTE' })
  estado: string;
}
