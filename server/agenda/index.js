import { v4 as uuidv4 } from 'uuid';
import Agenda from "agenda";
import config from "../config/environment";
import { scheduleReoccurringJob } from "./utilities";
import * as toggleSoundJob from './toggle-sound-job';
import tts from "../services/text-to-speech";

const moment = require("moment");
require("moment-timezone");

const agenda = new Agenda({
  db: {
    address: config.mongo.uri,
  },
});

agenda.on("ready", () => {
  console.log('AGENDA INITIALIZED IOT TRAFFIC SOUND');
  console.log(config.audio);

  const initJobName = "Initialize Sound Modality";

  agenda.defaultConcurrency(50);

  agenda.define(initJobName, async function(job, done) {
    const userId = process.env.UUID || uuidv4();

    if (config.audio.enabled) {
      await scheduleReoccurringJob(toggleSoundJob.jobName, "2 seconds", "America/New_York", userId);
    }

    done();
  });

  agenda.define(toggleSoundJob.jobName, toggleSoundJob.jobHandler);

  agenda.now(initJobName);

  agenda.on("start", (job) => {
    // log necessary info
  });

  agenda.on("success", (job) => {
    // log necessary info
  });

  agenda.on("fail", (err, job) => {
    // log necessary info
  });
});

function graceful() {
  agenda.stop(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", graceful);
process.on("SIGINT" , graceful);

export {agenda};
