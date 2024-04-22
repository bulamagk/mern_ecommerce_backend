const path = require("path");

const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cors = require("cors");

// Routes imports
const usersRoutes = require("./routes/usersRoute");
const customersRoutes = require("./routes/customersRoute");
const productsRoutes = require("./routes/productsRoute");
const categoriesRoutes = require("./routes/categoriesRoute");
const ordersRoutes = require("./routes/ordersRoute");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "html", "welcome.html"));
});
app.use("/api/users", usersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to mongoDB and start server
connectDB(app, PORT);
