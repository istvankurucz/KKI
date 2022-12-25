// Gets the parent element of the clicked element based on the given classname
function clickedElement(target, className) {
	while (!target.classList.contains(className)) {
		target = target.parentElement;
	}

	return target;
}

// Compare function
function compare(prop, asc) {
	return (a, b) => {
		if (a[prop] > b[prop]) return asc ? 1 : -1;
		if (a[prop] < b[prop]) return asc ? -1 : 1;
		return 0;
	};
}

export { clickedElement, compare };
