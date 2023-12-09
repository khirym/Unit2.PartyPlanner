const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();


async function getEvents() {
  // TODO
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}


function renderEvents() {
  // TODO
    if (!state.events.length) {
      eventList.innerHTML = "<li>No events.</li>";
      return;
    }

    const eventCards = state.events.map((event) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p>${event.date}</p>
        <p>${event.location}</p>
        <button class="delete-button" data-id="${event.id}">Delete</button>
      `;
      return li;
    });

    eventList.replaceChildren(...eventCards);

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", deleteEvent);
    });
  
  }


  async function addEvent(newEvent) {
    newEvent.preventDefault();
    // TODO
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEvent.target.name.value,
          description: newEvent.target.description.value,
          date: newEvent.target.date.value,
          location: newEvent.target.location.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new event");
      }

      render();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEvent(event) {
    const eventId = event.target.dataset.id;
  
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
  
      state.events = state.events.filter((e) => e.id !== eventId);
  
      renderEvents();
    } catch (error) {
      console.error(error);
    }
  }