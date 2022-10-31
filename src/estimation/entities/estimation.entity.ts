import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Estimation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quote_id: string;
}
