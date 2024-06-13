const categories = [
  {
    name: "Electronics",
    foto: "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    items: [
      {
        name: "Laptop",
        price: 999,
        image:
          "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "A powerful laptop for all your needs.",
      },
      {
        name: "Smartphone",
        price: 699,
        image:
          "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Stay connected with the latest smartphone.",
      },
      {
        name: "Tablet",
        price: 399,
        image:
          "https://images.pexels.com/photos/3785868/pexels-photo-3785868.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Compact and versatile tablet for on-the-go.",
      },
    ],
  },
  {
    name: "Clothing",
    foto: "https://images.pexels.com/photos/1884579/pexels-photo-1884579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    items: [
      {
        name: "T-Shirt",
        price: 19,
        image:
          "https://images.pexels.com/photos/1561011/pexels-photo-1561011.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Casual and comfortable t-shirt for everyday wear.",
      },
      {
        name: "Jeans",
        price: 39,
        image:
          "https://images.pexels.com/photos/2363825/pexels-photo-2363825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Classic jeans that fit perfectly.",
      },
      {
        name: "Dress",
        price: 49,
        image:
          "https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Elegant dress for special occasions.",
      },
    ],
  },
  {
    name: "Housekeeping",
    foto: "https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    items: [
      {
        name: "Vacuum Cleaner",
        price: 199,
        image:
          "https://images.pexels.com/photos/10567498/pexels-photo-10567498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Keep your home clean with this powerful vacuum cleaner.",
      },
      {
        name: "Blender",
        price: 49,
        image:
          "https://images.pexels.com/photos/7937006/pexels-photo-7937006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Blend your favorite smoothies with ease.",
      },
      {
        name: "Coffee Maker",
        price: 89,
        image:
          "https://images.pexels.com/photos/593328/pexels-photo-593328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Brew delicious coffee every morning.",
      },
    ],
  },
  {
    name: "Garden",
    foto: "https://images.pexels.com/photos/1732419/pexels-photo-1732419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    items: [
      {
        name: "Lawn Mower",
        price: 299,
        image:
          "https://images.pexels.com/photos/589/garden-grass-meadow-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Keep your lawn neat and tidy with this lawn mower.",
      },
      {
        name: "Garden Hose",
        price: 25,
        image:
          "https://images.pexels.com/photos/127944/pexels-photo-127944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Water your plants with this durable garden hose.",
      },
      {
        name: "Garden Shears",
        price: 19,
        image:
          "https://www.gsgardens.co.uk/wp-content/uploads/2020/09/hedge-cutting-shears.jpg",
        description: "Prune your plants with these sharp garden shears.",
      },
    ],
  },
];

function createElement(tag, className, innerHTML) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

function createCategoryCard(category) {
  const categoryCard = document.createElement("div");
  categoryCard.className = "card-container h-96";

  const imageSrc = category.foto;
  const categoryLink = `javascript:showProducts('${category.name}')`;

  categoryCard.innerHTML = `
    <a href="${categoryLink}" class="block h-full hover:shadow-lg transition-shadow w-full">
      <div class="card card-compact w-full shadow-xl h-full transition-shadow">
        <figure class="h-2/3 overflow-hidden">
          <img src="${imageSrc}" alt="${category.name}" class="object-cover w-full h-full"/>
        </figure>
        <div class="card-body h-1/3 flex flex-col justify-between p-4">
          <h2 class="card-title text-xl font-semibold">${category.name}</h2>
          <div class="card-actions justify-end">
            <button class="btn bg-blue-500 text-white px-4 py-2 rounded" onclick="showProducts('${category.name}')">View Products</button>
          </div>
        </div>
      </div>
    </a>
  `;
  return categoryCard;
}

function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const categoryCard = createCategoryCard(category);
    categoryList.appendChild(categoryCard);
  });
}

function createProductCard(item, categoryName) {
  const productCard = document.createElement("div");
  productCard.className =
    "card-container h-96 flex flex-col justify-between mb-40";

  productCard.innerHTML = `
    <a href="#" class="block h-full hover:shadow-lg transition-shadow w-full">
      <div class="card card-compact w-full shadow-xl h-full transition-shadow">
        <figure class="h-2/3 overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="object-cover w-full h-full"/>
        </figure>
        <div class="card-body h-1/3 flex flex-col justify-between p-4">
          <h2 class="card-title text-xl font-semibold">${item.name}</h2>
          <p>${item.description}</p>
          <p class="text-lg font-bold">$${item.price}</p>
        </div>
      </div>
    </a>
    <div class="flex justify-center p-4">
      <button class="btn bg-blue-500 text-white px-4 py-2 rounded" onclick="addToCart('${categoryName}', '${item.name}')">Add to Cart</button>
    </div>
  `;
  return productCard;
}

