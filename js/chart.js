import { getSemesterCount } from "./sem.js";
import {
	calcAggAvg,
	calcAggCci,
	calcAggCi,
	calcAggDoneCredit,
	calcAggWAvg,
	calcAvg,
	calcCci,
	calcCi,
	calcDoneCredit,
	calcWAvg,
	sumAggCredit,
	sumProp,
} from "./stats.js";
import { getAllSemesterData, getSemesterData, getSubjectsData } from "./table.js";

const allCharts = [];

// Titles and names for the chart
const chartData = [
	{ title: "Felvett kreditek a félévek során", name: "Kredit" },
	{ title: "Felvett kreditek a félévek során (görgetett)", name: "Kredit" },

	{ title: "Teljesített kreditek a félévek során", name: "Kredit" },
	{ title: "Teljesített kreditek a félévek során (görgetett)", name: "Kredit" },

	{ title: "Átlag a félévek során", name: "Átlag" },
	{ title: "Átlag a félévek során (görgetett)", name: "Átlag" },

	{ title: "Súlyozott átlag a félévek során", name: "Súlyozott átlag" },
	{ title: "Súlyozott átlag a félévek során (görgetett)", name: "Súlyozott átlag" },

	{ title: "Kreditindex a félévek során", name: "Kreditindex" },
	{ title: "Kreditindex a félévek során (görgetett)", name: "Kreditindex" },

	{ title: "Korrigált kreditindex a félévek során", name: "Korrigált kreditindex" },
	{ title: "Korrigált kreditindex a félévek során (görgetett)", name: "Korrigált kreditindex" },
];

// Sets the styles of the chart
function setChartOptions(chartTitle, yAxisTitle) {
	const darkColor = "#0d0d26";

	return {
		plugins: {
			title: {
				text: chartTitle,
				display: true,
				font: {
					size: "16px",
					family: "Montserrat",
				},
				color: darkColor,
				padding: {
					top: 5,
					bottom: 20,
				},
			},
			legend: {
				display: false,
			},
			tooltip: {
				enabled: true,
			},
		},
		layout: {
			padding: 5,
		},
		elements: {
			line: {
				borderWidth: 3,
			},
			point: {
				radius: 5,
				hoverRadius: 7,
			},
		},
		scales: {
			y: {
				min: 0,
				title: {
					display: true,
					text: yAxisTitle,
					color: darkColor,
					font: {
						size: 12,
						weight: 500,
					},
				},
			},
		},
	};
}

// Based on the chart id returns the proper function to execute the calculation
function calcFunction(id) {
	switch (id) {
		case "chartAllCredit":
			return sumProp;

		case "chartAggAllCredit":
			return sumAggCredit;

		case "chartDoneCredit":
			return calcDoneCredit;

		case "chartAggDoneCredit":
			return calcAggDoneCredit;

		case "chartAvg":
			return calcAvg;

		case "chartAggAvg":
			return calcAggAvg;

		case "chartWAvg":
			return calcWAvg;

		case "chartAggWAvg":
			return calcAggWAvg;

		case "chartCi":
			return calcCi;

		case "chartAggCi":
			return calcAggCi;

		case "chartCci":
			return calcCci;

		case "chartAggCci":
			return calcAggCci;
	}
}

// Gets the points
function getPoints(semCount, calcFunction, agg = false) {
	const points = [];
	for (let i = 0; i < semCount; i++) {
		const sem = document.querySelectorAll(".sem")[i];
		const semId = sem.getAttribute("id");

		const data = agg ? getSubjectsData(getAllSemesterData(i + 1)) : getSemesterData(semId);
		// const data = agg ? getSubjectsData(getAllSemesterData(i + 1)) : getSemesterData(i);
		const value = Math.round(calcFunction(data) * 100) / 100;
		points.push({ x: parseInt(semId.slice(3)), y: value });
	}

	return points;
}

// Adds chart
function addChart(id, data, options) {
	const chart = new Chart(document.getElementById(id), {
		type: "line",
		data: {
			labels: data.map((row) => `${row.x}. félév`),
			datasets: [
				{
					label: "KKI",
					data: data.map((row) => row.y),
					backgroundColor: "#ff6600",
					borderColor: "#ff6600",
				},
			],
		},
		options,
	});

	return chart;
}

// Shows the charts
function showCharts() {
	const semCount = getSemesterCount();
	const chartsBlock = document.querySelector(".charts");
	if (semCount < 2) {
		chartsBlock.classList.add("hide");
		return;
	} else chartsBlock.classList.remove("hide");

	const charts = document.querySelectorAll(".chart canvas");
	charts.forEach((chart, i) => {
		const id = chart.getAttribute("id");
		const points = getPoints(semCount, calcFunction(id), i % 2);
		const options = setChartOptions(chartData[i].title, chartData[i].name);

		const created = addChart(id, points, options);
		allCharts.push({ id, chart: created });
	});
}

// Removes the charts
function removeCharts() {
	allCharts.forEach((chart) => chart.chart.destroy());
}

export { chartData, calcFunction, getPoints, addChart, showCharts, removeCharts };
