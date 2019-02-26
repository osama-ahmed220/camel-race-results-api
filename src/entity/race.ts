import { Entity, ObjectID, ObjectIdColumn, BaseEntity, Column } from "typeorm";
import { Participant } from "./participant";
import { Meta } from "./Meta";
import { PEvent } from "./event";
import { convertStringToObjectID } from "./shared";

@Entity()
export class Race extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  position: number;

  @Column()
  totalCode: number;

  @Column()
  totalPoints: number;

  @Column("simple-array")
  metaIDs: string[];

  async metas(metaIDs: string[] | null = null): Promise<Meta[]> {
    metaIDs = metaIDs || this.metaIDs;
    const metaIDsObjects = convertStringToObjectID(metaIDs);
    return await Meta.findByIds(metaIDsObjects);
  }

  @Column("simple-array")
  pEventIDs: string[];

  async pEvents(pEventIDs: string[] | null = null): Promise<PEvent[]> {
    pEventIDs = pEventIDs || this.pEventIDs;
    const pEventIDsObjects = convertStringToObjectID(pEventIDs);
    return await PEvent.findByIds(pEventIDsObjects);
  }

  @Column()
  participantID: string;

  async participant(
    participantID: string | null = null
  ): Promise<Participant | null> {
    participantID = participantID || this.participantID;
    const participantIDObjects = convertStringToObjectID(participantID);
    const participant = await Participant.findOne(participantIDObjects);
    if (participant) {
      return participant;
    }
    return null;
  }
}
