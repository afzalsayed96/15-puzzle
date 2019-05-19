import React, { useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import onGameAction from "./actions/onGameAction";
import Timer from 'react-compound-timer';

let gridPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const grid = gridPositions.map(n => {
  const row = Math.floor(n / 4);
  const col = n % 4;
  return [80 * col, 80 * row];
});

function Button({ handleClick, action, disabled }) {
  return (
    <button className={action} onClick={handleClick} disabled={disabled} >{action}</button>
  )
}
function LevelItem({ handleClick, level, style, id }) {
  return (
    <button id={id} className={level} onClick={handleClick} style={style}>{level}</button>
  )
}


function Game(props) {

  let timerStart, timerResume, timerPause, timerStop, timerReset

  const { currPositions, disabled, movesCount, level, allMoves, time, win, history } = props;
  const moveTile = (tile) => {
    if (!disabled) {
      props.onGameAction("MOVE", { tile: tile });
    }
  }
  const shufflePuzzle = () => {
    props.onGameAction("SHUFFLE", { level: level })
  }
  const solvePuzzle = () => {
    timerStop();
    props.onGameAction("SAVE_TIME", { time: document.getElementById("timer-value").innerHTML });
    props.onGameAction("SOLVE", { allMoves: allMoves })
    timerReset();
  }
  const restartPuzzle = () => {
    timerReset();
    props.onGameAction("RESTART", { level: level })
    timerStart();
  }

  const changeLevel = (e) => {
    props.onGameAction("SET_LEVEL", { level: parseInt(e.target.id) })
  }

  useEffect(() => {
    props.onGameAction("SAVE_TIME", { time: document.getElementById("timer-value").innerHTML });
  }, [movesCount])

  useEffect(() => {
    if (win) {
      timerStop();
      setTimeout(() => document.getElementById("stop").click(), 100)
    }
  }, [win])


  return (
    <div>
      <h1 className="heading">15 Puzzle Game</h1>
      <div id="main" className="container">
        <div className="info">
          <h1>Info</h1>
          <div id="timer" key={time}>
            <b>{"Time: "}</b>
            <Timer
              initialTime={time}
              lastUnit="h"
            >
              {({ start, resume, pause, stop, reset }) => {
                timerStart = start;
                timerResume = resume;
                timerPause = pause;
                timerStop = stop;
                timerReset = reset;
                return (
                  <React.Fragment>
                    <span id="timer-value">
                      <Timer.Hours />{"h "}
                      <Timer.Minutes />{"m "}
                      <Timer.Seconds />{"s"}
                    </span>
                    <button id="stop" onClick={stop} style={{ display: "none" }} />
                    <button id="start" onClick={start} style={{ display: "none" }} />
                    <button id="resume" onClick={resume} style={{ display: "none" }} />
                    <button id="reset" onClick={resume} style={{ display: "none" }} />
                  </React.Fragment>
                )
              }}

            </Timer>
          </div>
          <div id="counts">
            <b>Moves:</b> {props.movesCount}
          </div>
          <div id="win">
            {win ? <p>Solved!</p> : ""}
          </div>
        </div>
        < div className="game-container">
          <div className="game">
            {currPositions.map((i, key) => {
              let cellClass = key ? "cell" : 'empty cell';
              let [x, y] = grid[currPositions.indexOf(key)];
              return <div key={key}
                className={cellClass}
                onClick={() => moveTile(key)}
                style={{ transform: `translate(${x}px,${y}px)` }}>{key}</div>
            })}
          </div>
        </ div>
        <div className="info">
          <h1>History</h1>
          {history.map((line, key) => {
            return (
              <div key={key}>
                {line}
              </div>
            )
          })}
        </div>
      </div >
      <div className="container">
        <div className="controls">
          <Button action={"shuffle"} handleClick={shufflePuzzle} disabled={disabled} />
          <Button action={"solve"} handleClick={solvePuzzle} disabled={disabled} />
          <Button action={"restart"} handleClick={restartPuzzle} disabled={disabled} />
        </div>
      </div>
      <div className="container">
        <div className="levels">
          {["amateur", "semi-pro", "professional", "legendary"].map((level, key) => {
            return <LevelItem level={level} id={key} key={key} handleClick={changeLevel} style={{ borderColor: props.level === key ? "#333" : "transparent" }} />
          })}
        </div>
      </div>
    </div>)
}


const mapStateToProps = state => ({
  currPositions: state.game.currPositions,
  allMoves: state.game.allMoves,
  disabled: state.game.disabled,
  movesCount: state.game.movesCount,
  level: state.game.level,
  time: state.game.time,
  win: state.game.win,
  history: state.game.history
});

const actions = { onGameAction };

export default connect(
  mapStateToProps,
  actions
)(Game);

