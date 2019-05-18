const onGameAction = (action, index, allMoves) => dispatch => {
  switch (action) {
    case "MOVE":
      dispatch({ type: "MOVE_ONE_STEP", payload: { index: index } })
      break;
    case "SHUFFLE":
      for (var i = 0; i < 20; i++) {
        dispatch({ type: "SELECT", payload: {} })
        dispatch({ type: "MOVE_ONE_STEP", payload: {} })
      }
      break;
    case "SOLVE":
      let solveArr = allMoves.slice().reverse();
      let step = 0;
      let solutionTimer = setInterval(() => {
        dispatch({ type: "SOLVE_ONE_STEP", payload: { index: solveArr[step] } })
        step++;
        if (step >= solveArr.length - 1) {
          dispatch({ type: "WIN", payload: {} })
          clearInterval(solutionTimer)
        }
      }, 200);
      break;
    case "RESET":
      dispatch({ type: "RESET", payload: {} })
      break;
  }
};



export default onGameAction;