function getMaxAge(value) {
  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 13 || age > 120) {
    throw new Error("Debes tener entre 13 y 120 años");
  }
  return true;
}

module.exports = { getMaxAge };
