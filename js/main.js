const app = document.querySelector("#app");
const navigation = document.querySelector(".bottom-nav");
const restorePhaseA = {
  title: "Restore Phase A",
  exercises: [
  {
    id: 1,
    name: "Hip Flexor Stretch",
    duration: "60 sec per side",
    description: "Set up in a half-kneeling position and gently shift forward until you feel a stretch at the front of the trailing hip.",
    cue: "Keep a posterior pelvic tilt as you move forward.",
    tip: "Squeeze the trailing glute to avoid arching your lower back.",
    equipment: "Bodyweight",
    image: null,
  },
  {
    id: 2,
    name: "Glute Bridge",
    reps: "12",
    description: "Drive through your heels and lift until your hips are fully extended.",
    cue: "Pause for two seconds at the top and squeeze your glutes.",
    tip: "If your hamstrings cramp, tuck your pelvis slightly before lifting.",
    equipment: "Bodyweight",
    image: null,
  },
  {
    id: 3,
    name: "Bulgarian Split Squat",
    reps: "8 per side",
    description: "Lower under control with your rear foot elevated, then drive through the front heel to stand.",
    cue: "Keep your torso tall throughout the movement.",
    tip: "Use a shorter range of motion if you cannot keep the front heel grounded.",
    equipment: "Bench or box",
    image: null,
  },
  {
    id: 4,
    name: "Ring Row",
    reps: "10",
    description: "Keep your body in a straight line as you pull your chest toward the rings.",
    cue: "Pull your elbows toward your ribs.",
    tip: "Step your feet forward to make the row easier or back to make it harder.",
    equipment: "Rings",
    image: null,
  },
  {
    id: 5,
    name: "Box Step-Up",
    reps: "8 per side",
    description: "Step onto the box with control and stand fully before lowering back down.",
    cue: "Drive through the working leg rather than pushing off the floor.",
    tip: "Choose a box height that lets you keep your knee tracking over your toes.",
    equipment: "Box",
    image: null,
  },
  ],
};
const restoreMonth1 = {
  title: "Restore Month 1",
  weeks: [
    { name: "Week 1", workouts: [restorePhaseA] },
    { name: "Week 2", workouts: [restorePhaseA] },
    { name: "Week 3", workouts: [restorePhaseA] },
    { name: "Week 4", workouts: [restorePhaseA] },
  ],
};
const todayWorkout = restoreMonth1.weeks[0].workouts[0];
let currentExercise = 0;
let activeWorkout = null;
const screens = {
  today: `
    <section class="screen-card">
      <h2>${todayWorkout.title}</h2>
      <h3>Today's Session</h3>
      <p>Duration: 35 min</p>
      <h3>Exercises</h3>
      <ul>${todayWorkout.exercises.map((exercise) => `<li>${exercise.name}</li>`).join("")}</ul>
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

function startWorkout(workout) {
  activeWorkout = workout;
  currentExercise = 0;
  showWorkoutPlayer(activeWorkout);
}

function showWorkoutPlayer(workout) {
  const exercises = workout.exercises;
  const exercise = exercises[currentExercise];
  const progress = ((currentExercise + 1) / exercises.length) * 100;
  app.innerHTML = `
    <section class="workout-player">
      <p class="workout-title">${workout.title}</p>
      <div class="workout-progress" role="progressbar" aria-label="Workout progress" aria-valuemin="1" aria-valuemax="${exercises.length}" aria-valuenow="${currentExercise + 1}">
        <span style="width: ${progress}%"></span>
      </div>
      <p class="exercise-count">Exercise ${currentExercise + 1} of ${exercises.length}</p>
      <article class="exercise-card">
        <h2>${exercise.name}</h2>
        <p class="exercise-reps">${exercise.reps || exercise.duration}</p>
        <section class="exercise-section">
          <h3>Description</h3>
          <p>${exercise.description}</p>
        </section>
        ${exercise.cue ? `<section class="exercise-section"><h3>Focus</h3><p>${exercise.cue}</p></section>` : ""}
        ${exercise.tip ? `<section class="exercise-section"><h3>Tip</h3><p>${exercise.tip}</p></section>` : ""}
      </article>
      <div class="player-actions">
        <button type="button" data-action="previous" ${currentExercise === 0 ? "disabled" : ""}>Previous</button>
        <button class="primary-button" type="button" data-action="${currentExercise === exercises.length - 1 ? "finish" : "next"}">${currentExercise === exercises.length - 1 ? "Finish Workout" : "Next"}</button>
      </div>
    </section>`;
}

function showCompletion() {
  app.innerHTML = `
    <section class="screen-card">
      <h2>Workout Complete</h2>
      <p>Great work.</p>
      <button class="primary-button" type="button" data-action="back">Return Home</button>
    </section>`;
}

navigation.addEventListener("click", (event) => {
  const screen = event.target.dataset.screen;
  if (screen) showScreen(screen);
});

app.addEventListener("click", (event) => {
  if (event.target.dataset.action === "start") {
    startWorkout(todayWorkout);
  }

  if (event.target.dataset.action === "previous" && currentExercise > 0) {
    currentExercise -= 1;
    showWorkoutPlayer(activeWorkout);
  }

  if (event.target.dataset.action === "next") {
    currentExercise += 1;
    showWorkoutPlayer(activeWorkout);
  }

  if (event.target.dataset.action === "finish") showCompletion();

  if (event.target.dataset.action === "back") showScreen("today");
});

showScreen("today");
