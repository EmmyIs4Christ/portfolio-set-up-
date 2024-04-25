////INTERFACE LOGIC
const btns = document.querySelectorAll(".btn");
const editUserName = document.getElementById("edit");
const cancelBtn = document.getElementById("usernameCancel");
const modal = document.querySelector("#modal");
const inputBtns = document.querySelectorAll(".userBtn");

const userNameForm = document.querySelector("#enterNameForm");
const selectLevel = document.querySelector(".selectLevel");
const startGameBtn = document.querySelector("#start");
const sideBar = document.querySelector(".sideBar");

let cellsHorizontal, cellsVertical;

let heighestScore = 0;

/////////////////////////////////SETTING BACKGRIUND FOR GAME
startGameBtn.addEventListener("click", () => {
  document.querySelector(".onePage").classList.add("hidden");
  sideBar.classList.remove("hidden");
  
  callMazeGame();
});

/////MUSIC ONCLICK AND SHOWING MODAL
btns.forEach((b) => {
  b.addEventListener("click", () => {
    let audio = new Audio("./Mouse-Click-03-m-FesliyanStudios.com.mp3");
    audio.play();

    if (b.dataset.index) {
      // console.log(b.dataset.index);
      modal.classList.remove("hideModal");
      document
        .querySelector(`.window--${b.dataset.index}`)
        .classList.remove("hideModal");
    }
  });
});

/////CLOSING MODAL WITH FORM BTNS AND CLICKING ON THE OVERLAY
inputBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    modal.classList.add("hideModal");
    document
      .querySelectorAll(`.window`)
      .forEach((win) => win.classList.add("hideModal"));
  })
);

modal.addEventListener("click", () => {
  modal.classList.add("hideModal");
  document
    .querySelectorAll(`.window`)
    .forEach((win) => win.classList.add("hideModal"));
});

// document.querySelector(".mmodal").addEventListener("click", (event)=> {
//     event.target.closest(".mmodal").style.display = "none";
// });

/////ADDING SOUND TO CANCEL BTNS
cancelBtn.addEventListener("click", () => {
  let audio = new Audio("./Mouse-Click-03-m-FesliyanStudios.com.mp3");
  audio.play();
});
// document.closet("#modal").style.display = "none";

/////CAPTURING PLAYERS NAME
let playerName = document.getElementById("userName").value.toUpperCase();
userNameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = document.getElementById("userName").value.toUpperCase();
  document.getElementById("name").textContent = playerName;

  //////////UPDATING PLAYER INFORMATION
  document.querySelector("#mazePlayer").textContent = playerName;
});

////CAPTURING GAME LEVEL
selectLevel.addEventListener("change", () => {
  const gameLevel = +selectLevel.value;
  cellsHorizontal = gameLevel;
  cellsVertical = gameLevel;
});

if (selectLevel.value === "") {
  cellsHorizontal = 5;
  cellsVertical = 5;
}

let gameTimer, gameScore, countDownFn;

