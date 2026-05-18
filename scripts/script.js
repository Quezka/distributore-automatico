var dom = document;

var favicon = dom.getElementById("favicon");
var navLoginButton = dom.getElementById("nav-login");
var loginModal = dom.getElementById("login-modal");
var mainContent = dom.getElementById("main-content");
var welcomeSection = dom.getElementById("welcome-section");
var techView = dom.getElementById("tech-view");
var userView = dom.getElementById("user-view");
var loginWelcome = dom.getElementById("login-welcome");

var loginStatus = "out";

function setFavicon(path) {
	favicon.href = path + "?v=" + Date.now();
}

function updateUI() {
	switch (loginStatus) {
		case "tech":
			navLoginButton.textContent = "Logout";
			welcomeSection.style.display = "none";
			techView.style.display = "flex";
			userView.style.display = "none";
			document.title = "Tecnico | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
			break;

		case "user":
			navLoginButton.textContent = "Logout";
			welcomeSection.style.display = "none";
			techView.style.display = "none";
			userView.style.display = "flex";
			document.title = "Utente | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
			break;

		default:
			navLoginButton.textContent = "Login";
			welcomeSection.style.display = "block";
			techView.style.display = "none";
			userView.style.display = "none";
			document.title = "Benvenuto! | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
	}
}

function closeLogin() {
	loginModal.style.display = "none";
	setFavicon("assets/imgs/main-favicon.ico");
}

function login() {
	if (loginStatus === "out") {
		loginModal.style.display = "flex";
		setFavicon("assets/imgs/login-favicon.ico");
	} else {
		loginStatus = "out";
		updateUI();
	}
}

function validateLogin(event) {
	if (event) event.preventDefault();

	var username = dom.getElementById("username").value.trim();
	var password = dom.getElementById("password").value.trim();

	var usernamePattern = /^[A-Za-z0-9]+$/;
	var passwordPattern = /^\d{4}$/;

	if (username === "admin" && password === "admin") {
		loginStatus = "tech";
		loginModal.style.display = "none";
		loginWelcome.textContent = "Benvenuto, Tecnico!";
		updateUI();
		return;
	}

	if (!usernamePattern.test(username)) {
		console.log("Username non valido");
		return;
	}

	if (!passwordPattern.test(password)) {
		console.log("Password non valida");
		return;
	}

	loginStatus = "user";
	loginModal.style.display = "none";
	loginWelcome.textContent = `Benvenuto, ${username}!`;
	updateUI();
}

dom.addEventListener("DOMContentLoaded", function () {
	updateUI();
});
