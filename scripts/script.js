var dom = document;

var favicon = dom.getElementById("favicon");
var navLoginButton = dom.getElementById("nav-login");
var loginModal = dom.getElementById("login-modal");
var loginWelcome = dom.getElementById("login-welcome");

var welcomeView = dom.getElementById("welcome-view");
var techView = dom.getElementById("tech-view");
var userView = dom.getElementById("user-view");

var loginStatus = "out";
var credit = 0;
var earnings = 0;

var drinkStock = {
	"coca cola": 5,
	fanta: 5,
	acqua: 8,
	sprite: 5,
	the: 5,
	"red bull": 3,
};

var coinValueMap = {
	"moneta 1 euro": 1.0,
	"moneta 50 cent": 0.5,
	"moneta 20 cent": 0.2,
};

var drinkPriceMap = {
	"coca cola": 0.9,
	fanta: 0.9,
	acqua: 0.5,
	sprite: 0.9,
	the: 1.1,
	"red bull": 3.0,
};

function normalizeKey(raw) {
	return (raw || "").toLowerCase().trim().replace(/\s+/g, " ");
}

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
			updateTechUI();
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

function toggleCoinColumn() {
	var coinColumn = dom.getElementById("coin-column");
	if (!coinColumn) return;
	coinColumn.classList.toggle("visible");
}

function updateCreditDisplay() {
	var creditValue = dom.getElementById("credit-value");
	if (!creditValue) return;
	creditValue.textContent = credit.toFixed(2) + " €";
}

function updateChangeDisplay(amount) {
	var changeValue = dom.getElementById("change-value");
	if (!changeValue) return;
	changeValue.textContent = amount.toFixed(2) + " €";
}

function addCredit(amount) {
	credit += amount;
	updateCreditDisplay();
}

function purchaseDrink(key, price) {
	if (credit < price) {
		return;
	}

	// Controlla disponibilità
	var stock = drinkStock[key];
	if (typeof stock === "number" && stock <= 0) {
		console.log(`${key} esaurita`);
		return;
	}

	credit -= price;
	earnings += price;

	if (typeof drinkStock[key] === "number") {
		drinkStock[key] = Math.max(0, drinkStock[key] - 1);
	}

	updateCreditDisplay();
	updateChangeDisplay(credit);
	updateTechUI();
}

function initCoinButtons() {
	var coins = dom.querySelectorAll("#coin-column .coin");

	coins.forEach(function (coin) {
		coin.addEventListener("click", function () {
			var alt = normalizeKey(coin.getAttribute("alt") || "");
			var key =
				alt ||
				normalizeKey(
					(function () {
						var src = coin.getAttribute("src") || "";
						return src.split("/").pop().split(".")[0];
					})(),
				);

			var mapped = coinValueMap[key];
			var value = typeof mapped === "number" ? mapped : parseFloat((coin.textContent || "0").replace(",", ".")) || 0;
			if (value > 0) {
				addCredit(value);
			}
		});
	});
}

function initDrinkButtons() {
	var drinks = dom.querySelectorAll(".drink-slot");

	drinks.forEach(function (drink) {
		drink.addEventListener("click", function () {
			var alt = normalizeKey(drink.getAttribute("alt") || "");
			var key =
				alt ||
				normalizeKey(
					(function () {
						var src = drink.getAttribute("src") || "";
						return src.split("/").pop().split(".")[0];
					})(),
				);

			var mapped = drinkPriceMap[key];
			var price = typeof mapped === "number" ? mapped : parseFloat((drink.textContent || "0").replace(",", ".")) || 0;
			if (price > 0) {
				console.log(`Tentativo di acquisto: ${key} a ${price} €`);
				purchaseDrink(key, price);
			}
		});
	});
}

function formatCurrency(v) {
	return v.toFixed(2) + " €";
}

function updateTechUI() {
	var earningsEl = dom.getElementById("earnings-value");
	if (earningsEl) earningsEl.textContent = formatCurrency(earnings);

	var stockList = dom.getElementById("stock-list");
	if (!stockList) return;

	stockList.innerHTML = "";
	Object.keys(drinkPriceMap).forEach(function (rawKey) {
		var key = normalizeKey(rawKey);
		var qty = typeof drinkStock[key] === "number" ? drinkStock[key] : 0;

		var row = dom.createElement("div");
		row.className = "stock-row";

		var rowLeft = dom.createElement("div");
		rowLeft.className = "stock-left";

		var rowRight = dom.createElement("div");
		rowRight.className = "stock-right";

		var label = dom.createElement("span");
		label.className = "stock-label";
		label.textContent = rawKey;

		var qtySpan = dom.createElement("span");
		qtySpan.className = "stock-qty";
		qtySpan.id = `stock-${key}`;
		qtySpan.textContent = qty;

		var input = dom.createElement("input");
		input.type = "number";
		input.min = "1";
		input.value = "5";
		input.className = "stock-input";

		var btn = dom.createElement("button");
		btn.className = "stock-btn";
		btn.textContent = "Ricarica";
		btn.addEventListener("click", function () {
			var add = parseInt(input.value, 10) || 0;
			restockDrink(key, add);
		});

		rowLeft.appendChild(label);
		rowLeft.appendChild(qtySpan);
		rowRight.appendChild(input);
		rowRight.appendChild(btn);

		row.appendChild(rowLeft);
		row.appendChild(rowRight);

		stockList.appendChild(row);
	});
}

function restockDrink(key, amount) {
	if (typeof drinkStock[key] !== "number") drinkStock[key] = 0;
	drinkStock[key] += Math.max(0, amount || 0);
	updateTechUI();
}

function withdrawEarnings() {
	var withdrawn = earnings;
	earnings = 0;
	updateTechUI();
	alert(`Hai ritirato: ${formatCurrency(withdrawn)}`);
}

dom.addEventListener("DOMContentLoaded", function () {
	updateUI();
	updateCreditDisplay();
	updateChangeDisplay(0);
	var walletButton = dom.getElementById("wallet-button");
	if (walletButton) {
		walletButton.addEventListener("click", toggleCoinColumn);
	}
	initCoinButtons();
	initDrinkButtons();

	var withdrawButton = dom.getElementById("withdraw-button");
	if (withdrawButton) withdrawButton.addEventListener("click", withdrawEarnings);
});
