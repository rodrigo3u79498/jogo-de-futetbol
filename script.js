
const ball = document.getElementById("ball");
const shootButton = document.getElementById("shoot");
const direction = document.getElementById("direction");
const power = document.getElementById("power");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const keeper = document.getElementById("keeper");
const trajectory = document.getElementById("trajectory");
const field = document.querySelector(".field");

let goals = 0;
let shots = 0;
let busy = false;

function updateAim() {
  const angle = Number(direction.value);

  trajectory.style.transform =
    `rotate(${angle}deg)`;

  trajectory.style.height =
    `${70 + Number(power.value)}px`;
}

direction.addEventListener("input", updateAim);
power.addEventListener("input", updateAim);

function resetBall() {
  ball.style.transition = "none";
  ball.style.left = "48%";
  ball.style.bottom = "3%";
  ball.style.transform = "scale(1)";
  ball.style.opacity = "1";

  keeper.style.transition = "none";
  keeper.style.left = "50%";
  keeper.style.transform = "translateX(-50%)";

  trajectory.style.opacity = "1";

  updateAim();
}

function shoot() {
  if (busy) return;

  busy = true;
  shots++;

  const angle = Number(direction.value);
  const strength = Number(power.value);

  const horizontal = angle / 45;
  const targetX = 50 + horizontal * 34;
  const targetY = 25 + (100 - strength) * 0.22;

  const goalkeeperDirection =
    targetX < 43 ? -1 : targetX > 57 ? 1 : 0;

  keeper.style.transition = "left .7s ease";
  keeper.style.left =
    `${50 + goalkeeperDirection * 24}%`;

  ball.style.transition =
    "left .85s ease-in, bottom .85s ease-in, transform .85s ease-in";

  ball.style.left = `${targetX}%`;
  ball.style.bottom = `${Math.max(22, targetY)}%`;

  ball.style.transform =
    `translateY(-40px) scale(.48) rotate(${angle * 5}deg)`;

  trajectory.style.opacity = "0";
  message.textContent = "A bola está a caminho do gol...";

  const savedAngle = angle;

  setTimeout(() => {
    // A chance de gol depende da direção e da força.
    const centerAccuracy = 1 - Math.abs(savedAngle) / 70;
    const goalkeeperSaved =
      Math.random() < 0.28 + centerAccuracy * 0.20;

    const scored =
      !goalkeeperSaved &&
      Math.random() < 0.65 + strength / 400;

    if (scored) {
      goals++;
      scoreDisplay.textContent = `0 : ${1 + goals}`;
      message.textContent = "GOOOOL! ⚽";
    } else if (goalkeeperSaved) {
      message.textContent = "DEFENDEU O GOLEIRO!";
    } else {
      message.textContent = "A bola foi para fora!";
    }

    setTimeout(() => {
      resetBall();
      busy = false;
    }, 1000);
  }, 850);
}

shootButton.addEventListener("click", shoot);

field.addEventListener("click", (event) => {
  if (busy || event.target.closest(".aim")) return;

  const rect = field.getBoundingClientRect();
  const clickX = (event.clientX - rect.left) / rect.width;

  direction.value = Math.round(
    Math.max(-45, Math.min(45, (clickX - 0.5) * 90))
  );

  updateAim();
});

updateAim();
