"use strict";

const openModal = () => {
  if (document.getElementById("name").value != "") {
    document.getElementById("clear").style.display = "none";
  } else {
    document.getElementById("clear").style.display = "flex";
  }
  document.getElementById("modal").classList.add("active");
};

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));
// The Nullish Coalescing Operator (??) returns the first argument if it’s not null/undefined. Otherwise, the second one.

const areAllFieldsValid = () => {
  return document.getElementById("form").reportValidity();
  // Check if all 'form' child elements satisfy their validation constraints.
};

// CRUD
const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

const readClient = () => getLocalStorage();

const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  // Remove from the array the client specified by the index.
  setLocalStorage(dbClient);
};

// Interaction with layout
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("name").dataset.index = "new";
};

const saveClient = () => {
  if (areAllFieldsValid()) {
    const client = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      mobile: document.getElementById("mobile").value,
      city: document.getElementById("city").value,
    };
    const index = document.getElementById("name").dataset.index;
    if (index == "new") {
      createClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(index, client);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.mobile}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Edit</button>
            <button type="button" class="button red" id="delete-${index}">Delete</button>
        </td>
    `;
  document.querySelector("#tableClient>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};

const fillFields = (client) => {
  document.getElementById("name").value = client.name;
  document.getElementById("email").value = client.email;
  document.getElementById("mobile").value = client.mobile;
  document.getElementById("city").value = client.city;
  document.getElementById("name").dataset.index = client.index;
};

const editClient = (index) => {
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");
    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(
        `Are you sure you want to delete the information about ${client.name}?`
      );
      if (response) {
        deleteClient(index);
        updateTable();
      }
    }
  }
};

updateTable();

// Events
document.getElementById("addCustomer").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("save").addEventListener("click", saveClient);

document.getElementById("clear").addEventListener("click", clearFields);

document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);
