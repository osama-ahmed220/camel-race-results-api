import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BaseEntity,
  Index
} from "typeorm";
import { Race } from "./race";
import { convertStringToObjectID } from "./shared";

@Entity()
export class Program extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  title: string;

  @Column()
  note: string;

  @Column("simple-array")
  raceIDs: string[];

  async races(raceIDs: string[] | null = null): Promise<any> {
    raceIDs = raceIDs || this.raceIDs;
    const raceIDsObjects = convertStringToObjectID(raceIDs);
    const races = await Race.findByIds(raceIDsObjects);
    const response: any = [];
    for (let i = 0; i < races.length; i++) {
      const newObj = {
        ...races[i],
        metas: await races[i].metas(),
        pEvents: await races[i].pEvents(),
        participant: await races[i].participant()
      };
      delete newObj.metaIDs;
      delete newObj.pEventIDs;
      delete newObj.participantID;
      response.push(newObj);
    }
    return response;
  }
}
