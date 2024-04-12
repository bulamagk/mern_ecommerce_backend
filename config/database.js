const mongoose = require("mongoose");

// Connect Database
const connectDB = async (app, PORT) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