function showProducts(categoryName) {
  const category = categories.find((cat) => cat.name === categoryName);
  if (!category) return;

  const categoryList = document.getElementById("categoryList");
  const productDetails = document.getElementById("productDetails");
  const productList = document.getElementById("productList");

  categoryList.classList.add("hidden");
  productDetails.classList.remove("hidden");

  productList.innerHTML = "";
  category.items.forEach((item) => {
    const productCard = createProductCard(item, categoryName);
    productList.appendChild(productCard);
  });
}

function hideProductDetails() {
  const categoryList = document.getElementById("categoryList");
  const productDetails = document.getElementById("productDetails");

  productDetails.classList.add("hidden");
  categoryList.classList.remove("hidden");
}

let cart = [];

function addToCart(categoryName, productName) {
  const category = categories.find((cat) => cat.name === categoryName);
  const product = category.items.find((item) => item.name === productName);
 
  if (!product) {
    console.error("Product not found:", productName);
    return;
  }

  console.log("Adding to cart:", product);
  cart.push(product);
  updateCart();
  renderCart();

  addToCartAnimation();
}

    
function addToCartAnimation() {
  var animation = document.querySelector(".animation");

  // Füge die Klasse 'animation-show' hinzu, um die Animation zu starten
  animation.classList.add("animation-show");

  // Verstecke die Animation nach einer Verzögerung wieder
  setTimeout(function() {
      animation.classList.remove("animation-show");
  }, 1000); // Animation bleibt für 1 Sekunde sichtbar
}
    



function decreaseQuantity(productName) {
  const productIndex = cart.findIndex((item) => item.name === productName);
  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    updateCart();
    renderCart();
  }
}

function increaseQuantity(productName) {
  const category = categories.find((cat) =>
    cat.items.some((item) => item.name === productName)
  );
  if (category) {
    const product = category.items.find((item) => item.name === productName);
    cart.push(product);
    updateCart();
    renderCart();
  }
}

function removeFromCart(productName) {
  const index = cart.findIndex((item) => item.name === productName);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
    renderCart();
  }
}

function removeAllFromCart() {
  cart = [];
  updateCart();
  renderCart();
}

function toggleCart() {
  const cartOverlay = document.getElementById("cartOverlay");
  cartOverlay.classList.toggle("hidden");
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");

  cartList.innerHTML = "";

  let total = 0;

  // Create an object to summarize the products in the cart
  const cartSummary = {};

  cart.forEach((item) => {
    total += item.price;

    if (cartSummary[item.name]) {
      cartSummary[item.name].quantity++;
    } else {
      cartSummary[item.name] = {
        quantity: 1,
        price: item.price,
        image: item.image,
      };
    }
  });

  // Iterate over the products in the cart summary to render them in the cart list
  Object.keys(cartSummary).forEach((productName) => {
    const product = cartSummary[productName];
    const cartItem = createElement(
      "div",
      "cart-item grid grid-cols-4 gap-4 mb-2"
    );

    cartItem.innerHTML = `
      <div>
        <img src="${
          product.image
        }" alt="${productName}" class="w-16 h-16 object-cover rounded">
      </div>
      <div class="col-span-2">
        <span>${productName}</span>
        <span>Quantity: ${product.quantity}</span>
      </div>
      <div class="flex items-center justify-end">
        <span class="text-lg font-bold">$${(
          product.price * product.quantity
        ).toFixed(2)}</span>
        <button class="btn btn-ghost btn-sm ml-2" onclick="decreaseQuantity('${productName}')">-</button>
        <button class="btn btn-ghost btn-sm ml-2" onclick="increaseQuantity('${productName}')">+</button>
      </div>
    `;
    cartList.appendChild(cartItem);
  });

  // Add button to remove all products if the cart is not empty
  if (cart.length > 0) {
    const removeButton = createElement(
      "button",
      "btn btn-danger mt-4",
      "Remove All"
    );
    removeButton.onclick = removeAllFromCart;
    const buttonContainer = createElement("div", "flex justify-center");
    buttonContainer.appendChild(removeButton);
    cartList.appendChild(buttonContainer);
  }

  // Update the total price
  cartTotal.textContent = total.toFixed(2);
}

// ToggleDarkMode
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Retrieve cart from localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  if (storedCart) {
    cart = storedCart;
    renderCart();
  }

  renderCategories();
});

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleSearch() {
  const searchBar = document.getElementById("searchBar");
  searchBar.classList.toggle("show");
}

function togglePersonMenu() {
  const personDropdown = document.querySelector(".dropdown-content");
  personDropdown.classList.toggle("hidden");
}

// TODO: Functions to be implemented

function showLogin() {
  alert("Login functionality to be implemented.");
}

function showRegister() {
  alert("Register functionality to be implemented.");
}

function searchItems(query) {
  alert("Search functionality to be implemented.");
}

function showImpressum() {
  alert("Impressum functionality to be implemented.");
}

function showAGB() {
  alert("AGB functionality to be implemented.");
}

function showContact() {
  alert("Contact functionality to be implemented.");
}

function checkout() {
  alert("Checkout functionality to be implemented.");
}
