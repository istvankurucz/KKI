// Opens and closes the menu
function handleMenuClick() {
	const navButton = document.querySelector(".nav__button");
	const bars = navButton.querySelector(".fa-bars");
	const x = navButton.querySelector(".fa-x");
	const menu = document.querySelector(".menu");

	menu.classList.toggle("show");
	bars.classList.toggle("show");
	x.classList.toggle("show");
}

// Gets the menuitems
function getMenuitems() {
	const semesters = document.querySelectorAll(".sem");

	const items = [];
	semesters.forEach((sem) => {
		const id = sem.getAttribute("id");
		const num = sem.querySelector(".sem__title__num").innerText;

		items.push({ id, text: `${num}. félév` });
	});
	items.push({ id: "aggStat", text: "Összesített eredmények" });

	return items;
}

// Creates a new menuitem
function addMenuitem(menuitem, parent) {
	const menuitemTemplate = document.querySelector("#menuitem");
	const clon = menuitemTemplate.content.cloneNode(true);

	const a = clon.querySelector("a");
	a.setAttribute("href", `#${menuitem.id}`);
	a.innerText = menuitem.text;

	parent.appendChild(clon);
}

// Deletes the menuitems
function deleteMenuitems() {
	const menuitems = document.querySelectorAll(".menuitem");
	menuitems.forEach((item) => item.remove());
}

// Loads the menu
function loadMenu() {
	deleteMenuitems();

	const data = getMenuitems();
	const menu = document.querySelector(".menu");
	data.forEach((menuitem) => addMenuitem(menuitem, menu));
}

export { handleMenuClick, getMenuitems, loadMenu };
