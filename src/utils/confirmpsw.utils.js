function confirmPassword(value, newPassword) {
 if(value !== newPassword) {
   throw new Error("Las contraseñas no coinciden");
 }
 return true;
}
module.exports = { confirmPassword };