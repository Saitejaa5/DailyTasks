let events = JSON.parse(localStorage.getItem("events")) || [];

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function renderEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  events.forEach((event, index) => {
    const div = document.createElement("div");
    div.className = "event";

    const remainingTime = getRemainingTime(event.datetime);
    const categoryIcon = getCategoryIcon(event.category);
    const emailReminder = event.email ? `📧 Reminder set for ${event.email}` : "";

    div.innerHTML = `
      <div class="event-header">
        <span class="event-category">${categoryIcon} ${event.title}</span>
        <div>
          <button onclick="editEvent(${index})">✏️ Edit</button>
          <button onclick="deleteEvent(${index})">🗑️ Delete</button>
        </div>
      </div>
      <p>${event.description || ""}</p>
      <div class="countdown" id="countdown-${index}"></div>
      <div>${emailReminder}</div>
    `;
    eventList.appendChild(div);
  });
}

function getRemainingTime(datetime) {
  const now = new Date().getTime();
  const eventTime = new Date(datetime).getTime();
  const diff = eventTime - now;

  if (diff <= 0) return "🎉 Event is happening now!";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return `${days} Days ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getCategoryIcon(category) {
  switch (category) {
    case "Birthday": return "🎂";
    case "Meeting": return "📊";
    case "Holiday": return "🏖️";
    default: return "📝";
  }
}

function updateCountdowns() {
  events.forEach((event, index) => {
    const countdown = document.getElementById(`countdown-${index}`);
    if (countdown) {
      countdown.textContent = getRemainingTime(event.datetime);
    }

    // Simulate reminder 1 day before
    const eventTime = new Date(event.datetime).getTime();
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (
      event.email &&
      !event.reminderSent &&
      eventTime - now <= oneDay &&
      eventTime - now > 0
    ) {
      console.log(`Reminder: '${event.title}' is happening tomorrow. Email sent to: ${event.email}`);
      alert(`📬 Reminder: ${event.title} is happening tomorrow!`);
      event.reminderSent = true;
      saveEvents();
    }
  });
}

function deleteEvent(index) {
  if (confirm("Are you sure you want to delete this event?")) {
    events.splice(index, 1);
    saveEvents();
    renderEvents();
  }
}

function editEvent(index) {
  const event = events[index];
  document.getElementById("title").value = event.title;
  document.getElementById("description").value = event.description;
  document.getElementById("datetime").value = event.datetime;
  document.getElementById("email").value = event.email || "";
  document.getElementById("category").value = event.category;

  // Remove the event temporarily until resubmitted
  events.splice(index, 1);
  saveEvents();
  renderEvents();
}

document.getElementById("eventForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const datetime = document.getElementById("datetime").value;
  const email = document.getElementById("email").value.trim();
  const category = document.getElementById("category").value;

  if (!title || !datetime || new Date(datetime) <= new Date()) {
    alert("Please enter a valid title and future date/time.");
    return;
  }

  events.push({
    title,
    description,
    datetime,
    email,
    category,
    reminderSent: false
  });

  saveEvents();
  renderEvents();
  e.target.reset();
});

setInterval(updateCountdowns, 1000);
renderEvents();
