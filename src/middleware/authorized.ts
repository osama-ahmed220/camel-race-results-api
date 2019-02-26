import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.json({
        message: "No token provided.",
        bool: false
      });
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return res.json({
          message: "Failed to authenticate token.",
          bool: false
        });
      }
      const currentDateObj = new Date();
      if (currentDateObj.getTime() > (decoded as any).expiresIn) {
        return res.json({
          message: "Token Expired.",
          bool: false
        });
      }
      next();
      return;
    });
    return;
  } catch (e) {
    return res.json(e);
  }
};
