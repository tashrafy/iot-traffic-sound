import axios from 'axios';
import config from "../config/environment";
import { getTrackingData } from "./utilities";
const ENDPOINT = `http://${config.domain}:${config.port}`;
var opts;
const player = require('play-sound')(opts = {});

const moment = require("moment");
require("moment-timezone");

const jobName = "Toggle Sound Modality";

async function jobHandler(job, done) {
  const { trackingTraffic, regularTraffic } = await getTrackingData(job.attrs.data);

  if (trackingTraffic) {
    console.log("trackingTraffic", trackingTraffic);

    player.play('tracking-traffic-english.mp3', done);
  } else if (regularTraffic) {
    console.log("regularTraffic", regularTraffic);

    player.play('warning-traffic-english.mp3', done);
  }

  done();
}

export {jobName, jobHandler};
