import { getAllSemesterData } from "./table.js";

// Get the saved data from local storage
function readLocalStorage() {
	const string = localStorage.getItem("semesters");

	return JSON.parse(string);
}

// Updates the local storage with the new data
function updateLocalStorage() {
	const data = getAllSemesterData();
	localStorage.setItem("semesters", JSON.stringify(data));

	const body = document.querySelector("body");
	const theme = body.classList.contains("dark");
	localStorage.setItem("theme", theme ? 1 : 0);
}

// Reads the theme from local storage
function getTheme() {
	const theme = localStorage.getItem("theme");
	return parseInt(theme);
}

export { readLocalStorage, updateLocalStorage, getTheme };
