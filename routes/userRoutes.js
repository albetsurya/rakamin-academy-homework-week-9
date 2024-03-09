const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - gender
 *        - password
 *        - role
 *      properties:
 *        id:
 *          type: integer
 *          description: The id of the user
 *        email:
 *          type: string
 *          description: The email of the user
 *        gender:
 *          type: string
 *          description: The gender of the user
 *        password:
 *          type: string
 *          description: The password the user
 *      example:
 *        id: 1
 *        email: oainger0@craigslist.org
 *        gender: Female
 *        password: KcAk6Mrg7DRM
 *        role: Construction Worker
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The list of users
 * /users:
 *  get:
 *    summary: Show 10 list of users
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    response:
 *      200:
 *        description: The created movie.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: Some server error
 *  post:
 *    summary: Create a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    response:
 *      200:
 *        description: The created user.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Some client error
 *  put:
 *    summary: Update a spicified user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    response:
 *      200:
 *        description: User updated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Some client error
 *  delete:
 *    summary: Delete a specified user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    response:
 *      200:
 *        description: User deleted.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: Some server error
 */


router.get("/", async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password, gender, role } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = jwt.verify(token, "rahasianegara");

    const updatedUser = await User.updateUser(
      id,
      email,
      password,
      gender,
      role,
      decodedData.userId
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedData = jwt.verify(token, "rahasianegara");

    const deletedUser = await User.deleteUser(id, decodedData.userId);
    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/paginate", async (req, res) => {
  try {

    const users = await User.getUsersWithPagination(
      req.query.page,
      req.query.limit
    );

    res.json({ users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;