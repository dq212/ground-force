const app = document.querySelector("#app");
const navigation = document.querySelector(".bottom-nav");
const restorePhaseA = {
  id: "restore-phase-a",
  title: "Restore Phase A",
  subtitle: "Foundation movement and mobility",
  estimatedDuration: "35 min",
  objective: "Restore comfortable hip, glute, and pulling strength patterns.",
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
const placeholderWorkout = (id, title, subtitle, objective) => ({
  id,
  title,
  subtitle,
  estimatedDuration: "35 min",
  objective,
  exercises: restorePhaseA.exercises,
});
const restoreMonth1 = {
  id: "restore-month-1",
  title: "Restore Month 1",
  weeks: [
    {
      name: "Week 1",
      workouts: [
        restorePhaseA,
        placeholderWorkout("restore-week-1-b", "Restore Phase B", "Glute activation and control", "Build consistent lower-body control with easy, repeatable movements."),
        placeholderWorkout("restore-week-1-c", "Restore Phase C", "Pulling strength and balance", "Practice steady pulling and single-leg balance."),
      ],
    },
    {
      name: "Week 2",
      workouts: [
        placeholderWorkout("restore-week-2-a", "Week 2 Workout A", "Placeholder session", "Continue restoring movement quality."),
        placeholderWorkout("restore-week-2-b", "Week 2 Workout B", "Placeholder session", "Continue building controlled strength."),
        placeholderWorkout("restore-week-2-c", "Week 2 Workout C", "Placeholder session", "Continue practicing balanced movement."),
      ],
    },
    {
      name: "Week 3",
      workouts: [
        placeholderWorkout("restore-week-3-a", "Week 3 Workout A", "Placeholder session", "Continue restoring movement quality."),
        placeholderWorkout("restore-week-3-b", "Week 3 Workout B", "Placeholder session", "Continue building controlled strength."),
        placeholderWorkout("restore-week-3-c", "Week 3 Workout C", "Placeholder session", "Continue practicing balanced movement."),
      ],
    },
    {
      name: "Week 4",
      workouts: [
        placeholderWorkout("restore-week-4-a", "Week 4 Workout A", "Placeholder session", "Consolidate comfortable movement patterns."),
        placeholderWorkout("restore-week-4-b", "Week 4 Workout B", "Placeholder session", "Consolidate controlled strength."),
        placeholderWorkout("restore-week-4-c", "Week 4 Workout C", "Placeholder session", "Finish the month with confident movement."),
      ],
    },
  ],
};
const todayWorkout = restoreMonth1.weeks[0].workouts[0];
let currentExercise = 0;
let activeWorkout = null;
const historyKey = "ground-force-workout-history";

function getWorkouts() {
  return restoreMonth1.weeks.flatMap((week, index) => week.workouts.map((workout) => ({
    workout,
    week: index + 1,
  })));
}

function getWorkoutDetails(workoutId) {
  return getWorkouts().find(({ workout }) => workout.id === workoutId);
}

function getHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    return history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  } catch {
    return [];
  }
}

