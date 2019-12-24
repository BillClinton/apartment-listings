const errorFormat = errors => {
  console.log('#########################got here####################');
  console.log(errors);
  console.log('#########################got here####################');
  const errorMessage = { errorCount: errors.length, errors: [] };
  errors.forEach(error => {
    const item = {};
    item[error.path] = error.message;
    errorMessage.errors.push(item);
  });
  return errorMessage;
};

module.exports = errorFormat;
