const { User, Book } = require("../models");
const { AuthentificationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
        }).select("-__v -password");
        return userData;
      }
      throw new AuthentificationError("NotLoggedIn");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthentificationError("Insufficient Login Credentials.");
      }
      const correctpw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw newAuthenticationError("Insufficient Login Credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};
