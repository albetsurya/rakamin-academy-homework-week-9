const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { swaggerUi, specs } = require("./swagger")

const app = express();
const PORT = process.env.PORT || 3000;


app.use(morgan("combined"));

app.use(bodyParser.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);


app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
