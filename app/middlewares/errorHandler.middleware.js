const errorHandler = {
  _400: (errors, req, res) => {
    res.status(400).json({
      type: "Bad request",
      errors,
    });
  },

  _401: (errors, req, res) => {
    res.status(400).json({
      type: "Unauthorized",
      errors,
    });
  },

  _403: (errors, req, res) => {
    res.status(400).json({
      type: "Forbidden",
      errors,
    });
  },

  _404: (Model, req, res) => {
    res.status(404).json({
      type: "Not found",
      error: `${Model.name} not found. Please verify the provided ID.`,
    });
  },

  _500: (error, req, res) => {
    console.trace(error);
    res.status(500).json({
      type: "Internal Server Error",
      error: error.toString(),
    });
  },
};

export default errorHandler;
