import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!req.email || !req.roles?.length) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" });
      }

      req.email = decoded.UserInfo.email;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};
