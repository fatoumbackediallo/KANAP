function getCart() {
  //récupérer les infos dans le localStorage
  let cart = localStorage.getItem("cart");
  if (!cart) {
    cart = "[]";
  }
  return JSON.parse(cart);
}

function generateHTML(cart) {}

function displayCart() {
  const cart = getCart();
  generateHTML(cart);
}

displayCart();
module.exports = { getCart };
