import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";

library.add(fas);

function App() {
  const [breakLen, setBreakLen] = useState(5);
  const [sessionLen, setSessionLen] = useState(25);
  const [displayedVal, setDisplayedVal] = useState(sessionLen * 60);
  const [start, setStart] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("Session");

  const effectRan = useRef(false);
  const setCountdownInterval = useRef();

  useEffect(() => {
    setDisplayedVal(sessionLen * 60);
  }, [sessionLen]);

  useEffect(() => {
    if (effectRan.current) {
      if (start) {
        setCountdownInterval.current = setInterval(() => {
          setDisplayedVal((oldState) => {
            if (oldState > 0) {
              return oldState - 1;
            } else if (!onBreak) {
              setOnBreak(!onBreak);
              setDisplayTitle("Break");
              return breakLen * 60;
            } else {
              setOnBreak(!onBreak);
              setDisplayTitle("Session");
              return sessionLen * 60;
            }
          });
        }, 1000);
      } else {
        clearInterval(setCountdownInterval.current);
      }
    }
    return () => {
      effectRan.current = true;
      clearInterval(setCountdownInterval.current);
    };
  }, [start, onBreak, displayTitle]);

  useEffect(() => {
    if (displayedVal === 0) {
      document.getElementById("beep").play();
    } else if (displayedVal < 60) {
      document.querySelector(".timer").style.color = "rgb(165, 13, 13)";
    } else {
      document.querySelector(".timer").style.color = "white";
    }
  }, [displayedVal]);

  const breakArrows = (e) => {
    const btnId = e.currentTarget.id;
    if (!start) {
      setBreakLen((oldState) => {
        if (btnId === "break-decrement") {
          if (Number(oldState) === 1) {
            return oldState;
          } else return Number(oldState) - 1;
        }

        if (btnId === "break-increment") {
          if (Number(oldState) === 60) {
            return oldState;
          } else return Number(oldState) + 1;
        }
      });
    }
  };

  const sessionArrows = (e) => {
    const btnId = e.currentTarget.id;
    if (!start) {
      setSessionLen((oldState) => {
        if (btnId === "session-decrement") {
          if (Number(oldState) === 1) {
            return oldState;
          } else return Number(oldState) - 1;
        }

        if (btnId === "session-increment") {
          if (Number(oldState) === 60) {
            return oldState;
          } else return Number(oldState) + 1;
        }
      });
    }
  };

  const startOrStop = () => {
    setStart((oldState) => {
      return !oldState;
    });
  };

  const reset = () => {
    setBreakLen(5);
    setSessionLen(25);
    setDisplayedVal(25 * 60);
    setDisplayTitle("Session");
    clearInterval(setCountdownInterval.current);
  };

  return (
    <div id="container">
      <div className="App">
        <div>
          <div className="main-title">25 + 5 Clock</div>
          <div className="length-control">
            <div id="break-label">Break Length</div>
            <button
              className="btn-level"
              id="break-decrement"
              value="-"
              onClick={(e) => breakArrows(e)}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-down"
                className="fa fa-arrow-down fa-2x"
              />
            </button>
            <div className="btn-level" id="break-length">
              {breakLen}
            </div>
            <button
              className="btn-level"
              id="break-increment"
              value="+"
              onClick={(e) => breakArrows(e)}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-up"
                className="fa fa-arrow-up fa-2x"
              />
            </button>
          </div>

          <div className="length-control">
            <div id="session-label">Session Length</div>
            <button
              className="btn-level"
              id="session-decrement"
              value="-"
              onClick={(e) => sessionArrows(e)}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-down"
                className="fa fa-arrow-down fa-2x"
              />
            </button>
            <div className="btn-level" id="session-length">
              {sessionLen}
            </div>
            <button
              className="btn-level"
              id="session-increment"
              value="+"
              onClick={(e) => sessionArrows(e)}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-up"
                className="fa fa-arrow-up fa-2x"
              />
            </button>
          </div>

          <div className="timer" style={{ color: "white" }}>
            <div className="timer-wrapper">
              <div id="timer-label">{displayTitle}</div>
              <div id="time-left">
                {Math.floor(displayedVal / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(displayedVal % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="timer-control">
            <button id="start_stop" onClick={startOrStop}>
              <FontAwesomeIcon
                icon="fa-solid fa-play"
                className="fa fa-play fa-2x"
              />
              <FontAwesomeIcon
                icon="fa-solid fa-pause"
                className="fa fa-pause fa-2x"
              />
            </button>
            <button id="reset" onClick={reset}>
              <FontAwesomeIcon
                icon="fa-solid fa-arrows-rotate"
                className="fa fa-refresh fa-2x"
              />
            </button>
          </div>

          <audio
            id="beep"
            preload="auto"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </div>
    </div>
  );
}

export default App;
