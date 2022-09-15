//Récupérer les informations des produits dans l'api
async function getProductsFromApi() {
  const url = "http://localhost:3000/api/products";
  const response = await fetch(url);
  const products = await response.json();
  return products;
}

//Modifier le html
function generateProductsPage(products) {
  for (const product of products) {
    const section = document.getElementById("items");
    section.className = "items";
    const a = document.createElement("a");
    a.dataset.id = product.id;
    a.setAttribute("href", `./product.html?id=${product._id}`);
    const kanapImageContent = document.createElement("article");
    const kanapImage = document.createElement("img");
    kanapImage.src = product.imageUrl;
    kanapImage.alt = product.altTxt;
    const kanapName = document.createElement("h3");
    kanapName.className = "productName";
    kanapName.innerHTML = product.name;
    const kanapDescription = document.createElement("p");
    kanapDescription.className = "productDescription";
    kanapDescription.innerHTML = product.description;
    kanapImageContent.appendChild(kanapImage);
    kanapImageContent.appendChild(kanapName);
    kanapImageContent.appendChild(kanapDescription);
    a.appendChild(kanapImageContent);
    section.appendChild(a);
  }
}

//Afficher les produits
async function displayProducts() {
  //Récupérer les informations des produits dans l'api
  try {
    const productsContent = getProductsFromApi();
    const products = await productsContent;
    generateProductsPage(products);
  } catch (error) {
    console.error(error);
  }
}
//Afficher ses informations sur la page Accueil
displayProducts();
