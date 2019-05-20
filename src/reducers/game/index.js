let solvedPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
export const initialState = {
  currPositions: JSON.parse(localStorage.getItem("currentGamePosition")) || solvedPositions,
  allPositions: JSON.parse(localStorage.getItem("allGamePositions")) || [solvedPositions],
  win: true,
  forbidMove: -1,
  nextMove: null,
  allMoves: JSON.parse(localStorage.getItem("allMoves")) || [0],
  disabled: false,
  movesCount: parseInt(localStorage.getItem("movesCount")) || 0,
  level: parseInt(localStorage.getItem("level")) || 0,
  time: parseInt(localStorage.getItem("time")) || 0,
  history: JSON.parse(localStorage.getItem("history")) || []
};
export default function (state = initialState, action) {
  /* Helper Variables */
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
  /* State Variables */
  let currPositions = state.currPositions.slice();
  let emptyIndex = currPositions.indexOf(0);
  let allMoves = state.allMoves.slice();
  let allPositions = state.allPositions.slice();
  let history = state.history.slice();
  let movesCount = state.movesCount;
  /* Helper Functions */
  let win = () => {
    return JSON.stringify(solvedPositions) === JSON.stringify(currPositions)
  };


  let saveMoves = (tile) => {
    let currPositionsIndex = (JSON.stringify(allPositions).indexOf(JSON.stringify(currPositions)) - 1) / 40;
    if (currPositionsIndex < 0) {
      allPositions.push(currPositions)
      allMoves.push(tile)
    }
    else {
      allPositions = allPositions.slice(0, currPositionsIndex + 1)
      allMoves = allMoves.slice(0, currPositionsIndex + 1)
    }
    localStorage.setItem("allMoves", JSON.stringify(allMoves))
    localStorage.setItem("allGamePositions", JSON.stringify(allPositions))
    localStorage.setItem("currentGamePosition", JSON.stringify(currPositions))
    localStorage.setItem("movesCount", movesCount)
  }

  let saveTime = (time) => {
    localStorage.setItem("time", time)
  }

  let movePossible = (targetIndex) => {
    return (possibleMoves[emptyIndex].indexOf(targetIndex) > -1)
  }

  let swapTiles = (tile, targetIndex) => {
    currPositions[emptyIndex] = tile;
    currPositions[targetIndex] = 0;
  }

  let clearCache = () => {
    localStorage.removeItem("currentGamePosition")
    localStorage.removeItem("allMoves")
    localStorage.removeItem("allGamePositions")
    localStorage.removeItem("time")
    localStorage.removeItem("movesCount")
    localStorage.removeItem("history")
  }

  let saveHistory = (tile, targetIndex) => {
    let curr_x = Math.floor(targetIndex / 4);
    let curr_y = targetIndex % 4;
    let next_x = Math.floor(emptyIndex / 4);
    let next_y = emptyIndex % 4;
    history.push(`Moved ${tile} from ${curr_x}, ${curr_y} to ${next_x}, ${next_y}`)
    localStorage.setItem("history", JSON.stringify(history))
  }

  switch (action.type) {
    case "SOLVE_ONE_STEP": {
      let tile = action.payload.tile;
      let targetIndex = currPositions.indexOf(tile);
      if (movePossible(targetIndex)) {
        swapTiles(tile, targetIndex)
        win = win()
        return { ...state, currPositions: currPositions, win: win }
      }
      return state;
    }
    case "SHUFFLE_ONE_STEP": {
      let tile = state.nextMove;
      let targetIndex = currPositions.indexOf(tile);
      if (movePossible(targetIndex)) {
        swapTiles(tile, targetIndex)
        saveMoves(tile)
        win = win()
        return { ...state, currPositions: currPositions, win: win, allMoves: allMoves, nextMove: null, allPositions: allPositions }
      }
      return state;
    }
    case "MOVE_ONE_STEP": {
      let tile = action.payload.tile;
      let targetIndex = currPositions.indexOf(tile);
      if (movePossible(targetIndex)) {
        swapTiles(tile, targetIndex)
        movesCount += 1
        saveMoves(tile)
        saveHistory(tile, targetIndex)
        win = win()
        return { ...state, currPositions: currPositions, win: win, allMoves: allMoves, nextMove: null, allPositions: allPositions, movesCount: movesCount, history: history }
      }
      return state;
    }
    case "SELECT_RANDOM": {
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
      clearCache()
      return {
        ...state,
        currPositions: solvedPositions,
        win: false,
        forbidMove: -1,
        nextMove: null,
        allMoves: [0],
        allPositions: [solvedPositions],
        movesCount: 0,
        time: 0,
        history: []
      }
    }
    case "WIN": {
      clearCache()
      return {
        ...state,
        currPositions: solvedPositions,
        win: true,
        forbidMove: -1,
        nextMove: null,
        allMoves: [0],
        allPositions: [solvedPositions]
      }
    }
    case "DISABLE": {
      return {
        ...state, disabled: action.payload.disable
      }
    }
    case "SET_LEVEL": {
      localStorage.setItem("level", action.payload.level)
      return {
        ...state, level: action.payload.level
      }
    }
    case "SAVE_TIME": {
      let currTime = action.payload.time
      let h_index = currTime.indexOf("h")
      let m_index = currTime.indexOf("m")
      let s_index = currTime.indexOf("s")
      let hours = parseInt(currTime.slice(0, h_index + 1))
      let minutes = parseInt(currTime.slice(h_index + 2, m_index + 1))
      let seconds = parseInt(currTime.slice(m_index + 2, s_index + 1))
      let totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000
      saveTime(totalTime)
      return { ...state, time: totalTime };
    }
    default:
      return state;
  }
}
