function getCartFromLocalStorage() {
  //récupérer les infos dans le localStorage
  let cart = localStorage.getItem("cart");
  if (!cart) {
    cart = "[]";
  }
  return JSON.parse(cart);
}

function getCartItems() {
  const url = new URL(window.location.href);
  const cartUrl = new URLSearchParams(url.search);
  const cartItems = cartUrl.get("id");
  return cartItems;
}

async function generateHTML(cart) {
  //Ajouter l'image en modifiant le Html
  let totalQuantity = 0;
  let totalPrice = 0;
  for (let product of cart) {
    const kanapImage = document.querySelector("img");
    const response = await fetch(
      `http://localhost:3000/api/products/${product.id}`
    );
    const apiProduct = await response.json();

    //Calcul du total quantité et Prix
    totalQuantity += parseInt(product.quantity);
    totalPrice += parseInt(product.quantity) * parseInt(apiProduct.price);
    const quantityElement = document.getElementById("totalQuantity");
    quantityElement.innerHTML = totalQuantity;
    const priceElement = document.getElementById("totalPrice");
    priceElement.innerHTML = totalPrice;

    //Récupérer la section Cart Items
    // créer une balise article, lui donner une class, un data-id et un data-color
    const section = document.getElementById("cart__items");
    const article = document.createElement("article");
    article.className = "cart__item";
    article.dataset.id = product.id;
    article.dataset.color = product.color;
    const imageContent = document.createElement("div");
    imageContent.className = "cart__item__img";
    const productImage = document.createElement("img");
    productImage.src = apiProduct.imageUrl;
    productImage.alt = apiProduct.altTxt;
    imageContent.appendChild(productImage);
    article.appendChild(imageContent);
    section.appendChild(article);

    const descriptionContent = document.createElement("div");
    descriptionContent.className = "cart__item__content";
    const productDescriptionContent = document.createElement("div");
    productDescriptionContent.className = "cart__item__content__description";
    const productName = document.createElement("h2");
    productName.innerHTML = apiProduct.name;
    const productColor = document.createElement("p");
    productColor.innerHTML = product.color;
    const productPrice = document.createElement("p");
    productPrice.innerHTML = `${apiProduct.price} €`;
    productDescriptionContent.appendChild(productName);
    productDescriptionContent.appendChild(productColor);
    productDescriptionContent.appendChild(productPrice);
    descriptionContent.appendChild(productDescriptionContent);
    article.appendChild(descriptionContent);

    //créer l'input Quantité
    const settingsContent = document.createElement("div");
    settingsContent.className = "cart__item__content__settings";
    const settingsQuantityContent = document.createElement("div");
    settingsQuantityContent.className =
      "cart__item__content__settings__quantity";
    const productQuantityLabel = document.createElement("p");
    productQuantityLabel.innerHTML = "Qté : ";
    const productQuantity = document.createElement("input");
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("name", "itemQuantity");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");
    productQuantity.setAttribute("value", `${product.quantity}`);
    productQuantity.addEventListener("change", function () {
      product.quantity = productQuantity.value;
      if (productQuantity.value < 1 || productQuantity.value > 100) {
        alert("Choisissez une quantité entre 1 et 100 !");
      } else if (productQuantity.value >= 1 || productQuantity.value <= 100) {
        alert("Produit bien ajouté");
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });

    //Créer l'option supprimer
    const deleteContent = document.createElement("div");
    deleteContent.className = "cart__item__content__settings__delete";
    const deleteLabel = document.createElement("p");
    deleteLabel.className = "deleteItem";
    deleteLabel.innerHTML = "Supprimer";
    deleteContent.appendChild(deleteLabel);
    settingsQuantityContent.appendChild(productQuantityLabel);
    settingsQuantityContent.appendChild(productQuantity);
    settingsContent.appendChild(settingsQuantityContent);
    settingsContent.appendChild(deleteContent);
    article.appendChild(settingsContent);
    deleteContent.addEventListener("click", function () {
      const newCart = cart.filter(
        (p) => p.id != product.id || p.color != product.color
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      location.reload();
    });
  }
}

//Soumission du formulaire
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const fields = [firstName, lastName, address, city, email];

//Mise en place du
function selectRegex(orderForm) {
  const emailRegex = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)*@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  );
  const noSpecialCharacters = new RegExp(/^[a-zA-Z0-9\s+]*$/);

  const emailMessage = "Ajouter une adresse mail correcte";
  const noSpecialCharactersMessage = "Caractères spéciaux non acceptés";

  if (orderForm === email) {
    return [emailRegex, emailMessage];
  } else {
    return [noSpecialCharacters, noSpecialCharactersMessage];
  }
}

function showErrorMessage(orderForm, regex, errorMessage, errorSpan) {
  errorSpan.innerText = regex.test(orderForm.value) ? "" : errorMessage;
}

function getErrorMsg(element) {
  if (element === firstName)
    return document.getElementById("firstNameErrorMsg");
  if (element === lastName) return document.getElementById("lastNameErrorMsg");
  if (element === address) return document.getElementById("addressErrorMsg");
  if (element === city) return document.getElementById("cityErrorMsg");
  if (element === email) return document.getElementById("emailErrorMsg");
  throw new Error();
}
function checkInput(orderForm) {
  const [regex, errorMessage] = selectRegex(orderForm);
  const errorSpan = getErrorMsg(orderForm);
  showErrorMessage(orderForm, regex, errorMessage, errorSpan);
  const result = regex.test(orderForm.value);

  return result;
}

function e() {
  fields.forEach(function (orderForm) {
    orderForm.addEventListener("change", (orderForm) => {
      checkInput(orderForm.target);
    });
  });
}
e();

//valider la commande
function approveOrder() {
  const cart = getCartFromLocalStorage();
  const order = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };
  const body = { contact: order, products: cart.map((p) => p.id) };
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((order) => {
      window.location.assign(`confirmation.html?id=${order.orderId}`);
    });
}

//afficher les messages d'erreur
document.getElementById("order").addEventListener("click", (event) => {
  event.preventDefault();
  const allFieldsValid = fields.every(checkInput);
  if (allFieldsValid) {
    approveOrder();
  }
});

function displayCart() {
  //afficher la page panier
  try {
    //afficher le contenu du panier enregitré dans le localStorage
    const cart = getCartFromLocalStorage();
    //Ajouter et modifier des informations dans le Html
    generateHTML(cart);
  } catch (error) {
    console.error(error);
  }
}

displayCart();
