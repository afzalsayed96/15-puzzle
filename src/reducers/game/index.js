var _ = require('lodash');
let solvedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
export const initialState = {
  currPositions: JSON.parse(localStorage.getItem("currentGamePosition")) || solvedPositions,
  allPositions: JSON.parse(localStorage.getItem("allGamePositions")) || [solvedPositions],
  win: false,
  forbidMove: -1,
  nextMove: null,
  allMoves: JSON.parse(localStorage.getItem("allMoves")) || [0],
  disabled: false
};

export default function (state = initialState, action) {
  let possibleMoves = {
    0: [1, 4],
    1: [0, 2, 5],
    2: [1, 3, 6],
    3: [2, 7],
    4: [0, 5, 8],
    5: [1, 4, 6, 9],
    6: [2, 5, 7, 10],
    7: [3, 6, 11],
    8: [4, 9, 12],
    9: [5, 8, 10, 13],
    10: [6, 9, 11, 14],
    11: [7, 10, 15],
    12: [8, 13],
    13: [9, 12, 14],
    14: [10, 13, 15],
    15: [11, 14]
  }
  switch (action.type) {
    case "SOLVE_ONE_STEP": {
      let currPositions = state.currPositions.slice()
      let tile = action.payload.tile
      let emptyIndex = currPositions.indexOf(0);
      let targetIndex = currPositions.indexOf(tile);
      if (possibleMoves[emptyIndex].indexOf(targetIndex) > -1) {
        currPositions[emptyIndex] = tile;
        currPositions[targetIndex] = 0;

        let win = () => {
          return solvedPositions === currPositions
        };
        return { ...state, currPositions: currPositions, win: win }
      }
      return state;
    }
    case "MOVE_ONE_STEP": {
      let tile = action.payload.tile || state.nextMove
      let allMoves = state.allMoves.slice()
      let currPositions = state.currPositions.slice()
      let allPositions = state.allPositions.slice()
      let emptyIndex = currPositions.indexOf(0);
      let targetIndex = currPositions.indexOf(tile);
      if (possibleMoves[emptyIndex].indexOf(targetIndex) > -1) {
        currPositions[emptyIndex] = tile;
        currPositions[targetIndex] = 0;

        let win = () => {
          return solvedPositions === currPositions
        };

        let currPositionsIndex = (JSON.stringify(allPositions).indexOf(JSON.stringify(currPositions)) - 1) / 40;
        if (currPositionsIndex < 0) {
          allPositions.push(currPositions)
          allMoves.push(tile)
        }
        else {
          console.log(JSON.stringify(allPositions), JSON.stringify(currPositions), currPositionsIndex)
          allPositions = allPositions.slice(0, currPositionsIndex + 1)
          console.log(allPositions)
          allMoves = allMoves.slice(0, currPositionsIndex + 1)
        }
        localStorage.setItem("allMoves", JSON.stringify(allMoves))
        localStorage.setItem("allGamePositions", JSON.stringify(allPositions))
        localStorage.setItem("currentGamePosition", JSON.stringify(currPositions))
        return { ...state, currPositions: currPositions, win: win, allMoves: allMoves, nextMove: null, allPositions: allPositions }
      }
      return state;
    }
    case "SELECT_RANDOM": {
      let currPositions = state.currPositions.slice()
      let emptyIndex = currPositions.indexOf(0);
      let possibleMovesArr = possibleMoves[emptyIndex]
      var forbidMoveIndex = currPositions.indexOf(state.forbidMove)
      var forbidMoveIndexLoc = possibleMovesArr.indexOf(forbidMoveIndex)
      if (forbidMoveIndexLoc > -1) {
        possibleMovesArr.splice(forbidMoveIndexLoc, 1)
      }

      var nextMoveIndex = Math.floor((Math.random() * possibleMovesArr.length));
      var nextMove = state.currPositions[possibleMovesArr[nextMoveIndex]]
      return { ...state, forbidMove: nextMove, nextMove: nextMove }

    }
    case "RESET": {
      let currPositions = solvedPositions
      let allMoves = [0]
      let allPositions = [solvedPositions]
      localStorage.removeItem("currentGamePosition")
      localStorage.removeItem("allMoves")
      localStorage.removeItem("allGamePositions")
      return {
        ...state,
        currPositions: currPositions,
        win: false,
        forbidMove: -1,
        nextMove: null,
        allMoves: allMoves,
        allPositions: allPositions,
      }
    }
    case "WIN": {
      let currPositions = solvedPositions
      let allMoves = [0]
      let allPositions = [solvedPositions]
      localStorage.removeItem("currentGamePosition")
      localStorage.removeItem("allMoves")
      localStorage.removeItem("allGamePositions")
      return {
        ...state,
        currPositions: currPositions,
        win: true,
        forbidMove: -1,
        nextMove: null,
        allMoves: allMoves,
        allPositions: allPositions
      }
    }
    case "DISABLE": {
      return {
        ...state, disabled: action.payload.disable
      }
    }
    default:
      return state;
  }
}
