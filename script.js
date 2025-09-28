// ---- CONFIG ----
const ATTENDANCE_GOAL = 50;

// ---- DOM ELEMENTS ----
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountEl = document.getElementById("attendeeCount");
const greetingEl = document.getElementById("greeting");
const progressBar = document.getElementById("progressBar");
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");
const attendeeListEl = document.getElementById("attendeeList");
const celebrationEl = document.getElementById("celebration");

// ---- STATE ----
let totalCount = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendees = [];

// ---- LOAD SAVED STATE ----
window.addEventListener("DOMContentLoaded", () => {
  const savedTotal = localStorage.getItem("totalCount");
  const savedTeams = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedTotal) totalCount = parseInt(savedTotal);
  if (savedTeams) teamCounts = JSON.parse(savedTeams);
  if (savedAttendees) attendees = JSON.parse(savedAttendees);

  updateUI();
});

// ---- FORM HANDLER ----
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Update state
  totalCount++;
  teamCounts[team]++;
  attendees.push({ name, team });

  // Save to localStorage
  saveState();

  // Update UI
  showGreeting(name, team);
  updateUI();

  // Reset form
  form.reset();
});

// ---- FUNCTIONS ----
function showGreeting(name, team) {
  const teamNames = {
    water: "Team Water Wise 🌊",
    zero: "Team Net Zero 🌿",
    power: "Team Renewables ⚡",
  };

  greetingEl.textContent = `Welcome, ${name}! Thanks for supporting ${teamNames[team]}.`;
  greetingEl.classList.add("success-message");
  greetingEl.style.display = "block";
}

function updateUI() {
  // Total + progress
  attendeeCountEl.textContent = totalCount;
  const percent = Math.min((totalCount / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = `${percent}%`;

  // Team counts
  waterCountEl.textContent = teamCounts.water;
  zeroCountEl.textContent = teamCounts.zero;
  powerCountEl.textContent = teamCounts.power;

  // Attendee list
  attendeeListEl.innerHTML = attendees
    .map(
      (a) =>
        `<li><strong>${a.name}</strong> — ${
          a.team === "water"
            ? "🌊 Water Wise"
            : a.team === "zero"
            ? "🌿 Net Zero"
            : "⚡ Renewables"
        }</li>`
    )
    .join("");

  // Celebration check
  if (totalCount >= ATTENDANCE_GOAL) {
    triggerCelebration();
  }
}

function triggerCelebration() {
  // Show message
  celebrationEl.textContent = `🎉 Goal Reached! ${getWinningTeam()} leads the way!`;
  celebrationEl.style.display = "block";
}

function getWinningTeam() {
  const entries = Object.entries(teamCounts);
  const [topTeam] = entries.sort((a, b) => b[1] - a[1])[0];

  const teamNames = {
    water: "Team Water Wise 🌊",
    zero: "Team Net Zero 🌿",
    power: "Team Renewables ⚡",
  };

  return teamNames[topTeam];
}

function saveState() {
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset everything?")) {
    localStorage.clear();
    location.reload();
  }
});

