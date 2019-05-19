const onGameAction = (action, params) => dispatch => {
  let shuffleWithLevel = (level) => {
    for (var i = 0; i < (level + 1) * 10; i++) {
      dispatch({ type: "SELECT_RANDOM", payload: {} })
      dispatch({ type: "SHUFFLE_ONE_STEP", payload: {} })
    }
  }

  switch (action) {
    case "MOVE":
      dispatch({ type: "MOVE_ONE_STEP", payload: { tile: params.tile } })
      break;
    case "SHUFFLE":
      dispatch({ type: "DISABLE", payload: { disable: true } })
      shuffleWithLevel(params.level)
      dispatch({ type: "DISABLE", payload: { disable: false } })
      break;
    case "SOLVE":
      dispatch({ type: "DISABLE", payload: { disable: true } })
      let solveArr = params.allMoves.slice().reverse();
      let step = 0;
      let solutionTimer = setInterval(() => {
        dispatch({ type: "SOLVE_ONE_STEP", payload: { tile: solveArr[step] } })
        step++;
        if (step >= solveArr.length - 1) {
          dispatch({ type: "WIN", payload: {} })
          dispatch({ type: "DISABLE", payload: { disable: false } })
          clearInterval(solutionTimer)
        }
      }, 200);
      break;
    case "RESTART":
      dispatch({ type: "RESET", payload: {} })
      shuffleWithLevel(params.level)
      break;
    case "SET_LEVEL":
      dispatch({ type: "SET_LEVEL", payload: { level: params.level } })
      break;
    case "SAVE_TIME":
      dispatch({ type: "SAVE_TIME", payload: { time: params.time } })
      break;
    default:
      break;
  }
};



export default onGameAction;