import { Entity, ObjectID, ObjectIdColumn, BaseEntity, Column } from "typeorm";

@Entity()
export class PEvent extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  totalNumber: number;

  @Column()
  eDate: string;

  @Column()
  rounds: number;

  @Column()
  position: number;

  @Column()
  age: string;

  @Column()
  timing: string;

  @Column()
  point: number;

  @Column()
  video: string;
}
