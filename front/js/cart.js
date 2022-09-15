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
  for (let product of cart) {
    const kanapImage = document.querySelector("img");
    const response = await fetch(
      `http://localhost:3000/api/products/${product.id}`
    );
    const apiProduct = await response.json();

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
  }
}

//Modifier la quantité et qu'elle soit modifiée dans le localstorage

//Activer l'option supprimer sur la page panier et dans le localstorage

//Ecouter la modification de la quantité au click

//Activer le total quantité avec le click

//Activer le total prix après écoute du total quantité

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
