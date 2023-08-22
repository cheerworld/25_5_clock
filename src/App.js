import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";

library.add(fas);

function useInterval(callback, delay, start, displayTitle) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id;
    if (start) {
      id = setInterval(tick, delay);
    } else {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [delay, start, displayTitle]);
}

function App() {
  const [breakLen, setBreakLen] = useState(5);
  const [sessionLen, setSessionLen] = useState(25);
  const [displayedVal, setDisplayedVal] = useState(sessionLen * 60);
  const [start, setStart] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("Session");
  const [delay, setDelay] = useState(1000);

  useEffect(() => {
    setDisplayedVal(sessionLen * 60);
  }, [sessionLen]);

  useInterval(
    () => {
      setDisplayedVal((oldState) => {
        if (oldState > 0) {
          if (delay !== 1000) {
            setDelay(1000);
          }
          return oldState - 1;
        } else if (displayTitle === "Session" && oldState === 0) {
          setDisplayTitle("Break");
          document.getElementById("beep").play();
          setDelay(1050);
          return breakLen * 60;
        } else {
          setDisplayTitle("Session");
          document.getElementById("beep").play();
          setDelay(1050);
          return sessionLen * 60;
        }
      });
    },
    delay,
    start,
    displayTitle
  );

  useEffect(() => {
    if (displayedVal < 60) {
      document.querySelector(".timer").style.color = "rgb(165, 13, 13)";
    } else {
      document.querySelector(".timer").style.color = "white";
    }
  }, [displayedVal, start]);

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
    setStart(!start);
  };

  const reset = () => {
    setDisplayTitle("Session");
    setBreakLen(5);
    setSessionLen(25);
    setDisplayedVal(25 * 60);
    setStart(false);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
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
                  .padStart(2, "0") +
                  ":" +
                  (displayedVal % 60).toString().padStart(2, "0")}
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
