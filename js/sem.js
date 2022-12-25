import { clickedElement } from "./general.js";
import { readLocalStorage } from "./localstorage.js";
import { loadMenu } from "./nav.js";
import { updateAggStats, updateSemesterStats } from "./stats.js";
import { addRow, fillSemesterTable, getSemesterData, orderByProp } from "./table.js";

// Gets the ID of the semester
function getSemesterId(target) {
	const sem = clickedElement(target, "sem");

	return sem.getAttribute("id");
}

// When the site loads load the semesters from local storage
function loadSemesters(parent) {
	const semesters = readLocalStorage();

	// Adding the default semester
	if (!semesters) {
		addSemester(sems);
		return;
	}

	semesters.forEach((sem, i) => {
		addSemester(parent, sem.length);
		fillSemesterTable(`sem${i + 1}`, sem);
		updateSemesterStats(`sem${i + 1}`, sem);
		updateAggStats();
	});
}

// Gets the id of the last semester
function getLatestSemesterId() {
	const semesters = document.querySelectorAll(".sem");

	if (!semesters.length) return 0;

	const id = semesters[semesters.length - 1].getAttribute("id");

	return parseInt(id.slice(3));
}

// Adds a new a semester
function addSemester(parent, rows = 5) {
	const semTemplate = document.querySelector("#sem");
	const clon = semTemplate.content.cloneNode(true);

	// Set the id of the semester
	const id = getLatestSemesterId() + 1;
	const sem = clon.querySelector(".sem");
	sem.setAttribute("id", `sem${id}`);

	// Set the title of the semester
	const titleNum = clon.querySelector(".sem__title__num");
	titleNum.innerText = id.toString();

	// Delete semester
	const closeButton = clon.querySelector(".sem__remove");
	closeButton.addEventListener("click", (e) => {
		deleteSemester(e.target);
		loadMenu();
	});

	// Set the order feature
	const props = ["subject", "credit", "grade"];
	const headerButtons = clon.querySelectorAll(".table__row--header .table__col");
	headerButtons.forEach((button, i) => {
		button.addEventListener("click", (e) => orderByProp(e, props[i]));
	});

	// Adding the rows (default: 5)
	const semTable = clon.querySelector(".table__body");
	for (let i = 0; i < rows; i++) {
		addRow(semTable);
	}

	// Event listener to add row button
	const addRowButton = clon.querySelector(".table__newRow");
	addRowButton.addEventListener("click", () => addRow(semTable));

	// Event listener to export button
	const exportButton = clon.querySelector(".sem__export");
	exportButton.addEventListener("click", (e) => exportSemesterData(e.target));

	parent.appendChild(clon);
}

// Deletes the clicked semester
function deleteSemester(target) {
	const sem = clickedElement(target, "sem");

	if (confirm("Biztosan törlöd a félévet?")) sem.remove();
}

// Makes a csv file from the data of the semester
function exportSemesterData(target) {
	const id = getSemesterId(target);
	const data = getSemesterData(id);

	const header = "Tárgynév;Kredit;Osztályzat\n";
	let body = "";
	data.forEach((subject) => (body += `${subject.subject};${subject.credit};${subject.grade}\n`));

	const csv = header + body;
	console.log(csv);
}

export { getSemesterId, loadSemesters, addSemester, deleteSemester };
