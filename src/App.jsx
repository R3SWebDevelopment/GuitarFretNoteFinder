import React, {useState, useEffect} from "react";
import "./styles/App.css";
import * as Tone from 'tone';

const App = () => {
    const notes = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
    const stringTuning = ["E", "B", "G", "D", "A", "E"]; // Standard tuning
    const levels = {1: 12, 2: 8, 3: 4}; // Levels and their corresponding time limits

    const [randomNote, setRandomNote] = useState("");
    const [randomString, setRandomString] = useState(0); // String index (0-5)
    const [correctFret, setCorrectFret] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [isPausedDisabled, setIsPausedDisabled] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [isNoteDisplayed, setIsNoteDisplayed] = useState(false);
    const [level, setLevel] = useState(1); // Default level is 1
    const [timeLeft, setTimeLeft] = useState(levels[level]);
    const [stringNotes, setStringNotes] = useState([]);

    useEffect(() => {
        if (!isPaused) {
            if (timeLeft === 0) {
                handleTimeout();
            } else {
                const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [timeLeft, isPaused]);

    const generateRandomNoteAndString = () => {
        const note = notes[Math.floor(Math.random() * notes.length)];
        const stringIndex = Math.floor(Math.random() * 6);
        const baseNote = stringTuning[stringIndex];
        const fret = (notes.indexOf(note) - notes.indexOf(baseNote) + 12) % 12;

        setRandomNote(note);
        setRandomString(stringIndex);
        setCorrectFret(fret);
        setFeedback("");
        setTimeLeft(levels[level]);
        buildStringNotes(baseNote);
    };

    const buildStringNotes = (baseNote) => {
        let stringNotes = [];
        let index = notes.indexOf(baseNote);
        for(let i = 0; i < 12; i++){
            stringNotes.push(notes[index]);
            if(index === 11){
                index = 0;
            }else{
                index += 1;
            }
        }
        setStringNotes(stringNotes)
    };

    const handleFretClick = (fret) => {
        if (isPaused) return;
        setIsPaused(true);
        setIsPausedDisabled(true);
        setIsNoteDisplayed(true);

        if (fret === correctFret) {
            setFeedback("Correct!");
            playNote();
        } else {
            setFeedback("Wrong!");
            playSound("wrong");
        }

        setTimeout(() => {
            setIsNoteDisplayed(false);
            setIsPausedDisabled(false);
            setIsPaused(false);
            generateRandomNoteAndString();
        }, 2000); // Wait 2 seconds before generating a new challenge
    };

    const playNote = () => {
        // TODO: Implement sound
        //const synth = new Tone.Synth().toDestination();
        //synth.triggerAttackRelease(randomNote, "8n");
    };

    const playSound = (type) => {
        const synth = new Tone.Synth().toDestination();
        if (type === "wrong") {
            synth.triggerAttackRelease("C2", "8n"); // Low note for incorrect answer
        }
    };

    const handleTimeout = () => {
        setIsPausedDisabled(true);
        setFeedback("Wrong!");
        setIsPaused(true);
        playSound("wrong");
        setTimeout(() => {setIsPausedDisabled(false);setIsPaused(false);generateRandomNoteAndString();}, 2000); // Wait 2 seconds before generating a new challenge
    };

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            generateRandomNoteAndString();
        } else {
            setIsPaused(true);
        }
        setIsPausedDisabled(false);
    };

    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        setTimeLeft(levels[newLevel]);
        if (!isPaused) {
            generateRandomNoteAndString();
        }
    };

    return (
        <div className="app-container">
            {/* Top Section */}
            <div className="top-section">

                <div className="label note-label"><span>Note</span>{randomNote || "--"}</div>
                <div
                    className={`label feedback-label ${feedback === "Correct!" ? "correct" : "wrong"}`}
                >
                    {feedback}
                </div>
                <div className="label string-label"><span>String</span> {randomString + 1 || "--"}</div>
            </div>

            {/* Timer */}
            <div className="timer">
                Time Left: <strong>{timeLeft}s</strong>
            </div>

            {/* Middle Section (Fretboard) */}
            <div className="fretboard">
                <div className="container">
                    {Array.from({length: 12}, (_, i) => (
                        <button key={i} disabled={isPaused} className="fret-button" onClick={() => handleFretClick(i)}>
                            {isNoteDisplayed ? stringNotes[i] : i}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                <div className="level-buttons">
                    <button
                        className="level-button"
                        disabled={!isPaused}
                        onClick={() => handleLevelChange(1)}
                        style={{backgroundColor: level === 1 ? "#777" : "#555"}}
                    >
                        Easy
                    </button>
                    <button
                        className="level-button"
                        disabled={!isPaused}
                        onClick={() => handleLevelChange(2)}
                        style={{backgroundColor: level === 2 ? "#777" : "#555"}}
                    >
                        Medium
                    </button>
                    <button
                        className="level-button"
                        disabled={!isPaused}
                        onClick={() => handleLevelChange(3)}
                        style={{backgroundColor: level === 3 ? "#777" : "#555"}}
                    >
                        Hard
                    </button>
                </div>
                <button className="pause-button" onClick={togglePause} disabled={isPausedDisabled}>
                    {isPaused ? "Resume" : "Pause"}
                </button>
            </div>
        </div>
    );
};

export default App;