function recordCompletion(workout) {
  const history = getHistory();
  const details = getWorkoutDetails(workout.id);
  history.push({
    programId: restoreMonth1.id,
    week: details.week,
    workoutId: workout.id,
    completedAt: new Date().toISOString(),
  });
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function formatDate(completedAt) {
  return new Date(completedAt).toLocaleDateString();
}

function formatTime(completedAt) {
  return new Date(completedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getTodayCompletion() {
  return getHistory().find((completion) => {
    const completedDate = new Date(completion.completedAt);
    return completion.workoutId === todayWorkout.id && completedDate.toDateString() === new Date().toDateString();
  });
}

function renderProgramProgress() {
  const completedWorkoutIds = new Set(getHistory()
    .filter((completion) => completion.programId === restoreMonth1.id)
    .map((completion) => completion.workoutId));
  const workouts = getWorkouts();

  return `
    <section class="program-progress">
      <h3>${restoreMonth1.title}</h3>
      <h4>Completed</h4>
      ${restoreMonth1.weeks.map((week, index) => `
        <div class="program-week">
          <h4>${week.name}</h4>
          ${week.workouts.map((workout) => `<p>${completedWorkoutIds.has(workout.id) ? "✓" : "○"} ${workout.title}</p>`).join("")}
        </div>`).join("")}
      <p class="progress-total">${workouts.filter(({ workout }) => completedWorkoutIds.has(workout.id)).length} of ${workouts.length} workouts completed</p>
    </section>`;
}

function renderToday() {
  const completion = getTodayCompletion();
  return `
    <section class="screen-card">
      <h2>${todayWorkout.title}</h2>
      <p>${todayWorkout.subtitle}</p>
      <h3>Today's Session</h3>
      <p>Duration: ${todayWorkout.estimatedDuration}</p>
      <p>${todayWorkout.objective}</p>
      ${completion ? `<p class="completion-status">✓ Completed Today</p><p>Completed at ${formatTime(completion.completedAt)}</p>` : ""}
      <h3>Exercises</h3>
      <ul>${todayWorkout.exercises.map((exercise) => `<li>${exercise.name}</li>`).join("")}</ul>
      <button class="primary-button" type="button" data-action="start">Start Workout</button>
      ${renderProgramProgress()}
    </section>`;
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) return "<section class=\"screen-card\"><h2>History</h2><p>No completed workouts yet.</p></section>";

  return `
    <section class="screen-card">
      <h2>History</h2>
      <div class="history-list">
        ${history.map((completion) => {
          const details = getWorkoutDetails(completion.workoutId);
          return details ? `<button class="history-item" type="button" data-action="view-history" data-completed-at="${completion.completedAt}"><strong>${details.workout.title}</strong><span>${restoreMonth1.title} · Week ${completion.week}</span><span>${formatDate(completion.completedAt)} · ${formatTime(completion.completedAt)}</span></button>` : "";
        }).join("")}
      </div>
    </section>`;
}

function showHistorySummary(completedAt) {
  const completion = getHistory().find((item) => item.completedAt === completedAt);
  const details = completion && getWorkoutDetails(completion.workoutId);
  if (!details) return showScreen("history");
  const { workout } = details;

  app.innerHTML = `
    <section class="screen-card history-summary">
      <h2>${workout.title}</h2>
      <p>${workout.subtitle}</p>
      <p>${workout.objective}</p>
      <p>${formatDate(completion.completedAt)} · ${formatTime(completion.completedAt)}</p>
      ${workout.exercises.map((exercise) => `
        <article class="history-exercise">
          <h3>${exercise.name}</h3>
          <p>${exercise.reps || exercise.duration}</p>
          <p>${exercise.description}</p>
          ${exercise.cue ? `<p><strong>Coaching Cue:</strong> ${exercise.cue}</p>` : ""}
          ${exercise.tip ? `<p><strong>Tip:</strong> ${exercise.tip}</p>` : ""}
        </article>`).join("")}
      <button class="primary-button" type="button" data-action="history">Back to History</button>
    </section>`;
}

const screens = {
  library: "<h2>Library</h2><p>Coming Soon</p>",
  settings: "<h2>Settings</h2><p>Coming Soon</p>",
};

function showScreen(screen) {
  app.innerHTML = screen === "today" ? renderToday() : screen === "history" ? renderHistory() : screens[screen];
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
  const target = event.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "start") {
    startWorkout(todayWorkout);
  }

  if (target.dataset.action === "previous" && currentExercise > 0) {
    currentExercise -= 1;
    showWorkoutPlayer(activeWorkout);
  }

  if (target.dataset.action === "next") {
    currentExercise += 1;
    showWorkoutPlayer(activeWorkout);
  }

  if (target.dataset.action === "finish") {
    recordCompletion(activeWorkout);
    showCompletion();
  }

  if (target.dataset.action === "back") showScreen("today");

  if (target.dataset.action === "history") showScreen("history");

  if (target.dataset.action === "view-history") {
    showHistorySummary(target.dataset.completedAt);
  }
});

showScreen("today");
