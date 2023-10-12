import { useState, useEffect } from "react";
import clockAlarm from "./clock_alarm.mp3";
import "./App.css";

function App() {
  const [currentState, setCurrentState] = useState("session");
  const [sessionActive, setSessionActive] = useState(false);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let intervalId;

    if (sessionActive && minutes >= 0 && seconds >= 0) {
      intervalId = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Reproducir el sonido cuando llegue a 0:00
            const audioElement = document.getElementById("beep");
            audioElement.play();
            if (currentState === "session") {
              // Cambia a estado de "descanso"
              setCurrentState("break");
              setMinutes(breakLength);
              setSeconds(0);
              // Puedes agregar lógica adicional aquí si es necesario
            } else {
              // Cambia a estado de "sesión"
              setCurrentState("session");
              setMinutes(sessionLength);
              setSeconds(0);
              // Puedes agregar lógica adicional aquí si es necesario
            }
            clearInterval(intervalId);
            // Aquí puedes agregar lógica adicional al llegar a 0:00
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000); // Cada segundo
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [
    sessionActive,
    minutes,
    seconds,
    breakLength,
    sessionLength,
    currentState,
  ]);

  const reduceLength = (stateName) => {
    if (stateName === "breakLength" && breakLength > 1) {
      setBreakLength((prevBreakLength) => prevBreakLength - 1);
    } else if (
      stateName === "sessionLength" &&
      sessionLength > 1 &&
      currentState === "session"
    ) {
      setSessionLength((prevSessionLength) => prevSessionLength - 1);
      setMinutes((prevMinutes) => prevMinutes - 1);
      setMinutes(sessionLength - 1);
      setSeconds(0);
    }
  };

  const incrementLength = (stateName) => {
    if (stateName === "breakLength" && breakLength < 60) {
      setBreakLength((prevBreakLength) => prevBreakLength + 1);
    } else if (
      stateName === "sessionLength" &&
      sessionLength < 60 &&
      currentState === "session"
    ) {
      setSessionLength((prevSessionLength) => prevSessionLength + 1);
      setMinutes(sessionLength + 1);
      setSeconds(0);
    }
  };

  const handleSession = () => {
    setSessionActive(!sessionActive);
  };

  const reset = () => {
    setMinutes(25);
    setSeconds(0);
    setBreakLength(5);
    setSessionLength(25);
    setSessionActive(false);
    setCurrentState("session");
    // Detén y reinicia el audio al inicio
    const audioElement = document.getElementById("beep");
    audioElement.pause();
    audioElement.currentTime = 0;
  };

  return (
    <>
      <h1 id="header">25 + 5 Clock</h1>
      <div id="configuracion-container">
        <div>
          <h3 id="break-label">Break Length</h3>
          <div id="break-buttons">
            <button
              id="break-decrement"
              disabled={sessionActive}
              onClick={() => reduceLength("breakLength")}
            >
              ⬇️
            </button>
            <h3 id="break-length">{breakLength}</h3>
            <button
              id="break-increment"
              disabled={sessionActive}
              onClick={() => incrementLength("breakLength")}
            >
              ⬆️
            </button>
          </div>
        </div>
        <div>
          <h3 id="session-label">Session Length</h3>
          <div id="session-buttons">
            <button
              id="session-decrement"
              disabled={sessionActive}
              onClick={() => reduceLength("sessionLength")}
            >
              ⬇️
            </button>
            <h3 id="session-length">{sessionLength}</h3>
            <button
              id="session-increment"
              disabled={sessionActive}
              onClick={() => incrementLength("sessionLength")}
            >
              ⬆️
            </button>
          </div>
        </div>
      </div>
      <div id="contador-container">
        <div id="contador">
          <p id="timer-label">
            {currentState === "session" ? "Session" : "Break"}
          </p>
          <h1 id="time-left">
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
          <audio
            id="beep"
            src={clockAlarm}
          />
        </div>
      </div>
      <div id="contador-controles">
        <button id="start_stop" onClick={handleSession}>
          {sessionActive ? "⏹" : "▶️"}
        </button>
        <button id="reset" onClick={reset}>
          🔄
        </button>
      </div>
    </>
  );
}

export default App;
