const db = require("../db");
const jwt = require("jsonwebtoken");

const Movie = {
  getAllMovies: async () => {
    try {
      const movies = await db.query("SELECT * FROM movies");
      return movies.rows;
    } catch (error) {
      throw error;
    }
  },

  createMovie: async (title, genres, year, token) => {
    try {
      const decodedData = jwt.verify(token, "rahasianegara");

      if (decodedData.role !== "Manager") {
        throw {
          message: "Unauthorized: Only admin users can create movies",
        };
      }

      const result = await db.query(
        "INSERT INTO movies(title, genres, year) VALUES($1, $2, $3) RETURNING *",
        [title, genres, year]
      );

      const newMovie = result.rows[0];
      return newMovie;
    } catch (error) {
      throw error;
    }
  },

  updateMovie: async (id, title, genres, year, token) => {
    try {

      const updatedMovie = await db.query(
        "UPDATE movies SET title=$1, genres=$2, year=$3 WHERE id=$4 RETURNING *",
        [title, genres, year, id]
      );
      return updatedMovie;
    } catch (error) {
      throw error;
    }
  },

  deleteMovie: async (id, token) => {
    try {

      const deletedMovie = await db.query(
        "DELETE FROM movies WHERE id=$1 RETURNING *",
        [id]
      );
      return deletedMovie;
    } catch (error) {
      throw error;
    }
  },

  getMoviesWithPagination: async (page, limit) => {
    try {
      const query = "SELECT * FROM movies OFFSET $1 LIMIT $2";
      const offset = (page - 1) * limit;
      const users = await db.query(query, [offset, limit]);
      return users.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Movie;
