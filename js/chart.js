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
import { getAllSemesterData, getSemesterData } from "./table.js";

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

// Style to the texts on the chart
const fontStyle = {
	fontFamily: "Montserrat",
	fontSize: 16,
	fontWeight: 500,
};

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

// Sets the styles of the chart
function setChartStyle(chartData) {
	return {
		title: {
			label: {
				text: chartData.title,
				style: fontStyle,
			},
			margin: {
				top: 5,
				bottom: 10,
			},
			position: "center",
		},
		xAxis: {
			label: {
				text: "félév",
				color: "#0d0d26",
				margin: {
					top: 10,
				},
			},
			scale: {
				interval: 1,
			},
		},
		yAxis: {
			label: {
				text: chartData.name,
				color: "#0d0d26",
				margin: {
					top: 10,
					bottom: 10,
				},
			},
		},
		legend: {
			visible: false,
		},
	};
}

// Gets the points
function getPoints(semCount, calcFunction, agg = false) {
	const points = [];
	for (let i = 0; i < semCount; i++) {
		const data = agg ? getAllSemesterData(i + 1) : getSemesterData(`sem${i + 1}`);
		const value = Math.round(calcFunction(data) * 100) / 100;
		points.push({ x: i + 1, y: value });
	}

	return points;
}

// Adds chart
function addChart(chartDiv, chartData, points) {
	const chart = new JSC.Chart(chartDiv, {
		...setChartStyle(chartData),

		series: [
			{
				name: chartData.name,
				type: "line",
				color: "#ff6600", //"#0d0d26",
				points: points,
			},
		],
		debug: true,
	});
}

// Shows the charts
function showCharts() {
	const semCount = getSemesterCount();
	const chartsBlock = document.querySelector(".charts");
	if (semCount < 2) {
		chartsBlock.classList.add("hide");
		return;
	} else chartsBlock.classList.remove("hide");

	const charts = document.querySelectorAll(".chart");
	charts.forEach((chart, i) => {
		const id = chart.getAttribute("id");
		const points = getPoints(semCount, calcFunction(id), i % 2);
		addChart(id, chartData[i], points);
	});
}

export { chartData, calcFunction, getPoints, addChart, showCharts };
