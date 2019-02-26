import express from "express";
import jwt from "jsonwebtoken";
import ProgramRoute from "./Program.route";
import config from "../config";
import authorized from "../middleware/authorized";
const Router = express.Router();

Router.post("/login", (_, res) => {
  try {
    const currentDateObj = new Date();
    const expiresIn = 60 * 60 * 24;
    const userID = currentDateObj.getTime();
    const userExpiresIn = userID + 1000 * expiresIn;
    const token = jwt.sign(
      {
        userID,
        expiresIn: userExpiresIn
      },
      config.secret,
      {
        expiresIn: expiresIn
      }
    );
    return res.json({
      message: "Succesfully Login",
      token: token,
      userID,
      bool: true
    });
  } catch (e) {
    return res.json(e);
  }
});
Router.use("/program", authorized, ProgramRoute);

export default Router;
