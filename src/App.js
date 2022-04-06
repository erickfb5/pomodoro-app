import './App.css';
import { useState } from 'react';
import { beep } from './beepSound'

function App() {

  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(beep));

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    )
  }

  const changeTime = (amount, type) => {
    if (type === 'break') {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount)
    }
    else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let onBreakVariable = onBreak;
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {

            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              setOnBreak(true);
              onBreakVariable = true;
              return breakTime;
            }
            else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              setOnBreak(false);
              onBreakVariable = false;
              return sessionTime;
            }
            return prev - 1;

          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear()
      localStorage.setItem('interval-id', interval)
    }

    if (timerOn) {
      clearInterval(localStorage.getItem('interval-id'))
    }

    setTimerOn(!timerOn)
  }

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60)
  }

  return (
    <div className="center-align  ">
      <h1 className='center'>Pomodoro App</h1>
      <div className="dual-container">
        <Length
          title={'break length'}
          changeTime={changeTime}
          type='break'
          time={breakTime}
          formatTime={formatTime} />
        <br />
        <Length
          title={'session length'}
          changeTime={changeTime}
          type={'session'}
          time={sessionTime}
          formatTime={formatTime} />
      </div>

      <h3>{onBreak ? 'BREAK' : 'SESSION'}</h3>
      <h1 className='center'>{formatTime(displayTime)}</h1>
      <button className="btn-large"
        onClick={controlTime}>
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>

      <button className="btn-large"
        onClick={resetTime}>
        <i className="material-icons">autorenew</i>

      </button>



    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {

  return (
    <div className='center-align'>
      <h3>{title}</h3>
      <div className="time-sets">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <button className="btn-small"
          onClick={() => changeTime(-60, type)}>

          <i className="material-icons">arrow_downward</i>

        </button>
        <h3>{formatTime(time)}</h3>

        <button className="btn-small"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>

      </div>
    </div>
  );
}

export default App;
