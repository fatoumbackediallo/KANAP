//Récupérer les informations des produits dans l'api
async function getProductsfromApi() {
  const url = "http://localhost:3000/api/products";
  const response = await fetch(url);
  const products = await response.json();
  return products;
}

//Modifier le html
function generateProductsPage(products) {
  const section = document.getElementById("items");
  section.className = "items";
  const a = document.createElement("a");
  a.dataset.id = products.id;
  const kanapImageContent = document.createElement("article");
  const kanapImage = document.createElement("img");
  kanapImage.src = products.imageUrl;
  kanapImage.alt = products.altTxt;
  const kanapName = document.createElement("h3");
  h3.className = "productName";
  kanapName.innerHTML = products.name;
  const kanapDescription = document.createElement("p");
  kanapDescription.className = "productDescription";
  kanapDescription.innerHTML = products.description;
  kanapImageContent.appendChild(kanapDescription);
  kanapImageContent.appendChild(kanapName);
  kanapImageContent.appendChild(kanapImage);
  a.appendChild(kanapImageContent);
  section.appendChild(a);
}

//Afficher les produits
async function displayProducts() {
  //Récupérer les informations des produits dans l'api
  try {
    const productsContent = getProductsfromApi();
    const products = await productsContent;
    generateProductsPage(products);
  } catch (error) {
    console.error(error);
  }
}
//Afficher ses informations sur la page Accueil
displayProducts();
