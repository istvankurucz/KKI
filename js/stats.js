import { checkSemesterData, getAllSemesterData, getValues } from "./table.js";

// Calculates the sum of the given prop
function sumProp(semesterData, prop) {
	const propData = getValues(semesterData, prop);

	return propData.reduce((total, current) => total + current);
}

// Calculates the aggregated sum of the credits
function sumAggCredit(allSemesterData) {
	let sum = 0;
	allSemesterData.forEach((sem) => (sum += sumProp(sem, "credit")));
	return sum;
}

// Calculates the sum of the credits if the grade of the subject is >1
function calcDoneCredit(semesterData) {
	const grades = getValues(semesterData, "grade");
	const credits = getValues(semesterData, "credit");

	let creditsDone = 0;
	for (let i = 0; i < grades.length; i++) {
		if (grades[i] !== 1) creditsDone += credits[i];
	}

	return creditsDone;
}

// Calculates the aggregated sum of the credits
function calcAggDoneCredit(allSemesterData) {
	let sum = 0;
	allSemesterData.forEach((sem) => (sum += calcDoneCredit(sem)));
	return sum;
}

// Calculates the average of the grades
function calcAvg(semesterData) {
	const grades = getValues(semesterData, "grade");

	return grades.reduce((total, grade) => total + grade) / grades.length;
}

// Calculates the aggregated average of the grades
function calcAggAvg(allSemesterData) {
	let sum = 0,
		count = 0;
	allSemesterData.forEach((sem) => {
		sum += sumProp(sem, "grade");
		count += sem.length;
	});
	return sum / count;
}

// Calculates the weighted average of the grades (weights are the credits)
function calcWAvg(semesterData) {
	const allCredit = sumProp(semesterData, "credit");

	let sum = 0;
	semesterData.forEach((subject) => (sum += subject.credit * subject.grade));

	const result = sum / allCredit;

	return isNaN(result) ? 0 : result;
}

// Calculates the weighted average of the grades
function calcAggWAvg(allSemesterData) {
	const allCredit = sumAggCredit(allSemesterData);
	let sum = 0;
	allSemesterData.forEach((sem) => {
		let semSum = 0;
		sem.forEach((subject) => (semSum += subject.credit * subject.grade)), (sum += semSum);
	});
	return sum / allCredit;
}

// Calculates the creditindex
function calcCi(semesterData) {
	let sum = 0;
	semesterData.forEach((subject) => (sum += subject.credit * subject.grade));

	return sum / 30;
}

// Calculates the aggregated creditindex
function calcAggCi(allSemesterData) {
	let sum = 0;
	allSemesterData.forEach((sem) => {
		let semSum = 0;
		sem.forEach((subject) => (semSum += subject.credit * subject.grade));
		sum += semSum;
	});

	return sum / (allSemesterData.length * 30);
}

// Calculates the corrected creditindex
function calcCci(semesterData) {
	const ci = calcCi(semesterData);
	const allCredits = sumProp(semesterData, "credit");
	const creditsDone = calcDoneCredit(semesterData);

	const result = ci * (creditsDone / allCredits);

	return isNaN(result) ? 0 : result;
}

// Calculates the aggregated corrected creditindex
function calcAggCci(allSemesterData) {
	const ci = calcAggCi(allSemesterData);
	const allCredits = sumAggCredit(allSemesterData, "credit");
	const creditsDone = calcAggDoneCredit(allSemesterData);

	const result = ci * (creditsDone / allCredits);

	return isNaN(result) ? 0 : result;
}

// Updates the Stats block inside a semester
function updateSemesterStats(semester, data) {
	if (!checkSemesterData(data)) return;

	const stats = document.querySelector(`#${semester} .stat`);
	const allCredit = stats.querySelector(".stat__row--allCredit .stat__value");
	const doneCredit = stats.querySelector(".stat__row--doneCredit .stat__value");
	const avg = stats.querySelector(".stat__row--avg .stat__value");
	const wavg = stats.querySelector(".stat__row--wavg .stat__value");
	const ci = stats.querySelector(".stat__row--ci .stat__value");
	const cci = stats.querySelector(".stat__row--cci .stat__value");

	allCredit.innerText = sumProp(data, "credit").toString();
	doneCredit.innerText = calcDoneCredit(data).toString();
	avg.innerText = calcAvg(data).toFixed(2).toString();
	wavg.innerText = calcWAvg(data).toFixed(2).toString();
	ci.innerText = calcCi(data).toFixed(2).toString();
	cci.innerText = calcCci(data).toFixed(2).toString();
}

// Updates the Aggregated Stats block
function updateAggStats() {
	const data = getAllSemesterData();

	for (let i = 0; i < data.length; i++) {
		if (!checkSemesterData(data[i])) return;
	}

	const stats = document.querySelector(".aggStat .stat");
	const allCredit = stats.querySelector(".stat__row--allCredit .stat__value");
	const doneCredit = stats.querySelector(".stat__row--doneCredit .stat__value");
	const avg = stats.querySelector(".stat__row--avg .stat__value");
	const wavg = stats.querySelector(".stat__row--wavg .stat__value");
	const ci = stats.querySelector(".stat__row--ci .stat__value");
	const cci = stats.querySelector(".stat__row--cci .stat__value");

	allCredit.innerText = sumAggCredit(data).toString();
	doneCredit.innerText = calcAggDoneCredit(data).toString();
	avg.innerText = calcAggAvg(data).toFixed(2).toString();
	wavg.innerText = calcAggWAvg(data).toFixed(2).toString();
	ci.innerText = calcAggCi(data).toFixed(2).toString();
	cci.innerText = calcAggCci(data).toFixed(2).toString();
}

export { sumProp, calcDoneCredit, calcAvg, calcWAvg, calcCi, calcCci, updateSemesterStats, updateAggStats };
