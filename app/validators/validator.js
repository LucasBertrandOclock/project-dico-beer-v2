const validate = (schema, source) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      errorHandler._400(error, req, res);
    }
    next();
  };
};

export default validate;
