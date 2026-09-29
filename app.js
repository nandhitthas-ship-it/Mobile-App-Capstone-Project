import "./styles.css";
import "./responsive-fixes.css";

const defaultTransactions = [
  {
    id: 1,
    type: "expense",
    amount: 42.50,
    category: "Food",
    note: "Sunday brunch",
    date: "2024-10-13"
  },
  {
    id: 2,
    type: "expense",
    amount: 18.00,
    category: "Transport",
    note: "Metro card",
    date: "2024-10-12"
  },
  {
    id: 3,
    type: "income",
    amount: 2400,
    category: "Salary",
    note: "October salary",
    date: "2024-10-01"
  },
  {
    id: 4,
    type: "expense",
    amount: 84.20,
    category: "Shopping",
    note: "Home supplies",
    date: "2024-09-29"
  },
  {
    id: 5,
    type: "expense",
    amount: 12.50,
    category: "Entertainment",
    note: "Movie night",
    date: "2024-09-27"
  }
];

/* =========================================================
   SAFE LOCAL STORAGE FUNCTIONS
   ========================================================= */

function getStorage(key, fallback = null) {
  // Prevent errors when localStorage is unavailable
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (error) {
    console.error("Unable to read localStorage:", error);
    return fallback;
  }
}

function setStorage(key, value) {
  // Prevent errors when localStorage is unavailable
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error("Unable to save to localStorage:", error);
  }
}

function removeStorage(key) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Unable to remove localStorage item:", error);
  }
}

/* =========================================================
   SAFE JSON PARSER
   ========================================================= */

