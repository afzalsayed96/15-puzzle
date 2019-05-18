var _ = require('lodash');
let solvedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
export const initialState = {
  currPositions: JSON.parse(localStorage.getItem("currentGamePosition")) || solvedPositions,
  allPositions: JSON.parse(localStorage.getItem("allGamePositions")) || [solvedPositions],
  win: false,
  forbidMove: "NULL",
  nextMove: null,
  allMoves: JSON.parse(localStorage.getItem("allMoves")) || [0]
};

export default function (state = initialState, action) {

  switch (action.type) {
    case "SOLVE_ONE_STEP": {
      let currPositions = state.currPositions.slice()
      console.log("In solve")
      let index = action.payload.index
      console.log(index)
      let emptyIndex = currPositions.indexOf(0);
      let targetIndex = currPositions.indexOf(index);
      const dif = Math.abs(targetIndex - emptyIndex);
      if (dif == 1 || dif == 4) {
        console.log("In solve")
        currPositions[emptyIndex] = index;
        currPositions[targetIndex] = 0;

        let win = () => {
          return solvedPositions === currPositions
        };
        return { ...state, currPositions: currPositions, win: win }
      }
      return state;
    }
      break;
    case "MOVE_ONE_STEP": {
      let index = action.payload.index || state.nextMove
      let allMoves = state.allMoves.slice()
      let currPositions = state.currPositions.slice()
      let allPositions = state.allPositions.slice()
      let emptyIndex = currPositions.indexOf(0);
      let targetIndex = currPositions.indexOf(index);
      const dif = Math.abs(targetIndex - emptyIndex);
      if (dif == 1 || dif == 4) {
        currPositions[emptyIndex] = index;
        currPositions[targetIndex] = 0;

        let win = () => {
          return solvedPositions === currPositions
        };
        let currPositionsIndex = JSON.stringify(allPositions).indexOf(JSON.stringify(currPositions));
        if (currPositionsIndex === -1) {
          allPositions.push(currPositions)
          localStorage.setItem("allGamePositions", JSON.stringify(allPositions))
          allMoves.push(index)
          localStorage.setItem("allMoves", JSON.stringify(allMoves))
        }
        else {
          allPositions = allPositions.slice(0, currPositionsIndex + 1)
          localStorage.setItem("allGamePositions", JSON.stringify(allPositions))
          allMoves = allMoves.slice(0, currPositionsIndex + 1)
          localStorage.setItem("allMoves", JSON.stringify(allMoves))
        }
        localStorage.setItem("currentGamePosition", JSON.stringify(currPositions))
        return { ...state, currPositions: currPositions, win: win, allMoves: allMoves, nextMove: null, allPositions: allPositions }
      }
      return state;
    }
      break;
    case "SELECT": {
      let emptyIndex = state.currPositions.indexOf(0);
      let possibleMoves = []
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].indexOf(emptyIndex) > -1) {
        possibleMoves.push("DOWN")
      }
      if ([0, 1, 2, 4, 8, 5, 6, 9, 10, 12, 13, 14].indexOf(emptyIndex) > -1) {
        possibleMoves.push("RIGHT")
      }
      if ([1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15].indexOf(emptyIndex) > -1) {
        possibleMoves.push("LEFT")
      }
      if ([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].indexOf(emptyIndex) > -1) {
        possibleMoves.push("UP")
      }
      var forbidMoveIndex = possibleMoves.indexOf(state.forbidMove)
      if (forbidMoveIndex > -1) {
        possibleMoves.splice(forbidMoveIndex, 1)
      }
      var nextMove = Math.floor((Math.random() * possibleMoves.length));
      if (possibleMoves[nextMove] === "DOWN") {
        return { ...state, forbidMove: "UP", nextMove: state.currPositions[emptyIndex + 4] }
      }
      if (possibleMoves[nextMove] === "UP") {
        return { ...state, forbidMove: "DOWN", nextMove: state.currPositions[emptyIndex - 4] }
      }
      if (possibleMoves[nextMove] === "LEFT") {
        return { ...state, forbidMove: "RIGHT", nextMove: state.currPositions[emptyIndex - 1] }
      }
      if (possibleMoves[nextMove] === "RIGHT") {
        return { ...state, forbidMove: "LEFT", nextMove: state.currPositions[emptyIndex + 1] }
      }
    }
      break;
    case "RESET": {
      let currPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
      let allMoves = [0]
      let allPositions = [solvedPositions]
      localStorage.removeItem("currentGamePosition")
      localStorage.removeItem("allMoves")
      localStorage.removeItem("allGamePositions")
      return {
        currPositions: currPositions,
        win: false,
        forbidMove: "NULL",
        nextMove: null,
        allMoves: allMoves,
        allPositions: allPositions
      }
    }
      break;
      case "WIN": {
        let currPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
      let allMoves = [0]
      let allPositions = [solvedPositions]
      localStorage.removeItem("currentGamePosition")
      localStorage.removeItem("allMoves")
      localStorage.removeItem("allGamePositions")
      return {
        currPositions: currPositions,
        win: true,
        forbidMove: "NULL",
        nextMove: null,
        allMoves: allMoves,
        allPositions: allPositions
      }
      }
    default:
      return state;
  }
}
