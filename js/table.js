import { showCharts } from "./chart.js";
import { clickedElement, compare } from "./general.js";
import { getSemesterId } from "./sem.js";
import { updateAggStats, updateSemesterStats } from "./stats.js";

// Adds a new row to the table
function addRow(parent) {
	const rowTemplate = document.querySelector("#table__row");
	const clon = rowTemplate.content.cloneNode(true);

	const credit = clon.querySelector(".table__col--credit input");
	credit.addEventListener("change", (e) => changedData(e.target));

	const grade = clon.querySelector(".table__col--grade input");
	grade.addEventListener("change", (e) => changedData(e.target));

	const button = clon.querySelector(".table__col--delete button");
	button.addEventListener("click", (e) => {
		const table = clickedElement(e.target, "sem");
		deleteRow(e);
		changedData(table);
	});

	parent.appendChild(clon);
}

// Deletes the clicked row
function deleteRow(e) {
	const row = clickedElement(e.target, "table__row");

	row.remove();
}

// When a credit or a grade input changes updates the Stats block
function changedData(target) {
	const id = getSemesterId(target);

	const data = getSemesterData(id);

	if (!data.length) return;

	updateSemesterStats(id, data);
	updateAggStats();

	//showCharts();
}

// Gets the data from the DOM and checks the data
function getRowData(row) {
	const subject = row.querySelector(".table__col--subject input").value;
	const credit = row.querySelector(".table__col--credit input").valueAsNumber;
	const grade = row.querySelector(".table__col--grade input").valueAsNumber;

	return { subject, credit, grade };
}

// Gets all the data from the data based on the getRowData function
function getSemesterData(semester) {
	const table = document.querySelector(`#${semester} .table`);
	const tableRows = table.querySelectorAll(".table__row:not(.table__row--header)");

	const data = [];
	tableRows.forEach((row) => {
		const rowData = getRowData(row);

		data.push(rowData);
	});

	return data;
}

// Gets the data of all semesters
function getAllSemesterData(semCount = 0) {
	const semesters = document.querySelectorAll(".sem");

	const data = [];
	semesters.forEach((sem, i) => {
		if (!semCount || i < semCount) {
			const id = sem.getAttribute("id");
			const semesterData = getSemesterData(id);
			data.push(semesterData);
		}
	});

	return data;
}

// Checks if the semester data is correct to do the calculations
function checkSemesterData(semesterData) {
	let valid = 1;
	semesterData.forEach((subject) => {
		if (!valid) return;

		if (isNaN(subject.credit) || subject.credit < 0) {
			// console.log("Érvénytelen kredit!");
			valid = 0;
			return;
		}

		if (isNaN(subject.grade) || subject.grade < 1 || subject.grade > 5) {
			// console.log("Érvénytelen osztályzat!");
			valid = 0;
			return;
		}
	});

	return valid;
}

// Returns the selected property from the semesterData array
function getValues(semesterData, prop) {
	return semesterData.map((subject) => subject[prop]);
}

// #region Sorting the table

// Rotates the caret when the button is clicked
function rotateCaret(target) {
	const col = clickedElement(target, "table__col");
	const caret = col.querySelector(".table__col__order");
	caret.classList.toggle("table__col__order--desc");
}

// Gets the order attribute of the clicked col
function getCurrentOrder(target) {
	const col = clickedElement(target, "table__col");
	return col.getAttribute("order");
}

// Resets all the orders in the table
function resetCols(target) {
	const header = clickedElement(target, "table__row--header");
	const cols = header.querySelectorAll(".table__col");
	cols.forEach((col) => {
		col.setAttribute("order", "none");

		const caret = col.querySelector(".table__col__order");
		caret?.classList.remove("table__col__order--desc");
	});
}

// Updates the order attribute of the clicked col
function updateOrderAttribute(target, order) {
	const col = clickedElement(target, "table__col");
	return col.setAttribute("order", order);
}

// Sorting the table by the given prop
function sortBySubject(semesterData, prop, asc = 1) {
	return semesterData.sort(compare(prop, asc));
}

// Returns the value of a subject object based on the given index param
function getValueByIndex(object, index) {
	if (index === 0) return object.subject;
	if (index === 1) return object.credit;
	if (index === 2) return object.grade;
}

// Refills the table with the ordered data
function fillSemesterTable(semester, semesterData) {
	const table = document.querySelector(`#${semester} .table`);
	const inputs = table.querySelectorAll(".table__body .table__col input");

	for (let i = 0; i < semesterData.length; i++) {
		for (let j = 0; j < 3; j++) {
			const colIndex = i * 3 + j;
			const value = getValueByIndex(semesterData[i], j);
			inputs[colIndex].value = value;
		}
	}
}

// When the col is clicked it makes the sorting
function orderByProp(e, prop) {
	const order = getCurrentOrder(e.target);
	resetCols(e.target);
	if (order === "none" || order === "desc") rotateCaret(e.target);
	updateOrderAttribute(e.target, order === "none" || order === "desc" ? "asc" : "desc");

	const id = getSemesterId(e.target);
	const data = getSemesterData(id);

	if (!data.length) return;

	const ordered = sortBySubject(data, prop, order === "none" || order === "desc");
	fillSemesterTable(id, ordered);
}

// #endregion

export {
	addRow,
	getSemesterId,
	getSemesterData,
	getAllSemesterData,
	checkSemesterData,
	getValues,
	fillSemesterTable,
	orderByProp,
};
