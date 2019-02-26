import { Entity, ObjectID, ObjectIdColumn, BaseEntity, Column } from "typeorm";

@Entity()
export class Meta extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  age: string;

  @Column()
  cat1: number;

  @Column()
  cat2: number;

  @Column()
  cat3: number;

  @Column()
  cat4: number;

  @Column()
  cat5: number;
}
