import errorHandler from "./errorHandler.middleware.js";

const cw = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    errorHandler._500(error, req, res);
  }
};

export default cw;
