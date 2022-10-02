//Récupérer le numéro de confirmation de commande via l'API

function getOrderNumber() {
  const url = new URL(window.location.href);
  const orderUrl = new URLSearchParams(url.search);
  const orderId = orderUrl.get("id");
  return orderId;
}

//Intégrer un numéro de confirmation de commande à la page confirmation
function displayOrderNumber() {
  //afficher le contenu du panier enregitré dans le localStorage
  const orderId = getOrderNumber();
  const spanId = document.getElementById("orderId");
  spanId.innerHTML = orderId;
}
displayOrderNumber();
