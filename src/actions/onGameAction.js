const onGameAction = (action, tile, allMoves) => dispatch => {
  switch (action) {
    case "MOVE":
      dispatch({ type: "MOVE_ONE_STEP", payload: { tile: tile } })
      break;
    case "SHUFFLE":
      dispatch({ type: "DISABLE", payload: { disable: true } })
      for (var i = 0; i < 20; i++) {
        dispatch({ type: "SELECT_RANDOM", payload: {} })
        dispatch({ type: "MOVE_ONE_STEP", payload: {} })
      }
      dispatch({ type: "DISABLE", payload: { disable: false } })
      break;
    case "SOLVE":
      dispatch({ type: "DISABLE", payload: { disable: true } })
      let solveArr = allMoves.slice().reverse();
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
    case "RESET":
      dispatch({ type: "RESET", payload: {} })
      break;
    default:
      break;
  }
};



export default onGameAction;