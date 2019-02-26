import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BaseEntity,
  Index,
  OneToMany
} from "typeorm";
import { Race } from "./race";

@Entity()
export class Participant extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  name: string;

  @OneToMany(() => Race, r => r.participant)
  races: Race[];
}
