const path = require("path");

const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();

// Routes imports
const usersRoutes = require("./routes/usersRoute");
const customersRoutes = require("./routes/customersRoute");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
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

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to mongoDB and start server
connectDB(app, PORT);
