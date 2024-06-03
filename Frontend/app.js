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
  const categoryCard = createElement("div", "card-container h-96");
  const imageSrc = category.foto;

  categoryCard.innerHTML = `
    <div class="card card-compact w-96 bg-base-100 shadow-xl h-full">
      <figure class="h-2/3 overflow-hidden">
        <img src="${imageSrc}" alt="${category.name}" class="object-cover w-full h-full"/>
      </figure>
      <div class="card-body h-1/3 flex flex-col justify-between">
        <h2 class="card-title">${category.name}</h2>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" onclick="showProducts('${category.name}')">View Products</button>
        </div>
      </div>
    </div>
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
  const productCard = createElement(
    "div",
    "card card-compact w-96 bg-base-100 shadow-xl"
  );

  productCard.innerHTML = `
    <figure><img src="${item.image}" alt="${item.name}" /></figure>
    <div class="card-body">
      <h2 class="card-title">${item.name}</h2>
      <p>${item.description}</p>
      <p class="text-lg font-bold">$${item.price}</p>
    </div>
    <button class="btn btn-primary" onclick="addToCart('${categoryName}', '${item.name}')">Add to Cart</button>
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

function showLogin() {
  alert("Login functionality to be implemented.");
}

function showRegister() {
  alert("Register functionality to be implemented.");
}

function searchItems(query) {
  alert("Search functionality to be implemented.");
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
}

function removeFromCart(productName) {
  const index = cart.findIndex((item) => item.name === productName);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
    renderCart();
  }
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

  cart.forEach((item) => {
    total += item.price;
    const cartItem = createElement(
      "div",
      "cart-item grid grid-cols-3 gap-4 mb-2",
      `
      <span>${item.name}</span>
      <span>$${item.price}</span>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.name}')">Remove</button>
    `
    );
    cartList.appendChild(cartItem);
  });

  cartTotal.textContent = total.toFixed(2);
  console.log("Cart:", cart);
}

function updateCart() {}

// Initialize
renderCategories();
