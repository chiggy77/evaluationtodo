const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const { todoRouter } = require("./routes/blog.routes");
const { authentication } = require("./middlewares/authentication");

const PORT=3001;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({message:"Base Api route"});
});

app.post("/signup", async (req, res) => {
  const { name, email, password, contact } = req.body;

  // Get the user's IP address from the request
  const ipAddress = req.ip;

  bcrypt.hash(password, 4, async function (err, hash) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong! Try again later..." });
    }

    const newUser = new UserModel({
      name,
      email,
      password: hash,
      contact,
      ipAddress, // Automatically set the IP address
    });

    try {
      await newUser.save();
      res.json({ message: "Signup successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong! Try again later..." });
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  console.log(user);

  if (!user) {
    res.send({message:"sign up first!!!"});
  } else {
    const hashed_password = user.password;
    bcrypt.compare(password, hashed_password, function (err, result) {
      if (result) {
        let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY);
        res.send({ message: "login successful", token: token });
      } else {
        res.send({message:"login failed,Invalid credentials.."});
      }
    });
  }
});

app.use("/todos", authentication, todoRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connection established successfully");
  } catch (error) {
    console.log("Error connecting with mongoose db", error);
  }
  console.log(`listening to server http://localhost:${PORT}`);
});
