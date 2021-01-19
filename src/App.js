import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "ko-KR";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNote, setSavedNote] = useState([]);

  const handleListen = useCallback(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue...");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stoped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (e) => {
      console.log(e);
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  }, [isListening]);

  const handleSaveNote = useCallback(() => {
    setSavedNote([...savedNote, note]);
    setNote("");
  }, [note, savedNote]);

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line
  }, [isListening]);

  return (
    <div className="App">
      <h1>Voice Note</h1>
      <div className="container">
        <div className="box curent-note">
          <h2>Current Note</h2>
          {isListening ? <span>🎙</span> : <span>🔴</span>}
          <button className="save" onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button
            className="start-stop"
            onClick={() => setIsListening((prevState) => !prevState)}
          >
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box save-note">
          <h2>Note</h2>
          {savedNote.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
