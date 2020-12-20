import * as Tone from 'tone';
import {animate, init} from './art.js';
import {rand, generateMusic, song, Note, percussion, totalTime} from "./generator.js";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var loop = 0;
var kickNum = 0;
var clapNum = 0;

var enter = false;

var claps = {1: new Tone.Buffer("audio/clap1.wav"), 2: new Tone.Buffer("audio/clap2.wav"), 3: new Tone.Buffer("audio/clap3.wav"), 4: new Tone.Buffer("audio/clap4.wav"), 
5: new Tone.Buffer("audio/clap5.wav"), 6: new Tone.Buffer("audio/clap6.wav"), 7: new Tone.Buffer("audio/clap7.wav")};

var kicks = {1: new Tone.Buffer("audio/kick1.wav"), 2: new Tone.Buffer("audio/kick2.wav"), 3: new Tone.Buffer("audio/kick3.wav"), 4: new Tone.Buffer("audio/kick4.wav"),
5: new Tone.Buffer("audio/kick5.wav"), 6: new Tone.Buffer("audio/kick6.wav"), 7: new Tone.Buffer("audio/kick7.wav"), 8: new Tone.Buffer("audio/kick8.wav"), 
9: new Tone.Buffer("audio/kick1.wav"), 10: new Tone.Buffer("audio/kick10.wav"), 11: new Tone.Buffer("audio/kick11.wav"), 12: new Tone.Buffer("audio/kick12.wav"),
13: new Tone.Buffer("audio/kick13.wav"), 14: new Tone.Buffer("audio/kick14.wav"), 15: new Tone.Buffer("audio/kick15.wav")};

const compressor = new Tone.Compressor(-30, 3).toDestination();
const bqF1 = new Tone.BiquadFilter(200, "highpass").connect(compressor);
const bqF2 = new Tone.BiquadFilter(6500, "lowpass").connect(bqF1);
const synth = new Tone.PolySynth(Tone.Synth).connect(bqF2);

document.getElementById("instructions").innerHTML = "Press ENTER to begin playing music!"

function playMusic() {
    generateMusic();
    loop = rand(5, 10);
    kickNum = rand(1, 15);
    clapNum = rand(1, 7);
    var kick = new Tone.Player(kicks[kickNum]).toDestination();
    var clap = new Tone.Player(claps[clapNum]).toDestination();
    var timeKeeper = Tone.now();
    var delta = 0;
    var start = 0;
    for (var l = 1; l <= loop; l++) {
        for (var i = 0; i < song.length; i++) {
            for (var j = 0; j < song[i].length; j++) {
                if (song[i][j].pitch == "Rest") {
                    synth.triggerAttackRelease(null, song[i][j].duration, timeKeeper + delta);
                }
                else {
                    synth.triggerAttackRelease(song[i][j].pitch, song[i][j].duration, timeKeeper + delta);
                }
                delta += song[i][j].duration;
            }
        }
        for (var k = 0; k < percussion.length; k++) {
            if (percussion[k].type == "Kick") {
                kick.start(timeKeeper + start);
                start += percussion[k].duration;
            }
            else {
                clap.start(timeKeeper + start);
                start += percussion[k].duration;
            }
        }
    }
}

document.addEventListener("keypress", async function(e) {
    if (e.key == "Enter" && !enter) {
        enter = true;
        document.getElementById("instructions").innerHTML = "AlgoRhythm";
        init();
        animate();
        while (true) {
            playMusic();
            await sleep(totalTime * loop * 1000);
        }
    }
});