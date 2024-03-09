const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Auth = {
  registerUser: async (email, password, gender, role) => {
    try {
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      console.log("Existing User:", existingUser);
      console.log("Email:", email);

      if (existingUser.length > 0) {
        throw { message: "Email already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      const newUser = await db.query(
        "INSERT INTO users(email, password, gender, role) VALUES($1, $2, $3, $4) RETURNING *",
        [email, hashedPassword, gender, role]
      );

      return newUser[0];
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (email, password) => {
    try {
      const user = await db.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);
      if (!user.rows[0]) {
        throw { message: "Invalid email or password" };
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (!isValidPassword) {
        throw { message: "Invalid email or password" };
      }

      const token = jwt.sign(
        { userId: user.rows[0].id, role: user.rows[0].role },
        "rahasianegara",
        {
          expiresIn: "1h",
        }
      );
      return { user: user.rows[0], token };
    } catch (error) {
      throw error;
    }
  },
  verifyToken: async (token) => {
    try {
      const decodedData = jwt.verify(token, "rahasianegara");
      return decodedData;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Auth;