var DOM = document;

function setIdent(path, title) {
	var head = DOM.head;
	var icon = DOM.getElementById("favicon");
	if (!icon) {
		icon = DOM.createElement("link");
		icon.id = "favicon";
		icon.rel = "icon";
		head.appendChild(icon);
	}
	icon.type = "image/x-icon";
	icon.href = path;
	document.title = title;
}

setIdent("./assets/imgs/login-favicon.ico", "Login - Distributore Automatico");
