const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

const { User, RefreshToken } = require("../../models");

module.exports = {
  async register(req, res) {
    const schema = {
      name: "string|empty:false",
      email: "email|empty:false",
      password: "string|min:6",
      profession: "string|optional",
    };

    const validate = v.validate(req.body, schema);

    if (validate.length)
      return res.status(400).json({ status: "error", message: validate });

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (user)
      return res
        .status(409)
        .json({ status: "error", message: "email already exist" });

    const password = await bcrypt.hash(req.body.password, 10);

    const { name, email, profession, role = "student" } = req.body;

    const data = {
      password,
      name,
      email,
      profession,
      role,
    };

    const createUser = await User.create(data);

    return res.json({
      status: "success",
      data: {
        id: createUser.id,
      },
    });
  },

  async login(req, res) {
    const schema = {
      email: "email|empty:false",
      password: "string|min:6",
    };

    const validate = v.validate(req.body, schema);

    if (validate.length)
      return res.status(400).json({ status: "error", message: validate });

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword)
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });

    return res.json({
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        profession: user.profession,
        role: user.role,
      },
    });
  },

  async updateProfile(req, res) {
    const { name, email, profession, avatar } = req.body;

    const schema = {
      name: "string|empty:false",
      email: "email|empty:false",
      password: "string|min:6",
      profession: "string|optional",
      avatar: "string|optional",
    };

    const validate = v.validate(req.body, schema);

    if (validate.length)
      return res.status(400).json({ status: "error", message: validate });

    const user = await User.findByPk(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });

    if (email) {
      const checkEmail = await User.findOne({
        where: { email },
      });

      if (checkEmail && email !== user.email)
        return res
          .status(409)
          .json({ status: "error", message: "email already exist" });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const data = {
      password,
      name,
      email,
      profession,
      avatar,
    };

    await user.update(data);

    delete data.password;

    return res.json({
      status: "success",
      data,
    });
  },

  async getUser(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });

    return res.json({
      status: "success",
      data: user,
    });
  },

  async getUsers(req, res) {
    const userIds = req.query.user_ids || [];

    const sqlOptions = {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    };

    if (userIds.length) {
      sqlOptions.where = {
        id: userIds,
      };
    }

    const users = await User.findAll(sqlOptions);

    return res.json({
      status: "success",
      data: users,
    });
  },

  async logout(req, res) {
    const userId = req.body.user_id;

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });

    await RefreshToken.destroy({ where: { user_id: userId } });

    return res.json({
      status: "success",
      message: "refresh token deleted",
    });
  },
};
