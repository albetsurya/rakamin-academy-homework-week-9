const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const jwt = require("jsonwebtoken");


/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      type: object
 *      required:
 *        - title
 *        - genres
 *        - year
 *      properties:
 *        id:
 *          type: integer
 *          description: The id of the movie
 *        title:
 *          type: string
 *          description: The title of the movie
 *        genres:
 *          type: string
 *          description: The genres of the movie
 *        year:
 *          type: string
 *          description: The year that was the movie released
 *      example:
 *        id: 1
 *        title: Reckless
 *        genres: Comedy|Drama|Romance
 *        year: 2001
 */

/**
 * @swagger
 * tags:
 *  name: Movies
 *  description: The list of movies around the world
 * /movies:
 *  get:
 *    summary: Show 10 list of movies
 *    tags: [Movies]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    response:
 *      200:
 *        description: The created movie.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      500:
 *        description: Some server error
 *  post:
 *    summary: Create a new movie
 *    tags: [Movies]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    response:
 *      200:
 *        description: The created movie.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      400:
 *        description: Some client error
 *  put:
 *    summary: Update a spicified movie
 *    tags: [Movies]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    response:
 *      200:
 *        description: Movie updated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      400:
 *        description: Some client error
 *  delete:
 *    summary: Delete a specified movie
 *    tags: [Movies]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Movie'
 *    response:
 *      200:
 *        description: Movie deleted.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      500:
 *        description: Some server error
 */

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decodedData = jwt.verify(token, "rahasianegara");

    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

router.get("/paginate", verifyToken, async (req, res) => {
  try {
    const movies = await Movie.getMoviesWithPagination(
      req.query.page,
      req.query.limit
    );
    res.json({ movies: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  const { title, genres, year } = req.body;

  try {
    const newMovie = await Movie.createMovie(
      title,
      genres,
      year,
      req.headers.authorization.split(" ")[1]
    );
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;

  try {
    const updatedMovie = await Movie.updateMovie(
      id,
      title,
      genres,
      year,
      req.headers.authorization.split(" ")[1]
    );
    console.log(updatedMovie)
    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovie = await Movie.deleteMovie(
      id,
      req.headers.authorization.split(" ")[1]
    );
    res.json(deletedMovie);
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
