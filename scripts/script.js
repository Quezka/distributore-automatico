var dom = document;

var favicon = dom.getElementById("favicon");
var navLoginButton = dom.getElementById("nav-login");
var loginModal = dom.getElementById("login-modal");
var loginWelcome = dom.getElementById("login-welcome");

var welcomeView = dom.getElementById("welcome-view");
var techView = dom.getElementById("tech-view");
var userView = dom.getElementById("user-view");

var loginStatus = "out";

function setFavicon(path) {
	favicon.href = path;
}

function hideAllViews() {
	welcomeView.style.display = "none";
	techView.style.display = "none";
	userView.style.display = "none";
}

function updateUI() {
	hideAllViews();

	switch (loginStatus) {
		case "tech":
			navLoginButton.textContent = "Logout";
			techView.style.display = "block";
			document.title = "Tecnico | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
			break;

		case "user":
			navLoginButton.textContent = "Logout";
			userView.style.display = "block";
			document.title = "Utente | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
			break;

		default:
			navLoginButton.textContent = "Login";
			welcomeView.style.display = "block";
			loginWelcome.textContent = "";
			document.title = "Benvenuto! | Distributore";
			setFavicon("assets/imgs/main-favicon.ico");
	}
}

function closeLogin() {
	loginModal.classList.remove("show");
	dom.title = "Benvenuto! | Distributore";
	setFavicon("assets/imgs/main-favicon.ico");
}

function login() {
	if (loginStatus === "out") {
		loginModal.classList.add("show");
		dom.title = "Login | Distributore";
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

	var usernamePattern = /^[A-Za-z]{2,}$/;
	var passwordPattern = /^\d{4}$/;

	if (username === "admin" && password === "admin") {
		loginStatus = "tech";
		loginModal.classList.remove("show");
		loginWelcome.textContent = "Benvenuto, Tecnico!";
		updateUI();
		return;
	}

	if (!usernamePattern.test(username) || username.toLowerCase() === "admin") {
		console.log("Username non valido");
		return;
	}

	if (!passwordPattern.test(password)) {
		console.log("Password non valida");
		return;
	}

	loginStatus = "user";
	loginModal.classList.remove("show");
	loginWelcome.textContent = `Benvenuto, ${username}!`;
	updateUI();
}

dom.addEventListener("DOMContentLoaded", function () {
	updateUI();
});
