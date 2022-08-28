//Récuperer données API
const url = "http://localhost:3000/api/products";

// Inserer les produits dans la page Accueil
async function getProducts() {
  try {
    const response = await fetch(url);
    const products = await response.json();

    let show = "";
    for (let kanap of products) {
      show += `<a href="./product.html?id=${kanap._id}">
      <article>
        <img
          src="${kanap.imageUrl}"
          alt="${kanap.name}"
        />
        <h3 class="productName">${kanap.name}</h3>
        <p class="productDescription">
        ${kanap.description}
        </p>
      </article>
      
    </a>`;
    }
    // show += "";
    document.querySelector("#items").innerHTML = show;
  } catch (error) {
    console.log("Erreur : " + error);
  }
}
getProducts();
