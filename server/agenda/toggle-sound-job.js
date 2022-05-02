import axios from 'axios';
import { audio } from "../config/environment";
import { getTrackingData } from "./utilities";
var opts;
const player = require('play-sound')(opts = {});

const moment = require("moment");
require("moment-timezone");

const jobName = "Toggle Sound Modality";

async function jobHandler(job, done) {
  const { trackingTraffic, regularTraffic } = await getTrackingData(job.attrs.data);
  let trafficAudio;
  let volume;
  
  if (trackingTraffic) {
    console.log("trackingTraffic", trackingTraffic);
    trafficAudio = audio.sound.tracking;
    volume = (trackingTraffic.outboundBytesTotal.$numberDecimal / 10000) * 100;
  } else if (regularTraffic._id.protocol === 443) {
    console.log("secureTraffic", regularTraffic);
    trafficAudio = audio.sound.secure; 
    volume = (regularTraffic.outboundBytesTotal.$numberDecimal / 10000) * 100;
  } else if (regularTraffic) {
    console.log("regularTraffic", regularTraffic);
    trafficAudio = audio.sound.warning; 
    volume = (regularTraffic.outboundBytesTotal.$numberDecimal / 10000) * 100;
  }
  console.log('before volume', volume)
  if (volume > 100) {
    volume = 100;
  }

  if (volume < 40) {
    volume = 40;
  }

  console.log('after volume', volume)
  player.play(trafficAudio, { mplayer: ['-volume', volume ] }, done);

  done();
}

export {jobName, jobHandler};
