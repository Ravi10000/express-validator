import { body, param, query, validationResult } from "express-validator";

const validators = {
  ":": param,
  "?": query,
  _: body,
};

function check(key) {
  const validator = validators[key.at(0)];
  if (!validator)
    throw new Error(
      "Missing type of key, append - [: for param] | [? for query] | [_ for body]"
    );
  console.log({ validator });
  return validator(key.slice(1));
}

export function validateBoolean(key, required = false) {
  if (!required)
    return check(key)
      .optional()
      .isBoolean()
      .withMessage(`${key.slice(1)} must be true or false`);
  return check(key)
    .isBoolean()
    .withMessage(`${key.slice(1)} must be true or false`)
    .notEmpty()
    .withMessage(`${key.slice(1)} required`);
}

export function validateInt(key, config) {
  let newConfig = {
    ...config,
    min: !config?.min && !config?.required ? 0 : config?.min || 1,
    max: config?.max || Infinity,
  };
  if (!config?.required)
    return check(key)
      .optional()
      .isInt(newConfig)
      .withMessage(
        `${key.slice(1)} must be between ${newConfig?.min}-${newConfig?.max}`
      );

  return check(key)
    .isInt(newConfig)
    .withMessage(
      `${key.slice(1)} must be between ${newConfig?.min}-${newConfig?.max}`
    )
    .notEmpty()
    .withMessage(`${key.slice(1)} required`);
}
export function validateString(key, config) {
  let newConfig = {
    ...config,
    min: !config?.min && !config?.required ? 0 : config?.min || 1,
    max: config?.max || Infinity,
  };
  if (!config?.required)
    return check(key)
      .optional()
      .isInt(newConfig)
      .withMessage(
        `${key.slice(1)} must be between ${newConfig?.min}-${newConfig?.max}`
      );

  return check(key)
    .isInt(newConfig)
    .withMessage(
      `${key.slice(1)} must be between ${newConfig?.min}-${newConfig?.max}`
    )
    .notEmpty()
    .withMessage(`${key.slice(1)} required`);
}

export function validateReq(req, res, next) {
  console.log({ body: req.body, query: req.query, params: req.params });
  const result = validationResult(req);
  if (result.isEmpty()) return next();

//   console.log({ erros: result.errors });

  const errors = {};
  const __help = {
    "!": "PLEASE DO NOT USE THESE MESSAGES IN YOUR CODE, THESE ARE FOR HINTS ONLY AND WILL NOT SHIP IN PRODUCTION. [:) HAPPY CODING!]",
  };

  result.errors.forEach((err) => {
    errors[err.path] = err.msg;
    __help[err.path] = `${err.msg} in ${err.location}, ${
      typeof err.value !== "undefined"
        ? "received " + err.value
        : "no value received"
    }`;
  });

  res.status(400).json({
    status: "error",
    message: "validation error",
    errors,
    __help,
  });
}