const callMazeGame = () => {

  //////BACKGROUND MUSIC
  let backgroundSound = new Audio("stranger-things-124008.mp3");
  let winSound = new Audio("mixkit-conference-audience-clapping-strongly-476.wav");
  let loseSound = new Audio("mixkit-circus-lose-2030.wav")
  backgroundSound.play();

  //////  COUNT DOWN LOGIC
  gameTimer = 20;
  document.querySelector("#mazeTimer").style.color = "rgb(24, 200, 4);";

  countDownFn = setInterval(() => {
    gameTimer -= 0.05;
    // console.log(gameTimer);
    document.querySelector("#mazeTimer").textContent = gameTimer.toFixed(2);
    document.querySelector("#mazeHighestScore").textContent =
      Math.floor(gameTimer);

    if (gameTimer <= 0) {
      clearInterval(countDownFn);
      loseSound.play();

      world.bodies.forEach((wall) => {
        if (wall.label === "Walls") {
          Body.setStatic(wall, false);
          engine.world.gravity.y = 2;
        }
      });

      document.querySelector(".loose").classList.remove("hidden");
      gameTimer = 20;
    }

    if (gameTimer <= 1) {
      backgroundSound.pause();
    };

    if (gameTimer <= 3) {
      document.querySelector("#mazeTimer").style.color = "red";
    } else {
      document.querySelector("#mazeTimer").style.color = "rgb(24, 200, 4)";
    }

    gameScore = Math.floor(+gameTimer) + 1;
  }, 125);

  /////MAZE GAME LOGIC
  const { Engine, Render, Runner, Bodies, World, Body, Events } = Matter;
  const engine = Engine.create();

  engine.world.gravity.y = 0;

  const { world } = engine;

  let width, height;

  if(window.innerWidth > 600) {
     width = window.innerWidth * 0.8;
     height = window.innerHeight;
  } else {
    width = window.innerWidth;
    height = window.innerHeight * 0.8;
    sideBar.style.top = `${height}px`;
  }

  
  const unitLengthX = width / cellsHorizontal;
  const unitLengthY = height / cellsVertical;
  const startingRow = Math.floor(Math.random() * cellsHorizontal);
  const startingColumn = Math.floor(Math.random() * cellsVertical);

  const upDirection = document.querySelector(".up");
  const rightDirection = document.querySelector(".gameright");
  const downDirection = document.querySelector(".down");
  const leftDirection = document.querySelector(".gameleft");
  // const shuffle = (arr) => {
  //   let idx = arr.length - 1;
  //   for (i = idx; i >= 0; i--) {
  //     const count = Math.floor(Math.random() * arr.length);
  //     const temporal = arr[count];
  //     arr[count] = arr[i];
  //     arr[i] = temporal;
  //   }
  //   return arr;
  // };

  const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
      const index = Math.floor(Math.random() * counter);

      counter--;

      const temp = arr[counter];
      arr[counter] = arr[index];
      arr[index] = temp;
    }

    return arr;
  };

  // console.log(startingRow, startingColumn);


  let render = Render.create({
    element: document.body,
    engine,
    options: {
      width,
      height,
      wireframes: false,
    },
  });

  Render.run(render);
  const runner = Runner.create();
  Runner.run(Runner.create(), engine);

  // console.log(Render, render);

  ////CREATE AND PUSH WALLS
  const walls = [
    Bodies.rectangle(width / 2, 0, width, 5, {
      isStatic: true,
      render: { fillStyle: "blue" },
    }),
    Bodies.rectangle(width, height / 2, 5, height, {
      isStatic: true,
      render: { fillStyle: "blue" },
    }),
    Bodies.rectangle(width / 2, height, width, 5, {
      isStatic: true,
      render: { fillStyle: "blue" },
    }),
    Bodies.rectangle(0, height / 2, 5, height, {
      isStatic: true,
      render: { fillStyle: "blue" },
    }),
  ];

  World.add(world, walls);

  ////GRID  HORIZONTAL AND VERTICAL
  const grid = Array(cellsVertical)
    .fill(null)
    .map((arr) => Array(cellsHorizontal).fill(false));

  const vertical = Array(cellsVertical)
    .fill(null)
    .map((arr) => Array(cellsHorizontal - 1).fill(false));
  const horizontal = Array(cellsVertical - 1)
    .fill(null)
    .map((arr) => Array(cellsHorizontal).fill(false));
  //   console.log(vertical, horizontal)

  ///STARTING RANDOM POSITION
  const stepThroughCells = (row, column) => {
    // If i have visted the cell at [row, column], then return
    if (grid[row][column]) {
      return;
    }
    // Mark this cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, "up"],
      [row, column + 1, "right"],
      [row + 1, column, "down"],
      [row, column - 1, "left"],
    ]);

    // For each neighbor....
    for (let neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;

      // See if that neighbor is out of bounds
      if (
        nextRow < 0 ||
        nextRow >= cellsVertical ||
        nextColumn < 0 ||
        nextColumn >= cellsHorizontal
      ) {
        continue;
      }

      // If we have visited that neighbor, continue to next neighbor
      if (grid[nextRow][nextColumn]) {
        continue;
      }

      // Remove a wall from either horizontals or verticals
      if (direction === "right") {
        vertical[row][column] = true;
      } else if (direction === "left") {
        vertical[row][column - 1] = true;
      } else if (direction === "up") {
        horizontal[row - 1][column] = true;
      } else if (direction === "down") {
        horizontal[row][column] = true;
      }
      // Visit that next cell
      stepThroughCells(nextRow, nextColumn);
    }
  };

  stepThroughCells(startingRow, startingColumn);
  // stepThroughCells(1, 1);

  ////DRAW GAMING WALLS
  horizontal.forEach((row, rowIndex) => {
    row.forEach(function (open, columnIndex) {
      if (open) {
        return;
      }
      const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX / 2,
        rowIndex * unitLengthY + unitLengthY,
        unitLengthX,
        5,
        { isStatic: true, label: "Walls", render: { fillStyle: "gold" } }
      );
      World.add(world, wall);
    });
  });

  vertical.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
      if (open) {
        return;
      }
      const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX,
        rowIndex * unitLengthY + unitLengthY / 2,
        5,
        unitLengthY,
        { isStatic: true, label: "Walls", render: { fillStyle: "gold" } }
      );
      World.add(world, wall);
    });
  });

  ////GOAL
  const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 3,
    unitLengthX * 0.8,
    unitLengthY * 0.6,
    {
      isStatic: true,
      label: "gameGoal",
      render: { fillStyle: "rgb(5, 255, 50)" },
    }
  );

  World.add(world, goal);

  /////BALL
  const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
  const ball = Bodies.circle(unitLengthX / 3, unitLengthY / 2, ballRadius, {
    // isStatic: true,
    label: "gameBall",
    render: { fillStyle: "rgb(255, 5, 238)" },
  });

  const { x, y } = ball.velocity;

  World.add(world, ball);


  /////EVENT LISTENER FOR MOVING BALL

  upDirection.addEventListener("click", () => Body.setVelocity(ball, { x, y: y - 5 }));

  rightDirection.addEventListener("click", () => Body.setVelocity(ball, { x: x + 5, y }));

  downDirection.addEventListener("click", () => Body.setVelocity(ball, { x, y: y + 5 }));

  leftDirection.addEventListener("click", () => Body.setVelocity(ball, { x: x - 5, y }));

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      Body.setVelocity(ball, { x, y: y - 5 });
    } else if (event.target === "ArrowRight") {
      Body.setVelocity(ball, { x: x + 5, y });
    } else if (event.key === "ArrowDown") {
      Body.setVelocity(ball, { x, y: y + 5 });
    } else if (event.key === "ArrowLeft") {
      Body.setVelocity(ball, { x: x - 5, y });
    }
    // alert("up");
  });

  // document.querySelector("#pad").addEventListener("mouseup", (event) => {
  //   if (!event.target.classList.contains("padBtn")) {
  //     return;
  //   } else if (event.target.classList.contains("up")) {
  //     clearInterval(repeatUp);
  //   } else if (event.target.classList.contains("gameright")) {
  //     clearInterval(repeatRight);
  //   } else if (event.target.classList.contains("down")) {
  //     clearInterval(repeatDown);
  //   } else if (event.target.classList.contains("gameleft")) {
  //     clearInterval(repeatLeft);
  //   }
  //   // alert("up");
  // });
  // console.log(Body, ball);

  //////////////////////EVENT LISTENER FOR COLLISION
  const label = ["gameBall", "gameGoal"];
  const winMsg = document.querySelector(".winLoose");

  Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((element) => {
      if (
        label.includes(element.bodyA.label) &&
        label.includes(element.bodyB.label)
      ) {
        world.bodies.forEach((wall) => {
          if (wall.label === "Walls") {
            Body.setStatic(wall, false);
            engine.world.gravity.y = 2;

            winMsg.classList.remove("hidden");
            clearInterval(countDownFn);
            document.querySelector("#mazeTimer").style.color =
              "rgb(24, 200, 4)";
            document.querySelector("#showScore").textContent = gameScore;
          }
        });

        if (gameScore > heighestScore) {
          heighestScore = gameScore;
          document.querySelector("#hScoreTotal").textContent = heighestScore;
          document.querySelector("#hPlayerName").textContent = playerName;
        };

        ////STOPING SOUND
      backgroundSound.pause();
      winSound.play();

      }
    });

    // console.log(event.pairs);
    // console.log(event);
  });
  // const prevMsg = winMsg.innerHTML;
  // winMsg.innerHTML = "You Wn! " + prevMsg;

  ///////////////////////REINITIALISING THE GAME

  const playAgain = document.querySelectorAll(".playAgainBtn");

  playAgain.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      winMsg.classList.add("hidden");
      document.querySelector(".onePage").classList.remove("hidden");
      sideBar.classList.add("hidden");
      document.querySelector(".loose").classList.add("hidden");
      document.querySelector(".pauseOverlay").classList.add("hidden");
      // winMsg.classList.add("hideModal");

      engine.world.bodies.forEach((body) => {
        World.clear(world);
        Engine.clear(engine);
        Render.stop(render);
        Runner.stop(runner);
        render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};
        // Matter.Composit.clear(engine.world)
        // Matter.Composite.remove(engine.world, body)
      });
    });
  });

  //////PAUSE GAME LOGIC
  document.querySelector(".pausePlay").addEventListener("click", () => {
    clearInterval(countDownFn);


    backgroundSound.pause();
    document.querySelector(".pauseOverlay").classList.remove("hidden");
  });

  document.querySelector(".menue").addEventListener("click", () => {
    document.querySelector(".pauseOverlay").classList.add("hidden");
    document.querySelector(".onePage").classList.remove("hidden");
    sideBar.classList.add("hidden");
    engine.world.bodies.forEach((body) => {
      World.clear(world);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    });
  });

  document.querySelector(".continueGame").addEventListener("click", () => {
    document.querySelector(".pauseOverlay").classList.add("hidden");
    backgroundSound.play();

    countDownFn = setInterval(() => {
      gameTimer -= 0.05;
      // console.log(gameTimer);
      document.querySelector("#mazeTimer").textContent = gameTimer.toFixed(2);
      document.querySelector("#mazeHighestScore").textContent =
        Math.floor(gameTimer);

      if (gameTimer <= 0) {
        clearInterval(countDownFn);
        loseSound.play();

        world.bodies.forEach((wall) => {
          if (wall.label === "Walls") {
            Body.setStatic(wall, false);
            engine.world.gravity.y = 2;
          }
        });

        document.querySelector(".loose").classList.remove("hidden");
        gameTimer = 20;

      };

      if (gameTimer <= 1) {
        backgroundSound.pause();
      };

      if (gameTimer <= 3) {
        document.querySelector("#mazeTimer").style.color = "red";
      } else {
        document.querySelector("#mazeTimer").style.color = "rgb(24, 200, 4)";
      }

      gameScore = Math.floor(+gameTimer) + 1;
    }, 125);
  });
};

// upDirection.addEventListener("click", event => {
//     alert("up");
// });

// rightDirection.addEventListener("click", event => {
//     alert("right");
// });

// downDirection.addEventListener("click", event => {
//     alert("down");
// });

// leftDirection.addEventListener("click", event => {
//     alert("left");
// });
