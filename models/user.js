const db = require("../db");
const bcrypt = require("bcrypt");

const User = {
  getAllUsers: async () => {
    try {
      const users = await db.query("SELECT * FROM users");
      return users.rows;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (id, email, password, gender, role, requestingUserId) => {
    try {
      if (String(requestingUserId) !== String(id)) {
        throw {
          message:
            "Unauthorized: You don't have permission to update this user",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await db.query(
        "UPDATE users SET email=$1, password=$2, gender=$3, role=$4 WHERE id=$5 RETURNING *",
        [email, hashedPassword, gender, role, id]
      );

      return updatedUser[0];
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id, loggedInUserId) => {
    try {
      const deletedUser = await db.query(
        "DELETE FROM users WHERE id=$1 AND id=$2 RETURNING *",
        [id, loggedInUserId]
      );

      if (deletedUser.length === 0) {
        throw {
          message:
            "User not found or you don't have permission to delete this user",
        };
      }

      return deletedUser[0];
    } catch (error) {
      throw error;
    }
  },
  getUsersWithPagination: async (page, limit) => {
    try {
      const query = "SELECT * FROM users OFFSET $1 LIMIT $2";
      const offset = (page - 1) * limit;
      const users = await db.query(query, [offset, limit]);
      return users.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;
