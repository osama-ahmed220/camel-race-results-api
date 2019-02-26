import express from "express";
import { Participant } from "../entity/participant";
import { Race } from "../entity/race";
import { Program } from "../entity/program";
import { Meta } from "../entity/Meta";
import { PEvent } from "../entity/event";
const ProgramRoute = express.Router();

const genResponse = (message: any, bool: boolean = false) => ({
  message,
  bool
});

ProgramRoute.get("/", async (_, res) => {
  try {
    const programs = await Program.find();
    const response = [];
    for (let i = 0; i < programs.length; i++) {
      const data = { ...programs[i], races: await programs[i].races() };
      delete data.raceIDs;
      response.push(data);
    }
    return res.json(genResponse(response, true));
  } catch (e) {
    return res.json(genResponse(e.message));
  }
});

ProgramRoute.get("/:programeID", async (req, res) => {
  try {
    if (!req.params.programeID) {
      return res.json(genResponse("Program ID is required"));
    }
    const prog = await Program.findOne(req.params.programeID);
    if (!prog) {
      return res.json(genResponse("Program not found"));
    }
    const response = { ...prog, races: await prog.races() };
    delete response.raceIDs;
    return res.json(genResponse(response, true));
  } catch (e) {
    return res.json(genResponse(e.message));
  }
});
ProgramRoute.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.note) {
      // error
      return res.json(genResponse("title and note is required."));
    }
    if (!data.races || data.races.length <= 0) {
      // error
      return res.json(genResponse("races is required."));
    }
    const racesIDs: string[] = [];
    for (let i = 0; i < data.races.length; i++) {
      // check if participant exists or not
      const r = data.races[i];
      if (!r.participant || !r.position || !r.totalCode || !r.totalPoints) {
        return res.json(
          genResponse(
            "participant, position, totalCode and totalPoints is required."
          )
        );
      }
      if (!r.meta || r.meta.length <= 0 || (!r.event || r.event.length <= 0)) {
        return res.json(genResponse("races meta and races event is required."));
      }
      let participant = await Participant.findOne({
        where: { name: r.participant }
      });
      if (!participant) {
        // check here
        participant = new Participant();
        participant.name = r.participant;
        await participant.save();
      }

      // Meta
      const newMetaIds: string[] = [];
      for (let x = 0; x < r.meta.length; x++) {
        const m = r.meta[x];
        if (!m.age || !m.cat1 || !m.cat2 || !m.cat3 || !m.cat4 || !m.cat5) {
          return res.json(genResponse("meta age, meta all cats are required."));
        }
        newMetaIds.push((await Meta.create(m).save()).id.toString());
      }

      // Event
      const newEventIds: string[] = [];
      for (let x = 0; x < r.event.length; x++) {
        const e = r.event[x];
        if (
          !e.name ||
          !e.totalNumber ||
          !e.eDate ||
          !e.rounds ||
          !e.position ||
          !e.age ||
          !e.timing ||
          !e.point ||
          !e.video
        ) {
          return res.json(
            genResponse(
              "event name, event totalNumber, event date, event rounds, event position, event age, event timing, event point and event video URL is required."
            )
          );
        }
        newEventIds.push((await PEvent.create(e).save()).id.toString());
      }

      const race = new Race();
      race.position = r.position;
      race.totalCode = r.totalCode;
      race.totalPoints = r.totalPoints;
      race.participantID = participant.id.toString();
      race.metaIDs = newMetaIds;
      race.pEventIDs = newEventIds;
      await race.save();
      racesIDs.push(race.id.toString());
    }
    let program = await Program.findOne({ where: { title: data.title } });
    if (!program) {
      program = new Program();
      program.title = data.title;
      program.note = data.note;
      program.raceIDs = [];
    }
    program.raceIDs = [...program.raceIDs, ...racesIDs];
    await program.save();
    return res.json(genResponse("Success", true));
  } catch (e) {
    if (
      e.message ===
      "'$set' is empty. You must specify a field like so: {$set: {<field>: ...}}"
    ) {
      return res.json(genResponse("Success", true));
    }
    return res.json(genResponse(e.message));
  }
});

export default ProgramRoute;
