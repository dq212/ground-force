const app = document.querySelector("#app");
const navigation = document.querySelector(".bottom-nav");
const workout = [
  { name: "Hip CARs", setsReps: "2 x 5 each side", cue: "Move slowly through your full range." },
  { name: "Glute Bridge", setsReps: "3 x 12", cue: "Press through your heels and squeeze at the top." },
  { name: "Ring Rows", setsReps: "3 x 10", cue: "Keep your body straight as you pull." },
  { name: "Bulgarian Split Squat", setsReps: "3 x 8 each side", cue: "Lower with control and keep your chest tall." },
  { name: "Step Down", setsReps: "2 x 10 each side", cue: "Tap the floor softly, then stand tall." },
];
let currentExercise = 0;
const screens = {
  today: `
    <section class="screen-card">
      <h2>Restore Phase</h2>
      <h3>Today's Session</h3>
      <p>Duration: 35 min</p>
      <h3>Exercises</h3>
      <ul>${workout.map((exercise) => `<li>${exercise.name}</li>`).join("")}</ul>
      <button class="primary-button" type="button" data-action="start">Start Workout</button>
    </section>`,
  library: "<h2>Library</h2><p>Coming Soon</p>",
  history: "<h2>History</h2><p>Coming Soon</p>",
  settings: "<h2>Settings</h2><p>Coming Soon</p>",
};

function showScreen(screen) {
  app.innerHTML = screens[screen];
  navigation.querySelectorAll("[data-screen]").forEach((button) => {
    button.toggleAttribute("aria-current", button.dataset.screen === screen);
  });
}

function showWorkoutPlayer() {
  const exercise = workout[currentExercise];
  app.innerHTML = `
    <section class="screen-card">
      <p>Exercise ${currentExercise + 1} of ${workout.length}</p>
      <h2>${exercise.name}</h2>
      <p>${exercise.setsReps}</p>
      <p>${exercise.cue}</p>
      <button type="button" data-action="previous" ${currentExercise === 0 ? "disabled" : ""}>Previous</button>
      ${currentExercise === workout.length - 1
        ? "<button class=\"primary-button\" type=\"button\" data-action=\"finish\">Finish Workout</button>"
        : "<button type=\"button\" data-action=\"next\">Next</button>"}
    </section>`;
}

function showCompletion() {
  app.innerHTML = `
    <section class="screen-card">
      <h2>Workout Complete</h2>
      <p>Great work.</p>
      <button class="primary-button" type="button" data-action="back">Back to Today</button>
    </section>`;
}

navigation.addEventListener("click", (event) => {
  const screen = event.target.dataset.screen;
  if (screen) showScreen(screen);
});

app.addEventListener("click", (event) => {
  if (event.target.dataset.action === "start") {
    currentExercise = 0;
    showWorkoutPlayer();
  }

  if (event.target.dataset.action === "previous" && currentExercise > 0) {
    currentExercise -= 1;
    showWorkoutPlayer();
  }

  if (event.target.dataset.action === "next" && currentExercise < workout.length - 1) {
    currentExercise += 1;
    showWorkoutPlayer();
  }

  if (event.target.dataset.action === "finish") showCompletion();

  if (event.target.dataset.action === "back") showScreen("today");
});

showScreen("today");
