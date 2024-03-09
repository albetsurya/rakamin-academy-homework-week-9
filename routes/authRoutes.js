const express = require("express");
const router = express.Router();
const User = require("../models/auth");

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: The email of a user used for generating token
 *        password:
 *          type: string
 *          description: The password of a user used for generating token
 *      example:
 *        email: oainger0@craigslist.org
 *        password: KcAk6Mrg7DRM
 */

/**
 * @swagger
 * tags:
 *  name: Login
 *  description: Get a token used for authenticate and authorize a user
 * /login:
 *  post:
 *    summary: Generated a token for a user
 *    tags: [Login]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    response:
 *      200:
 *        description: Token generated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      500:
 *        description: Some server error
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    Register:
 *      type: object
 *      required:
 *        - email
 *        - gender
 *        - password
 *        - role
 *      properties:
 *        email:
 *          type: string
 *          description: The email of a user used for generating token
 *        gender:
 *          type: string
 *          description: The gender of a user used for generating token
 *        password:
 *          type: string
 *          description: The password of a user used for generating token
 *        role:
 *          type: string
 *          description: The role of a user used for generating token
 *      example:
 *        email: oainger0@craigslist.org
 *        gender: Female
 *        password: KcAk6Mrg7DRM
 *        role: Construction Worker
 */

/**
 * @swagger
 * tags:
 *  name: Register
 *  description: Get a token used for authenticate and authorize a user
 * /Register:
 *  post:
 *    summary: Generated a token for a user
 *    tags: [Register]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Register'
 *    response:
 *      200:
 *        description: Token generated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Register'
 *      500:
 *        description: Some server error
 */

router.post("/register", async (req, res) => {
  const { email, password, gender, role } = req.body;

  try {
    const newUser = await User.registerUser(email, password, gender, role);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.loginUser(email, password);

    const { user, token } = userData;
    console.log(userData);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/verify/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const decodedData = await User.verifyToken(token);
    res.json({ data: decodedData });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
