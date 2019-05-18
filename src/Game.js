import React from 'react';
import './App.css';
import { connect } from "react-redux";
import onGameAction from "./actions/onGameAction";
var _ = require('lodash');

const grid = _.range(0, 16).map(n => {
  const row = Math.floor(n / 4);
  const col = n % 4;
  return [80 * col, 80 * row];
});

const Button = ({ handleClick, action, disabled }) => {
  return (
    <button className={action} onClick={handleClick} disabled={disabled}>{action}</button>
  )
}


class Game extends React.Component {

  moveTile = (tile) => {
    if (!this.props.disabled)
      this.props.onGameAction("MOVE", tile);
  }
  shufflePuzzle = () => {
    this.props.onGameAction("SHUFFLE")
  }
  solvePuzzle = () => {
    let { allMoves } = this.props;
    console.log(allMoves)
    this.props.onGameAction("SOLVE", null, allMoves)
  }
  resetPuzzle = () => {
    this.props.onGameAction("RESET")
  }

  render() {
    const { currPositions, disabled } = this.props;
    return (
      <div>
        <div id="main" className="container">
          <div className="game">
            {currPositions.map((i, key) => {
              let cellClass = key ? "cell" : 'empty cell';
              let [x, y] = grid[currPositions.indexOf(key)];
              return <div key={key}
                className={cellClass}
                onClick={() => this.moveTile(key)}
                style={{ transform: `translate(${x}px,${y}px)` }}>{key}</div>
            })}
          </div>
        </div >
        <div id="main" className="container">
          <div className="controls">
            <Button action={"shuffle"} handleClick={this.shufflePuzzle} disabled={disabled} />
            <Button action={"solve"} handleClick={this.solvePuzzle} disabled={disabled} />
            <Button action={"reset"} handleClick={this.resetPuzzle} disabled={disabled} />
            <button disabled={disabled}>TEST</button>
          </div>
        </div>
      </div>)
  }
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

