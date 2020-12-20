//This is a random number generator
export function rand(min, max) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.round(randomNum);
}

//Class Notes
export class Note {
    constructor(pitch, duration) {
        this.pitch = pitch;
        this.duration = duration;
    }
}

//This class represents a clap or kick
class KickAndClap {
    constructor(type, duration) {
        this.type = type;
        this.duration = duration;
    }
}

//Key pitches and note probability
const keys = {"Rest": 0, "C3": 130.8128, "C#3": 138.5913, "D3": 146.8324, "D#3": 155.5635, "E3": 164.8138, "F3": 174.6141, 
"F#3": 184.9972, "G3": 195.9977, "G#3": 207.6523, "A3": 220, "A#3": 233.0819, "B3": 246.9417, "C4": 261.6256, "C#4": 277.1826, "D4": 293.6648, "D#4": 311.1270, 
"E4": 329.6276, "F4": 349.2282, "F#4": 369.9944, "G4": 391.9954, "G#4": 415.3047, "A4": 440, "A#4": 466.1638, "B4": 493.8833, "C5": 523.2511, "C#5": 554.3653, 
"D5": 587.3295, "D#5": 622.2540, "E5": 659.2551, "F5": 698.4565, "F#5": 739.9888, "G5": 783.9909, "G#5": 830.6094, "A5": 880, "A#5": 932.3275, "B5": 987.7666, 
"C6": 1046.502, "C#6": 1108.731, "D6": 1174.659, "D#6": 1244.508, "E6": 1318.510, "F6": 1396.913, "F#6": 1479.978, "G6": 1567.982, "G#6": 1661.219, "A6": 1760, 
"A#6": 1864.655, "B6": 1975.533};
const pitches = Object.keys(keys);
const notes = ["1", "1", "1", "2", "2", "2", "4", "4", "8", "8", "16"];

//Song, will store num_measures measures
export var song = [];

//Percussion line
export var percussion = [];

//Store root key
var root = "n/a";

//Store total time of song
export var totalTime = 0;

//Helper function to create random measures for song
function randomizeMeasure(scale, time_signature, tempo, beats) {
    //Keep track of time
    var time = 0;

    //Store measure in here
    var measure = [];

    //Keep track of place in scale
    var index = rand(0, scale.length - 1);

    //Keep looping until time reaches that of the time signature
    while (time < time_signature) {

        //If it is nearing the end of the measure, put in rests
        if (time_signature - time <= 1 / beats) {
            while (time != time_signature) {
                var rest_type = notes[rand(0, notes.length - 1)];

                //If rest_type exceeds that of the remaining time, continue
                if (1 / rest_type > time_signature - time) {
                    continue;
                }
                else {
                    var real_time = 60 / tempo * beats / rest_type; 
                    measure.push(new Note("Rest", real_time));
                    time += 1 / rest_type;
                }
            }
        }

        //Populate measure with notes
        else {
            var note_type = notes[rand(0, notes.length - 1)];

            //Only take a small step from the previous note
            var step = rand(-2, 2);
            while (index + step < 0 || index + step >= scale.length) {
                step = rand(-2, 2);
            }
            index += step;            
            var p = scale[index];

            //If note_type exceeds that of the remaining time, continue
            if (1 / note_type > time_signature - time) {
                continue;
            }
            else {

                //Harmonzie with chord?
                var harmonize_or_not = rand(0, 5);

                //if not going to harmonize, push in regular note
                if (harmonize_or_not == 0) {
                    var real_time = 60 / tempo * beats / note_type;
                    measure.push(new Note(p, real_time));
                    time += 1 / note_type;
                }

                //If harmonizing, push in minor seventh chord
                else {
                    var i = pitches.indexOf(p);
                    var real_time = 60 / tempo * beats / note_type;
                    measure.push(new Note([p, pitches[i + 3], pitches[i + 7], pitches[i + 10]], real_time));
                    time += 1 / note_type;
                }
            }
        }
    }
    return measure;
}

//Helper function to create percussion line
function createPercussionLine(tempo, num_beats, num_measures) {
    //Calculate total time of song
    totalTime = 60 / tempo * num_beats * num_measures;

    var t = 60 / tempo;
    var time = 0;
    var i = 1;
    while (time < totalTime) {
        //At third mark, push in a clap
        if (i % 3 == 0) {
            percussion.push(new KickAndClap("Clap", t / 2));
            time += t / 2;
            i++;
        }

        //At first and second mark, push in a kick
        else {
            percussion.push(new KickAndClap("Kick", t / 2));
            time += t / 2;
            i++;
        }
    }
}

//Generates the music
export function generateMusic() {
    //Clear song and percussion
    song = []
    percussion = []
    
    //num_beats and beats make up the time signature
    var num_beats = rand(2, 12);
    var beats = notes[rand(0, notes.length - 1)];
    var time_signature = num_beats / beats;

    //BPM
    var tempo = rand(30, 100);

    //Number of bars before song loops
    var num_measures = rand(2, 8);

    //Randomly select root key
    var index = rand(1, pitches.length - 24);
    root = pitches[index];

    //Scale of keys used in song; Dorian scale
    var scale = [root, pitches[index + 2], pitches[index + 3], pitches[index + 5], pitches[index + 7], pitches[index + 9], pitches[index + 10], pitches[index + 12]];

    //Create random measures for song
    for (var i = 1; i <= num_measures; i++) {
        song.push(randomizeMeasure(scale, time_signature, tempo, beats));
    }

    //Create percussion line
    createPercussionLine(tempo, num_beats, num_measures);
}