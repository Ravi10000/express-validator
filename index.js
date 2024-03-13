import express from "express";
import cookieParser from "cookie-parser";
import { validateBoolean, validateInt, validateReq } from "./validators.js";

const app = express();

app.use(cookieParser());
app.get("/", (req, res) => {
  res.cookie("accessToken", "secure_cookie_token", {
    httpOnly: true,
    maxAge: 240000000,
  });
  res.status(201).json({
    status: "success",
    message: "cookie created successfully",
  });
});
app.post(
  ["/", "/:id", "/:id/:testId"],
  [validateInt(":id", { required: true, min: 1, max: 10 })],
  [validateInt(":testId", { required: true, min: 1, max: 10 })],
  [validateInt("?age", { required: true, min: 1, max: 10 })],
  [validateBoolean("_isMale", true)],
  [validateBoolean("_age2", { required: true })],
  validateReq,
  (req, res) => {
    console.log({ auth: req.get("authorization") });
    console.log({ cookies: req.cookies });
    res.status(200).json({
      status: "success",
      message: "request received",
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
      cookies: req.cookies,
    });
  }
);

app.listen(
  5070,
  ((...props) => {
    // props will always be an array of arguments
    console.log("served");
    console.log({ props });
    return () => {};
  })({ hi: "hi" })
);
