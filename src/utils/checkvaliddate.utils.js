function CheckValidDate(startDate, endDate){
const start = new Date(startDate);
const end = new Date(endDate);
      if (end <= start) {
        throw new Error("La hora de fin debe ser posterior a la de inicio");
      }
      return true;
}

module.exports = { CheckValidDate };