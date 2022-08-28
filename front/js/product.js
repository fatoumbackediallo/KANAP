//Lien page accueil, page Produit
function getProductId() {
  const url = new URL(window.location.href);
  const productUrl = new URLSearchParams(url.search);
  const productId = productUrl.get("id");
  return productId;
}

function getCart() {
  //récupérer les infos dans le localStorage
  let cart = localStorage.getItem("cart");
  if (!cart) {
    cart = "[]";
  }
  return JSON.parse(cart);
}

async function getProduct(productId) {
  const response = await fetch(
    `http://localhost:3000/api/products/${productId}`
  );
  const product = await response.json();
  return product;
}

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
  //On ajoute l'id du produit, la couleur ainsi que la quantité à mon panier
  const productId = getProductId();
  const productColor = document.getElementById("colors").value;
  const productQuantity = document.getElementById("quantity").value;

  //on vérifie qu'un couleur ainsi qu'une quantité ont été définies
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
  } else {
    let initialCart = getCart();

    //on modifie le panier en y ajoutant notre produit
    const newProduct = {
      id: productId,
      name: productName,
      image: productImage,
      color: productColor,
      quantity: productQuantity,
    };
    debugger;
    initialCart.push(newProduct);

    //on enregistre le panier
    localStorage.setItem("cart", JSON.stringify(initialCart));
  }
}

displayProduct();
const button = document.querySelector("#addToCart");
button.addEventListener("click", addProductToCart);
