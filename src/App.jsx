import { useMemo, useState } from "react";

import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import "./App.css";


// ======================================================
// INITIAL TRANSACTIONS
// ======================================================

const initialTransactions = [
  {
    id: 1,
    title: "Salary",
    category: "Income",
    amount: 2500,
    type: "income",
    date: "2026-09-01",
  },

  {
    id: 2,
    title: "Groceries",
    category: "Food",
    amount: 120,
    type: "expense",
    date: "2026-09-02",
  },

  {
    id: 3,
    title: "Netflix",
    category: "Entertainment",
    amount: 18,
    type: "expense",
    date: "2026-09-02",
  },

  {
    id: 4,
    title: "Uber",
    category: "Transport",
    amount: 35,
    type: "expense",
    date: "2026-09-03",
  },
];


// ======================================================
// APP
// ======================================================

function App() {

  // ----------------------------------------------------
  // PAGE STATE
  // ----------------------------------------------------

  const [activePage, setActivePage] = useState("dashboard");


  // ----------------------------------------------------
  // TRANSACTIONS
  // ----------------------------------------------------

  const [transactions, setTransactions] = useState(() => {

    const savedTransactions =
      localStorage.getItem("expenseTransactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : initialTransactions;
  });


  // ----------------------------------------------------
  // SEARCH
  // ----------------------------------------------------

  const [search, setSearch] = useState("");


  // ----------------------------------------------------
  // MODAL
  // ----------------------------------------------------

  const [showModal, setShowModal] = useState(false);


  // ----------------------------------------------------
  // FORM
  // ----------------------------------------------------

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });


  // ====================================================
  // SAVE TRANSACTIONS
  // ====================================================

  const saveTransactions = (newTransactions) => {

    setTransactions(newTransactions);

    localStorage.setItem(
      "expenseTransactions",
      JSON.stringify(newTransactions)
    );
  };


  // ====================================================
  // TOTAL INCOME
  // ====================================================

  const totalIncome = useMemo(() => {

    return transactions

      .filter(
        (transaction) =>
          transaction.type === "income"
      )

      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

  }, [transactions]);


  // ====================================================
  // TOTAL EXPENSE
  // ====================================================

  const totalExpense = useMemo(() => {

    return transactions

      .filter(
        (transaction) =>
          transaction.type === "expense"
      )

      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      );

  }, [transactions]);


  // ====================================================
  // BALANCE
  // ====================================================

  const balance = totalIncome - totalExpense;


  // ====================================================
  // PAGE TRANSACTIONS
  // ====================================================

  const pageTransactions = useMemo(() => {

    let result = transactions;


    // Expenses page
    if (activePage === "expenses") {

      result = transactions.filter(
        (transaction) =>
          transaction.type === "expense"
      );
    }


    // Income page
    if (activePage === "income") {

      result = transactions.filter(
        (transaction) =>
          transaction.type === "income"
      );
    }


    // Search
    if (search.trim() !== "") {

      result = result.filter(
        (transaction) =>
          transaction.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          transaction.category
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }


    return result;

  }, [transactions, activePage, search]);


  // ====================================================
  // EXPENSE CHART DATA
  // ====================================================

  const chartData = useMemo(() => {

    const categories = {};

    transactions

      .filter(
        (transaction) =>
          transaction.type === "expense"
      )

      .forEach((transaction) => {

        const category = transaction.category;

        if (!categories[category]) {
          categories[category] = 0;
        }

        categories[category] += Number(
          transaction.amount
        );
      });


    return Object.entries(categories).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

  }, [transactions]);


  // ====================================================
  // CHART COLORS
  // ====================================================

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#ec4899",
  ];


  // ====================================================
  // ADD TRANSACTION
  // ====================================================

  const handleSubmit = (e) => {

    e.preventDefault();


    // Validation
    if (
      !form.title.trim() ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {

      alert(
        "Please enter a valid transaction name and amount."
      );

      return;
    }


    // Create transaction
    const newTransaction = {

      id: Date.now(),

      title: form.title.trim(),

      amount: Number(form.amount),

      category: form.category,

      type: form.type,

      date: form.date,
    };


    // Add transaction
    const updatedTransactions = [
      newTransaction,
      ...transactions,
    ];


    saveTransactions(updatedTransactions);


    // Reset form
    setForm({

      title: "",

      amount: "",

      category: "Food",

      type: "expense",

      date: new Date()
        .toISOString()
        .split("T")[0],
    });


    // Close modal
    setShowModal(false);
  };


  // ====================================================
  // DELETE TRANSACTION
  // ====================================================

  const deleteTransaction = (id) => {

    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !== id
      );


    saveTransactions(updatedTransactions);
  };


  // ====================================================
  // PAGE TITLE
  // ====================================================

  const getPageTitle = () => {

    if (activePage === "expenses") {
      return "Expenses";
    }

    if (activePage === "income") {
      return "Income";
    }

    return "Dashboard";
  };


  // ====================================================
  // PAGE DESCRIPTION
  // ====================================================

  const getPageDescription = () => {

    if (activePage === "expenses") {
      return "View and manage all your expenses.";
    }

    if (activePage === "income") {
      return "View and manage all your income.";
    }

    return "Manage your finances in one place.";
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="app">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="logo">

          <div className="logo-icon">

            <Wallet size={22} />

          </div>

          <span>
            ExpenseFlow
          </span>

        </div>


        {/* NAVIGATION */}

        <nav>


          {/* DASHBOARD */}

          <button
            className={
              activePage === "dashboard"
                ? "nav-button active"
                : "nav-button"
            }

            onClick={() => {

              setActivePage("dashboard");

              setSearch("");

            }}
          >

            <LayoutDashboard size={19} />

            <span>
              Dashboard
            </span>

          </button>


          {/* EXPENSES */}

          <button
            className={
              activePage === "expenses"
                ? "nav-button active"
                : "nav-button"
            }

            onClick={() => {

              setActivePage("expenses");

              setSearch("");

            }}
          >

            <TrendingDown size={19} />

            <span>
              Expenses
            </span>

          </button>


          {/* INCOME */}

          <button
            className={
              activePage === "income"
                ? "nav-button active"
                : "nav-button"
            }

            onClick={() => {

              setActivePage("income");

              setSearch("");

            }}
          >

            <TrendingUp size={19} />

            <span>
              Income
            </span>

          </button>


        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="mini-card">

            <CircleDollarSign size={28} />

            <div>

              <strong>
                Smart Finance
              </strong>

              <span>
                Track every dollar
              </span>

            </div>

          </div>

        </div>

      </aside>



      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="main">


        {/* ==================================================
            TOP BAR
        ================================================== */}

        <header className="topbar">

          <div>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              {getPageDescription()}
            </p>

          </div>


          <button
            className="add-button"

            onClick={() =>
              setShowModal(true)
            }
          >

            <Plus size={19} />

            Add Transaction

          </button>

        </header>



        {/* ==================================================
            DASHBOARD STATS
        ================================================== */}

        <section className="stats-grid">


          {/* BALANCE */}

          <div className="stat-card">

            <div className="stat-icon balance">

              <Wallet size={22} />

            </div>


            <div>

              <p>
                Total Balance
              </p>

              <h2>
                ${balance.toLocaleString()}
              </h2>

              <span className="positive">
                Available balance
              </span>

            </div>

          </div>



          {/* INCOME */}

          <div className="stat-card">

            <div className="stat-icon income">

              <ArrowUpRight size={22} />

            </div>


            <div>

              <p>
                Total Income
              </p>

              <h2>
                ${totalIncome.toLocaleString()}
              </h2>

              <span className="positive">
                Money received
              </span>

            </div>

          </div>



          {/* EXPENSE */}

          <div className="stat-card">

            <div className="stat-icon expense">

              <ArrowDownRight size={22} />

            </div>


            <div>

              <p>
                Total Expenses
              </p>

              <h2>
                ${totalExpense.toLocaleString()}
              </h2>

              <span className="negative">
                Money spent
              </span>

            </div>

          </div>


        </section>



        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="content-grid">


          {/* ==================================================
              TRANSACTIONS
          ================================================== */}

          <div className="panel transactions-panel">


            {/* HEADER */}

            <div className="panel-header">

              <div>

                <h3>

                  {activePage === "dashboard"
                    ? "Recent Transactions"
                    : activePage === "expenses"
                    ? "All Expenses"
                    : "All Income"}

                </h3>

                <p>

                  {activePage === "dashboard"
                    ? "Your latest financial activity"
                    : activePage === "expenses"
                    ? "All your recorded expenses"
                    : "All your recorded income"}

                </p>

              </div>


              {/* SEARCH */}

              <div className="search-box">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>



            {/* TRANSACTION LIST */}

            <div className="transactions">


              {pageTransactions.length === 0 ? (

                <div className="empty">

                  <p>
                    No transactions found.
                  </p>

                  <button
                    className="empty-button"
                    onClick={() =>
                      setShowModal(true)
                    }
                  >
                    <Plus size={16} />
                    Add Transaction
                  </button>

                </div>

              ) : (

                pageTransactions.map(
                  (transaction) => (

                    <div
                      className="transaction"
                      key={transaction.id}
                    >


                      {/* ICON */}

                      <div
                        className={
                          `transaction-icon ${transaction.type}`
                        }
                      >

                        {transaction.type ===
                        "income" ? (

                          <ArrowUpRight
                            size={20}
                          />

                        ) : (

                          <ArrowDownRight
                            size={20}
                          />

                        )}

                      </div>



                      {/* INFO */}

                      <div className="transaction-info">

                        <strong>
                          {transaction.title}
                        </strong>

                        <span>

                          {transaction.category}

                          {" • "}

                          {transaction.date}

                        </span>

                      </div>



                      {/* AMOUNT */}

                      <div
                        className={
                          `transaction-amount ${transaction.type}`
                        }
                      >

                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}

                        $

                        {Number(
                          transaction.amount
                        ).toLocaleString()}

                      </div>



                      {/* DELETE */}

                      <button
                        className="delete-button"

                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }

                        title="Delete transaction"
                      >

                        <Trash2 size={17} />

                      </button>


                    </div>

                  )
                )

              )}

            </div>

          </div>



          {/* ==================================================
              EXPENSE CHART
          ================================================== */}

          <div className="panel chart-panel">


            <div className="panel-header">

              <div>

                <h3>
                  Expense Breakdown
                </h3>

                <p>
                  Where your money goes
                </p>

              </div>

            </div>


            {/* CHART */}

            <div className="chart">

              {chartData.length === 0 ? (

                <div className="empty-chart">

                  No expense data yet.

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >

                  <PieChart>

                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >

                      {chartData.map(
                        (entry, index) => (

                          <Cell
                            key={
                              `cell-${index}`
                            }

                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              )}

            </div>



            {/* LEGEND */}

            <div className="legend">

              {chartData.map(
                (item, index) => (

                  <div
                    className="legend-item"
                    key={item.name}
                  >

                    <span
                      className="legend-dot"

                      style={{
                        background:
                          COLORS[
                            index %
                            COLORS.length
                          ],
                      }}
                    />

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      ${item.value.toLocaleString()}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>


        </section>


      </main>



      {/* ==================================================
          ADD TRANSACTION MODAL
      ================================================== */}

      {showModal && (

        <div
          className="modal-overlay"

          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setShowModal(false);
            }

          }}
        >


          <div className="modal">


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  Add Transaction
                </h2>

                <p>
                  Record your income or expense.
                </p>

              </div>


              <button
                className="close-button"

                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>



            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >


              {/* TITLE */}

              <label>

                Transaction Name

                <input
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  value={form.title}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }

                  autoFocus
                />

              </label>



              {/* AMOUNT */}

              <label>

                Amount

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.amount}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount:
                        e.target.value,
                    })
                  }
                />

              </label>



              {/* TYPE */}

              <label>

                Type

                <select
                  value={form.type}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      type:
                        e.target.value,
                    })
                  }
                >

                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>

                </select>

              </label>



              {/* CATEGORY */}

              <label>

                Category

                <select
                  value={form.category}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Food
                  </option>

                  <option>
                    Transport
                  </option>

                  <option>
                    Entertainment
                  </option>

                  <option>
                    Shopping
                  </option>

                  <option>
                    Bills
                  </option>

                  <option>
                    Salary
                  </option>

                  <option>
                    Freelance
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </label>



              {/* DATE */}

              <label>

                Date

                <input
                  type="date"
                  value={form.date}

                  onChange={(e) =>
                    setForm({
                      ...form,
                      date:
                        e.target.value,
                    })
                  }
                />

              </label>



              {/* SUBMIT */}

              <button
                className="submit-button"
                type="submit"
              >

                <Plus size={18} />

                Add Transaction

              </button>


            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default App;