import React, { useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import onGameAction from "./actions/onGameAction";
import Timer from 'easytimer.js';
const timer = new Timer();
let gridPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const grid = gridPositions.map(n => {
  const row = Math.floor(n / 4);
  const col = n % 4;
  return [80 * col, 80 * row];
});

function Button ({ handleClick, action, disabled }) {
  return (
    <button className={action} onClick={handleClick} disabled={disabled}>{action}</button>
  )
}


function Game(props) {

  useEffect(() => {
    timer.start({
      callback: function (timer) {
        document.getElementById("timer").innerHTML = "Time: "+ timer.getTimeValues().toString(['hours', 'minutes', 'seconds']);
      }
    })
  });

  const { currPositions, disabled } = props;
  const moveTile = (tile) => {
    if (!props.disabled)
      props.onGameAction("MOVE", tile);
  }
  const shufflePuzzle = () => {
    props.onGameAction("SHUFFLE")
  }
  const solvePuzzle = () => {
    let { allMoves } = props;
    console.log(allMoves)
    props.onGameAction("SOLVE", null, allMoves)
  }
  const resetPuzzle = () => {
    props.onGameAction("RESET")
  }



  return (
    <div>
      <div id="main" className="container">
        <div className="info">
          <div id="timer">

          </div>
        </div>
        <div className="game">
          {currPositions.map((i, key) => {
            console.log(key)
            let cellClass = key ? "cell" : 'empty cell';
            let [x, y] = grid[currPositions.indexOf(key)];
            let color = "#f94a7a"
            if (Math.floor((key-1)/4)==y/80 && (key-1)%4==x/80)
              color = "#2ac06d";
            return <div key={key}
              className={cellClass}
              onClick={() => moveTile(key)}
              style={{ transform: `translate(${x}px,${y}px)`, color: color }}>{key}</div>
          })}
        </div>
      </div >
      <div id="main" className="container">
        <div className="controls">
          <Button action={"shuffle"} handleClick={shufflePuzzle} disabled={disabled} />
          <Button action={"solve"} handleClick={solvePuzzle} disabled={disabled} />
          <Button action={"reset"} handleClick={resetPuzzle} disabled={disabled} />
        </div>
      </div>
    </div>)
}


const mapStateToProps = state => ({
  currPositions: state.game.currPositions,
  allMoves: state.game.allMoves,
  disabled: state.game.disabled
});

const actions = { onGameAction };

export default connect(
  mapStateToProps,
  actions
)(Game);

