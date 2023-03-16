//Lien page accueil, page Produit
function getProductId() {
  const url = new URL(window.location.href);
  const productUrl = new URLSearchParams(url.search);
  const productId = productUrl.get("id");
  return productId;
}
//Lien page Cart et page produit
function getCart() {
  //récupérer les infos dans le localStorage
  let cart = localStorage.getItem("cart");
  if (!cart) {
    cart = "[]";
  }
  return JSON.parse(cart);
}

//Récupérer les informations du produit via l'Api
async function getProduct(productId) {
  const response = await fetch(
    `http://localhost:3000/api/products/${productId}`
  );
  const product = await response.json();
  return product;
}

//Modifier le HTML de la page produit
function generateHTML(product) {
  const imageContainer =
    document.getElementsByClassName("item__img")[0].children[0];
  imageContainer.src = product.imageUrl;

  const kanapTitleContainer = document.getElementById("title");
  kanapTitleContainer.innerHTML = product.name;

  document.querySelector("#price").innerHTML = product.price;

  const DescriptionContainer = document.getElementById("description");
  DescriptionContainer.innerHTML = product.description;

  const colorSelect = document.getElementById("colors");
  let colorFirstOption = colorSelect.children[0];

  for (let i = 1; i < product.colors.length; i++) {
    const optionEl = document.createElement("option");
    optionEl.value = product.colors[i - 1];
    optionEl.innerHTML = product.colors[i - 1];
    colorFirstOption.after(optionEl);
    console.log(optionEl);
  }
}

//Afficher les informations du produit
async function displayProduct() {
  try {
    const productId = getProductId();
    const product = await getProduct(productId);
    generateHTML(product);
  } catch (error) {
    console.error(error);
  }
}

function addProductToCart() {
  //On ajoute l'id du produit, le prix la couleur ainsi que la quantité à mon panier
  const productId = getProductId();
  const productPrice = document.getElementById("price").value;
  const productColor = document.getElementById("colors").value;
  const productQuantity = document.getElementById("quantity").value;

  //on vérifie qu'une couleur ainsi qu'une quantité ont été obligatoirement définies
  const isColorSelected =
    productColor !== "" && productColor !== undefined && productColor !== null;
  const isQuantitySelected =
    productQuantity !== "" &&
    productQuantity != 0 &&
    productQuantity !== undefined &&
    productQuantity !== null;
  if (!isColorSelected) {
    alert("Choisissez une couleur !");
  } else if (!isQuantitySelected) {
    alert("Choisissez une quantité !");
  } else if (productQuantity < 1 || productQuantity > 100) {
    alert("Choisissez une quantité entre 1 et 100 !");
  } else {
    let initialCart = getCart();
    let isProductExist = false;
    for (let i = 0; i < initialCart.length; i++) {
      if (
        initialCart[i].id === productId &&
        initialCart[i].color === productColor &&
        initialCart[i].price === productPrice
      ) {
        initialCart[i].quantity =
          initialCart[i].quantity + parseInt(productQuantity);
        isProductExist = true;
        break;
      }
    }
    //on modifie le panier en y ajoutant notre produit
    if (!isProductExist) {
      const newProduct = {
        id: productId,
        color: productColor,
        price: productPrice,
        quantity: parseInt(productQuantity),
      };
      initialCart.push(newProduct);
    }

    //on enregistre le panier
    localStorage.setItem("cart", JSON.stringify(initialCart));
    alert("Produit bien enregistré");
    window.location.href = `cart.html`;
  }
}

displayProduct();
const button = document.querySelector("#addToCart");
button.addEventListener("click", addProductToCart);
