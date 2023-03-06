const isUUIDvalid = (id) => {
  const isValid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      id
    );
  return isValid;
};

module.exports = isUUIDvalid;
