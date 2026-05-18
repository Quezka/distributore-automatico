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

(function () {
	var form = DOM.getElementById("login-form");
	if (!form) return;

	var usernameInput = DOM.getElementById("username");
	var passwordInput = DOM.getElementById("password");

	var message = DOM.createElement("div");
	message.id = "loginMessage";
	message.className = "login-message";
	form.appendChild(message);

	function showMessage(text, ok) {
		message.textContent = text;
		message.style.color = ok ? "green" : "red";
	}

	function escapeHtml(str) {
		return String(str).replace(/[&<>\"'`=\/]/g, function (s) {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'\"': "&quot;",
				"'": "&#39;",
				"/": "&#47;",
				"`": "&#96;",
				"=": "&#61;",
			}[s];
		});
	}

	function setLoggedInHeader(displayText) {
		var navLogin = DOM.getElementById("nav-login");
		var modal = DOM.querySelector(".login-modal");
		if (!navLogin) return;
		navLogin.innerHTML = displayText + ' <a href="#" id="nav-logout">Esci</a>';
		var logout = DOM.getElementById("nav-logout");
		if (logout) {
			logout.addEventListener("click", function (ev) {
				ev.preventDefault();
				navLogin.textContent = "Login";
				if (modal) modal.style.display = "flex";
				message.textContent = "";
			});
		}
	}

	form.addEventListener("submit", function (ev) {
		ev.preventDefault();

		var username = ((usernameInput && usernameInput.value) || "").trim();
		var password = (passwordInput && passwordInput.value) || "";

		if (username === "admin" && password === "admin") {
			showMessage("Accesso riuscito: ruolo Tecnico", true);
			var modal = DOM.querySelector(".login-modal");
			if (modal) modal.style.display = "none";
			setLoggedInHeader("Tecnico: admin");
			return;
		}

		var usernameOk = /^[A-Za-z]+$/.test(username);
		var passwordOk = /^[A-Za-z0-9]{4}$/.test(password);

		if (!usernameOk) {
			showMessage("Username non valido: solo lettere consentite.", false);
			return;
		}

		if (!passwordOk) {
			showMessage("Password non valida: 4 caratteri alfanumerici.", false);
			return;
		}

		showMessage("Accesso riuscito: ruolo Utente", true);
		var modal = DOM.querySelector(".login-modal");
		if (modal) modal.style.display = "none";
		setLoggedInHeader("Ciao, " + escapeHtml(username));
	});

	var closeBtn = DOM.querySelector(".close-button");
	if (closeBtn) {
		closeBtn.addEventListener("click", function () {
			var modal = DOM.querySelector(".login-modal");
			if (modal) modal.style.display = "none";
		});
	}
})();
