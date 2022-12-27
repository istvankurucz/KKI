import { addChart, calcFunction, chartData, getPoints, showCharts } from "./js/chart.js";
import { getTheme, updateLocalStorage } from "./js/localstorage.js";
import { closeMenu, handleMenuClick, handleNavScroll, loadMenu } from "./js/nav.js";
import { addSemester, getSemesterCount, loadSemesters } from "./js/sem.js";

// Loading the data from the local storage
const sems = document.querySelector(".sems");
loadSemesters(sems);

// #region Menu
// Load menuitems
loadMenu();

// Event listener to nav
const navButton = document.querySelector(".nav__button");
navButton.addEventListener("click", handleMenuClick);

navButton.addEventListener("blur", () => setTimeout(closeMenu, 100));
// #endregion

// Adding a semester when the user clicks the add semester button
const addSemesterButton = document.querySelector(".button--newSem");
addSemesterButton.addEventListener("click", () => {
	addSemester(sems);
	loadMenu();
	showCharts();
});

// #region Theme
function setTheme() {
	const theme = getTheme();
	if (theme) body.classList.add("dark");
}

const body = document.querySelector("body");
setTheme();

const themeButton = document.querySelector(".theme__switch");
themeButton.addEventListener("click", () => {
	body.classList.toggle("dark");
});
// #endregion

// #region Go top button
// If the scrolled coordinate is >300 -> show the go top button
const goTopButton = document.querySelector(".goTop");
window.addEventListener("scroll", () => {
	if (window.scrollY > 300) goTopButton.classList.add("show");
	else goTopButton.classList.remove("show");

	handleNavScroll(open);
});

// When the user clicks the go top button go to the top of the page
goTopButton.addEventListener("click", () => window.scrollTo(0, 0));
// #endregion

// When the user leaves the site update the local storage
window.addEventListener("visibilitychange", updateLocalStorage);

// #region Charts
const refreshChartsButton = document.querySelector(".charts__refresh");
refreshChartsButton.addEventListener("click", showCharts);
// Shows the charts
const semCount = getSemesterCount();
showCharts(semCount);
// #endregion
