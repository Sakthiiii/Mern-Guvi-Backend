const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const auth=require('../middleware/auth')

const { check, validationResult } = require("express-validator");
const User = require("../models/User");


let jwtsecret = "mysecretwebtoken";

//POST METHOD

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please Include a Valid Email").isEmail(),
    check(
      "password",
      "Please Enter password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already Exists...." }] });
      }
      user = new User({
        name,
        email,
        password,
      });
      //Encrypt Password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      ///JWT

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, jwtsecret, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      res.status(404).send("Internal Server Error...");
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      Pass the auth from middleware here to get token
router.get("/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//POST User/auth
//Authentication user & get token /login user

router.post(
  "/auth",
  [
    check("email", "Please Includes a valid email").isEmail(),
    check("password", "Password is requied").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      //See if user exists//
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalied Creadentials" }] });
      }

      //is matching with password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalied Creadentials" }] });
      }

      //Return jwt
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, jwtsecret, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Post");
    }
  }
);

module.exports = router;