function parseStorageJSON(key, fallback = null) {
  const value = getStorage(key, null);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Invalid stored JSON for ${key}:`, error);
    return fallback;
  }
}

/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {
  page: "overview",
  authMode: "login",
  currency: "INR",

  transactions:
    parseStorageJSON(
      "spendwise_transactions",
      null
    ) || defaultTransactions,

  user:
    parseStorageJSON(
      "spendwise_user",
      null
    ) || null,

  editType: "expense"
};

/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const money = (number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: state.currency,
    maximumFractionDigits: 2
  }).format(number);

const icons = {
  Food: "◉",
  Transport: "⌁",
  Housing: "⌂",
  Shopping: "◇",
  Health: "✚",
  Entertainment: "♫",
  Salary: "↗",
  Other: "•"
};

/* =========================================================
   SAVE TRANSACTIONS
   ========================================================= */

function save() {
  setStorage(
    "spendwise_transactions",
    JSON.stringify(state.transactions)
  );
}

/* =========================================================
   TOAST
   ========================================================= */

function toast(message) {
  const el = $("#toast");

  if (!el) {
    return;
  }

  el.textContent = message;
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2600);
}

/* =========================================================
   USER HELPERS
   ========================================================= */

function initials(name) {
  return (name || "Alex Morgan")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   AUTH / APP VIEW
   ========================================================= */

function showAuth() {
  const authView = $("#authView");
  const appView = $("#appView");

  if (authView) {
    authView.classList.remove("hidden");
  }

  if (appView) {
    appView.classList.add("hidden");
  }
}

function showApp() {
  if (!state.user) {
    showAuth();
    return;
  }

  const authView = $("#authView");
  const appView = $("#appView");

  if (authView) {
    authView.classList.add("hidden");
  }

  if (appView) {
    appView.classList.remove("hidden");
  }

  const name = state.user.name || "Alex Morgan";
  const email = state.user.email || "";

  const sideName = $("#sideName");
  const sideEmail = $("#sideEmail");
  const avatar = $("#avatar");
  const mobileProfile = $("#mobileProfile");

  if (sideName) {
    sideName.textContent = name;
  }

  if (sideEmail) {
    sideEmail.textContent = email;
  }

  if (avatar) {
    avatar.textContent = initials(name);
  }

  if (mobileProfile) {
    mobileProfile.textContent = initials(name);
  }

  renderPage();
}

/* =========================================================
   TRANSACTIONS
   ========================================================= */

function total(type) {
  return state.transactions
    .filter((transaction) => transaction.type === type)
    .reduce((totalAmount, transaction) => {
      return totalAmount + transaction.amount;
    }, 0);
}

function dateLabel(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric"
    }
  );
}

function transactionRow(transaction, actions = false) {
  return `
    <div class="transaction">
      <div class="category-icon">
        ${icons[transaction.category] || "•"}
      </div>

      <div class="transaction-info">
        <strong>
          ${escapeHtml(transaction.note || transaction.category)}
        </strong>

        <small>
          ${escapeHtml(transaction.category)} · ${dateLabel(transaction.date)}
        </small>
      </div>

      <div class="amount ${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"}${money(
          transaction.amount
        )}
      </div>

      ${
        actions
          ? `
            <button
              class="link-button edit-transaction"
              data-id="${escapeHtml(transaction.id)}"
            >
              Edit
            </button>

            <button
              class="link-button delete-transaction"
              data-id="${escapeHtml(transaction.id)}"
            >
              Delete
            </button>
          `
          : ""
      }
    </div>
  `;
}

/* =========================================================
   PAGE RENDERING
   ========================================================= */

function renderPage() {
  if (!state.user) {
    return;
  }

  const name =
    (state.user.name || "Alex Morgan").split(" ")[0];

  const titles = {
    overview: `Good morning, ${name}`,
    transactions: "Transactions",
    budgets: "Budgets",
    insights: "Your insights",
    settings: "Settings"
  };

  const pageTitle = $("#pageTitle");
  const pageKicker = $("#pageKicker");

  if (pageTitle) {
    pageTitle.textContent =
      titles[state.page] || titles.overview;
  }

  if (pageKicker) {
    pageKicker.textContent =
      new Date()
        .toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })
        .toUpperCase();
  }

  document
    .querySelector(".nav-item.active")
    ?.classList.remove("active");

  document
    .querySelector(`[data-page="${state.page}"]`)
    ?.classList.add("active");

  const pages = {
    overview: overviewPage,
    transactions: transactionsPage,
    budgets: budgetsPage,
    insights: insightsPage,
    settings: settingsPage
  };

  const pageContent = $("#pageContent");

  if (pageContent && pages[state.page]) {
    pageContent.innerHTML = pages[state.page]();
    bindPageEvents();
  }
}

/* =========================================================
   OVERVIEW PAGE
   ========================================================= */

function overviewPage() {
  const inc = total("income");
  const exp = total("expense");
  const balance = inc - exp;

  const recent = state.transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return `
    <section class="grid stats-grid">

      <div class="card stat-card">
        <span class="label">Total balance</span>
        <div class="value">${money(balance)}</div>
        <span class="trend">↑ 8.4% this month</span>
      </div>

      <div class="card stat-card">
        <span class="label">Income</span>
        <div class="value">${money(inc)}</div>
        <span class="trend">↑ 12.1% this month</span>
      </div>

      <div class="card stat-card">
        <span class="label">Expenses</span>
        <div class="value">${money(exp)}</div>
        <span class="trend down">↓ 3.2% this month</span>
      </div>

      <div class="card stat-card">
        <span class="label">Savings rate</span>
        <div class="value">
          ${inc ? Math.round((balance / inc) * 100) : 0}%
        </div>
        <span class="trend">Great progress!</span>
      </div>

    </section>

    <section class="grid overview-grid">

      <div class="card">

        <div class="card-head">

          <div>
            <h3>Spending overview</h3>
            <p>Last 7 months</p>
          </div>

          <button class="pill-button">
            Monthly ⌄
          </button>

        </div>

        <div class="chart-wrap">

          ${[45, 62, 42, 78, 56, 70, 88]
            .map(
              (value, index) => `
                <div
                  class="bar ${index === 6 ? "active" : ""}"
                  style="height:${value}%"
                >
                  <span>
                    ${
                      [
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct"
                      ][index]
                    }
                  </span>
                </div>
              `
            )
            .join("")}

        </div>

      </div>

      <div class="card">

        <div class="card-head">

          <div>
            <h3>By category</h3>
            <p>This month</p>
          </div>

          <button
            class="link-button"
            data-page-link="insights"
          >
            See all →
          </button>

        </div>

        <div class="donut-row">

          <div class="donut"></div>

          <div class="legend">

            <div class="legend-item">
              <i class="dot"></i>
              <span>Food</span>
              <strong>42%</strong>
            </div>

            <div class="legend-item">
              <i class="dot mint"></i>
              <span>Transport</span>
              <strong>25%</strong>
            </div>

            <div class="legend-item">
              <i class="dot orange"></i>
              <span>Shopping</span>
              <strong>17%</strong>
            </div>

            <div class="legend-item">
              <i class="dot gray"></i>
              <span>Other</span>
              <strong>16%</strong>
            </div>

          </div>

        </div>

      </div>

    </section>

    <div class="section-title">

      <h3>Recent transactions</h3>

      <button
        class="link-button"
        data-page-link="transactions"
      >
        View all →
      </button>

    </div>

    <div class="card transaction-list">
      ${recent.map((transaction) =>
        transactionRow(transaction)
      ).join("")}
    </div>
  `;
}

/* =========================================================
   TRANSACTIONS PAGE
   ========================================================= */

function transactionsPage() {
  return `
    <div class="section-title">

      <div>
        <h3>All transactions</h3>
        <p class="muted">
          A complete view of your money movement.
        </p>
      </div>

      <button class="primary" id="addTransaction">
        ＋ Add transaction
      </button>

    </div>

    <div class="toolbar">

      <input
        id="searchTransactions"
        placeholder="Search transactions…"
      >

      <select id="filterType">
        <option value="all">All types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </select>

      <select id="filterCategory">
        <option value="all">All categories</option>

        ${Object.keys(icons)
          .map(
            (category) =>
              `<option>${category}</option>`
          )
          .join("")}

      </select>

    </div>

    <div
      class="card transaction-list"
      id="transactionResults"
    >

      ${
        state.transactions.length
          ? state.transactions
              .slice()
              .sort((a, b) =>
                b.date.localeCompare(a.date)
              )
              .map((transaction) =>
                transactionRow(transaction, true)
              )
              .join("")
          : `
            <div class="empty">
              <strong>No transactions yet</strong>
              Add your first transaction to start.
            </div>
          `
      }

    </div>
  `;
}

/* =========================================================
   BUDGET PAGE
   ========================================================= */

function budgetsPage() {
  return `
    <div class="section-title">

      <div>
        <h3>Monthly budgets</h3>
        <p class="muted">
          Keep your priorities visible.
        </p>
      </div>

      <button class="primary" id="notifyButton">
        Enable reminders
      </button>

    </div>

    <div class="budget-list">

      ${[
        ["Food", 350, 242],
        ["Transport", 180, 96],
        ["Shopping", 250, 212],
        ["Entertainment", 120, 58],
        ["Health", 150, 30],
        ["Housing", 1200, 950]
      ]
        .map(([category, max, used]) => {
          const percentage = Math.min(
            100,
            (used / max) * 100
          );

          return `
            <div class="card">

              <div class="card-head">

                <div>
                  <h3>
                    ${icons[category]}
                    &nbsp;${category}
                  </h3>

                  <p>October budget</p>
                </div>

                <button class="link-button">
                  •••
                </button>

              </div>

              <div class="progress">

                <i
                  class="${used / max > 0.85 ? "warning" : ""}"
                  style="width:${percentage}%"
                ></i>

              </div>

              <div class="budget-meta">
                <span>
                  ${money(used)} spent
                </span>

                <strong>
                  ${money(max - used)} left
                </strong>
              </div>

            </div>
          `;
        })
        .join("")}

    </div>
  `;
}

/* =========================================================
   INSIGHTS PAGE
   ========================================================= */

function insightsPage() {
  return `
    <div class="section-title">

      <div>
        <h3>Personalized insights</h3>
        <p class="muted">
          Simple observations from your spending.
        </p>
      </div>

      <button
        class="pill-button"
        id="rateButton"
      >
        Refresh rates ↻
      </button>

    </div>

    <div class="grid" style="gap:12px">

      <div class="card insight">

        <div class="insight-icon">✦</div>

        <div>
          <h3>
            You are spending less on transport
          </h3>

          <p class="muted">
            Your transport spending is down 18%
            compared with last month. Keep it up!
          </p>
        </div>

      </div>

      <div class="card insight">

        <div class="insight-icon">◒</div>

        <div>
          <h3>
            Food is your biggest category
          </h3>

          <p class="muted">
            You have used 69% of your food budget.
            There are 12 days left in the month.
          </p>
        </div>

      </div>

      <div class="card insight">

        <div class="insight-icon">↗</div>

        <div>
          <h3>
            Try a weekly savings goal
          </h3>

          <p class="muted">
            Saving ${money(40)} each week could build
            a ${money(2080)} cushion this year.
          </p>
        </div>

      </div>

    </div>

    <div
      id="rateResult"
      class="card hidden"
      style="margin-top:18px"
    ></div>
  `;
}

/* =========================================================
   SETTINGS PAGE
   ========================================================= */

function settingsPage() {
  return `
    <div class="card">

      <div class="card-head">

        <div>
          <h3>Profile</h3>
          <p>Manage your account details.</p>
        </div>

      </div>

      <label>
        Display name

        <input
          id="settingsName"
          value="${escapeHtml(state.user?.name || "Alex Morgan")}"
        >
      </label>

      <label>
        Email

        <input
          value="${state.user?.email || ""}"
          disabled
        >
      </label>

      <button
        class="primary"
        id="saveProfile"
      >
        Save profile <span>→</span>
      </button>

    </div>

    <div
      class="card"
      style="margin-top:18px"
    >

      <div class="card-head">

        <div>
          <h3>Device integrations</h3>
          <p>Connect SpendWise to your device.</p>
        </div>

      </div>

      <button
        class="pill-button"
        id="cameraButton"
      >
        📷 Add receipt photo
      </button>

      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
      >

      <p
        class="muted"
        style="font-size:12px"
      >
        Camera access is requested only when you
        choose to add a receipt.
      </p>

    </div>
  `;
}

/* =========================================================
   PAGE EVENTS
   ========================================================= */

function bindPageEvents() {

  document
    .querySelectorAll("[data-page-link]")
    .forEach((button) => {
      button.onclick = () => {
        state.page = button.dataset.page;
        renderPage();
      };
    });

  $("#addTransaction")?.addEventListener(
    "click",
    () => openModal()
  );

  $("#searchTransactions")?.addEventListener(
    "input",
    filterTransactions
  );

  $("#filterType")?.addEventListener(
    "change",
    filterTransactions
  );

  $("#filterCategory")?.addEventListener(
    "change",
    filterTransactions
  );

  /* DELETE TRANSACTION */

  document
    .querySelectorAll(".delete-transaction")
    .forEach((button) => {

      button.onclick = () => {

        state.transactions =
          state.transactions.filter(
            (transaction) =>
              String(transaction.id) !==
              button.dataset.id
          );

        save();
        renderPage();
        toast("Transaction deleted");
      };
    });

  /* EDIT TRANSACTION */

  document
    .querySelectorAll(".edit-transaction")
    .forEach((button) => {

      button.onclick = () => {

        const transaction =
          state.transactions.find(
            (item) =>
              String(item.id) ===
              button.dataset.id
          );

        openModal(transaction);
      };
    });

  /* NOTIFICATIONS */

  $("#notifyButton")?.addEventListener(
    "click",
    async () => {

      if (!("Notification" in window)) {
        toast(
          "Notifications are not supported here"
        );
        return;
      }

      try {

        const result =
          await Notification.requestPermission();

        toast(
          result === "granted"
            ? "Reminders enabled"
            : "Permission was not granted"
        );

      } catch (error) {

        console.error(error);
        toast("Unable to enable notifications");

      }
    }
  );

  /* EXCHANGE RATES */

  $("#rateButton")?.addEventListener(
    "click",
    fetchRates
  );

  /* SAVE PROFILE */

  $("#saveProfile")?.addEventListener(
    "click",
    () => {

      const settingsName =
        $("#settingsName");

      if (settingsName) {
        state.user.name =
          settingsName.value.trim() ||
          state.user.name;
      }

      setStorage(
        "spendwise_user",
        JSON.stringify(state.user)
      );

      showApp();
      toast("Profile updated");
    }
  );

  /* CAMERA */

  $("#cameraButton")?.addEventListener(
    "click",
    () => {
      $("#cameraInput")?.click();
    }
  );

  $("#cameraInput")?.addEventListener(
    "change",
    () => {
      toast("Receipt photo added to this session");
    }
  );
}

/* =========================================================
   FILTER TRANSACTIONS
   ========================================================= */

function filterTransactions() {

  const searchInput =
    $("#searchTransactions");

  const typeInput =
    $("#filterType");

  const categoryInput =
    $("#filterCategory");

  if (
    !searchInput ||
    !typeInput ||
    !categoryInput
  ) {
    return;
  }

  const q =
    (searchInput.value || "")
      .toLowerCase();

  const type =
    typeInput.value;

  const category =
    categoryInput.value;

  const list =
    state.transactions.filter(
      (transaction) => {

        const text =
          `${transaction.note} ${transaction.category}`
            .toLowerCase();

        return (
          (!q || text.includes(q)) &&
          (type === "all" ||
            transaction.type === type) &&
          (category === "all" ||
            transaction.category === category)
        );
      }
    );

  const results =
    $("#transactionResults");

  if (!results) {
    return;
  }

  results.innerHTML =
    list.length
      ? list
          .map((transaction) =>
            transactionRow(transaction, true)
          )
          .join("")
      : `
        <div class="empty">
          <strong>No matches found</strong>
          Try another search or filter.
        </div>
      `;

  bindPageEvents();
}

/* =========================================================
   EXCHANGE RATES
   ========================================================= */

async function fetchRates() {

  const box = $("#rateResult");

  if (!box) {
    return;
  }

  box.classList.remove("hidden");
  box.innerHTML =
    "Loading current exchange rates…";

  try {

    const response =
      await fetch(
        "https://open.er-api.com/v6/latest/INR"
      );

    if (!response.ok) {
      throw new Error(
        "Rate request failed"
      );
    }

    const data =
      await response.json();

    box.innerHTML = `
      <h3>Live exchange rates</h3>

      <p class="muted">
        1 INR =
        ${data.rates.USD.toFixed(4)} USD ·
        ${data.rates.EUR.toFixed(4)} EUR ·
        ${data.rates.GBP.toFixed(4)} GBP
      </p>
    `;

  } catch (error) {

    console.error(error);

    box.innerHTML = `
      <h3>Rates unavailable</h3>

      <p class="muted">
        Please check your connection and try again.
      </p>
    `;
  }
}

/* =========================================================
   TRANSACTION MODAL
   ========================================================= */

function openModal(transaction = null) {

  const modal = $("#transactionModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("hidden");

  $("#modalTitle").textContent =
    transaction
      ? "Edit transaction"
      : "Add transaction";

  $("#transactionId").value =
    transaction?.id || "";

  $("#amountInput").value =
    transaction?.amount || "";

  $("#categoryInput").value =
    transaction?.category || "Food";

  $("#dateInput").value =
    transaction?.date ||
    new Date()
      .toISOString()
      .slice(0, 10);

  $("#noteInput").value =
    transaction?.note || "";

  state.editType =
    transaction?.type || "expense";

  document
    .querySelectorAll(".type-toggle button")
    .forEach((button) => {

      button.classList.toggle(
        "active",
        button.dataset.type ===
          state.editType
      );
    });
}

function closeModal() {

  const modal =
    $("#transactionModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}

/* =========================================================
   AUTH TABS
   ========================================================= */

document
  .querySelectorAll("[data-auth]")
  .forEach((button) => {

    button.onclick = () => {

      state.authMode =
        button.dataset.auth;

      document
        .querySelectorAll(".tab")
        .forEach((tab) => {
          tab.classList.toggle(
            "active",
            tab === button
          );
        });

      $("#nameField")?.classList.toggle(
        "hidden",
        state.authMode === "login"
      );

      const authSubmit =
        $("#authSubmit");

      if (authSubmit) {
        authSubmit.textContent =
          state.authMode === "login"
            ? "Continue"
            : "Create account";
      }
    };
  });

/* =========================================================
   LOGIN / REGISTER
   ========================================================= */

const authForm = $("#authForm");

if (authForm) {

  authForm.onsubmit = (event) => {

    event.preventDefault();

    const email =
      $("#emailInput")?.value.trim() || "";

    const password =
      $("#passwordInput")?.value || "";

    if (password.length < 6) {
      toast(
        "Password must be at least 6 characters"
      );
      return;
    }

    state.user = {
      name:
        state.authMode === "register"
          ? (
              $("#nameInput")?.value.trim() ||
              "Alex Morgan"
            )
          : "Alex Morgan",

      email
    };

    setStorage(
      "spendwise_user",
      JSON.stringify(state.user)
    );

    showApp();

    toast(
      state.authMode === "login"
        ? "Welcome back!"
        : "Account created successfully"
    );
  };
}

/* =========================================================
   DEMO LOGIN
   ========================================================= */

const demoLogin = $("#demoLogin");

if (demoLogin) {

  demoLogin.onclick = () => {

    state.user = {
      name: "Alex Morgan",
      email: "alex@spendwise.demo"
    };

    setStorage(
      "spendwise_user",
      JSON.stringify(state.user)
    );

    showApp();
    toast("Demo account loaded");
  };
}

/* =========================================================
   NAVIGATION
   ========================================================= */

document
  .querySelectorAll("[data-page]")
  .forEach((button) => {

    button.onclick = () => {

      state.page =
        button.dataset.page;

      renderPage();

      $(".sidebar")
        ?.classList.remove("open");
    };
  });

/* =========================================================
   LOGOUT / MOBILE MENU
   ========================================================= */

$("#logout")?.addEventListener(
  "click",
  () => {

    state.user = null;
    removeStorage("spendwise_user");

    showAuth();

    toast(
      "You have been logged out"
    );
  }
);

$("#menuButton")?.addEventListener(
  "click",
  () => {
    $(".sidebar")
      ?.classList.toggle("open");
  }
);

$("#mobileProfile")?.addEventListener(
  "click",
  () => {

    state.page = "settings";

    renderPage();
  }
);

/* =========================================================
   MODAL EVENTS
   ========================================================= */

$(".close-modal")?.addEventListener(
  "click",
  closeModal
);

$("#transactionModal")?.addEventListener(
  "click",
  (event) => {

    if (
      event.target.id ===
      "transactionModal"
    ) {
      closeModal();
    }
  }
);

document
  .querySelectorAll(".type-toggle button")
  .forEach((button) => {

    button.onclick = () => {

      state.editType =
        button.dataset.type;

      document
        .querySelectorAll(".type-toggle button")
        .forEach((item) => {

          item.classList.toggle(
            "active",
            item === button
          );
        });
    };
  });

/* =========================================================
   TRANSACTION FORM
   ========================================================= */

const transactionForm =
  $("#transactionForm");

if (transactionForm) {

  transactionForm.onsubmit = (event) => {

    event.preventDefault();

    const transactionId =
      $("#transactionId")?.value;

    const item = {

      id: transactionId
        ? Number(transactionId)
        : Date.now(),

      type: state.editType,

      amount:
        Number(
          $("#amountInput")?.value || 0
        ),

      category:
        $("#categoryInput")?.value ||
        "Food",

      note:
        $("#noteInput")?.value.trim() ||
        $("#categoryInput")?.value ||
        "Food",

      date:
        $("#dateInput")?.value ||
        new Date()
          .toISOString()
          .slice(0, 10)
    };

    const index =
      state.transactions.findIndex(
        (transaction) =>
          transaction.id === item.id
      );

    if (index >= 0) {
      state.transactions[index] = item;
    } else {
      state.transactions.push(item);
    }

    save();
    closeModal();
    renderPage();

    toast(
      index >= 0
        ? "Transaction updated"
        : "Transaction saved"
    );
  };
}

/* =========================================================
   START APP
   ========================================================= */

const startApp =
  $("#startApp");

if (startApp) {

  startApp.onclick = () => {

    setStorage(
      "spendwise_onboarded",
      "1"
    );

    $("#introView")
      ?.classList.add("hidden");

    showAuth();
  };
}

/* =========================================================
   INITIAL APP LOAD
   ========================================================= */

if (state.user) {

  showApp();

} else if (
  !getStorage("spendwise_onboarded")
) {

  $("#authView")
    ?.classList.add("hidden");

  $("#introView")
    ?.classList.remove("hidden");

} else {

  showAuth();
}