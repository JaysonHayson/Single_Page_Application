function createElement(tag, className, innerHTML) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}
//PRODUCTS
function createProductCard(item) {
  const productCard = document.createElement("div");
  productCard.className = "card-container h-96 gap-4 mb-40 p-4 mt-16";
  productCard.innerHTML = `
    <a href="#" class="block h-full hover:shadow-lg transition-shadow w-full">
      <div class="card card-compact w-full shadow-xl h-full transition-shadow relative">
        <figure class="h-2/3 overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="object-cover w-full h-full"/>
        </figure>
        <div class="card-body h-1/3 flex flex-col justify-between p-4">
          <h2 class="card-title text-xl font-semibold">${item.name}</h2>
          <p class="truncate">${item.description}</p>
          <div class="relative">
            <p class="text-xl font-bold absolute -bottom-4 left-0">$${item.price}</p>
          </div>
        </div>
      </div>
    </a>
    <div class="flex justify-center p-4">
      <button class="btn bg-blue-500 text-white px-4 py-2 rounded" onclick="addToCart('${item.id}', '${item.name}', '${item.price}', '${item.image}')">Add to Cart</button>
    </div> 
  `;
  return productCard;
}

function renderProducts(data) {
  const productList = document.getElementById("productList");
  console.log("Product list element:", productList); // Debugging
  productList.innerHTML = "";
  data.forEach((item) => {
    console.log("Creating product card for item:", item); // Debugging
    const productCard = createProductCard(item);
    productList.appendChild(productCard);
  });
}

function fetchProductsForCategory(catNr) {
  fetch("../Backend/index.php", {
    method: "POST",
    body: new URLSearchParams({
      Command: "GetProductsForCategorie",
      CatNr: catNr,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data:", data);

      console.log("Fetched data (JSON format):", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        //return data;
        renderProducts(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//PRODUCTS
//CATEGORIES
function createCategoryCard(category) {
  const categoryCard = document.createElement("div");
  categoryCard.className = "card-container h-96 gap-4 mb-20 mt-16 p-4";

  const imageSrc = category.foto;

  categoryCard.innerHTML = `
    <div class="block h-full hover:shadow-lg transition-shadow w-full">
      <div class="card card-compact w-full shadow-xl h-full transition-shadow">
        <figure class="h-2/3 overflow-hidden">
          <img src="${imageSrc}" alt="${category.name}" class="object-cover w-full h-full"/>
        </figure>
        <div class="card-body h-1/3 flex flex-col justify-between p-4">
          <h2 class="card-title text-xl font-semibold">${category.name}</h2>
          <div class="card-actions justify-end">
            <button class="btn bg-blue-500 text-white px-4 py-2 rounded" onclick="xInnerHtmlAndCallback(() => fetchProductsForCategory('${category.id}'))">View Products</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return categoryCard;
}
function renderCategories(data) {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  data.forEach((identifier) => {
    console.log(identifier);
    const categoryCard = createCategoryCard(identifier);
    categoryList.appendChild(categoryCard);
  });
}
function fetchCategories() {
  fetch("../Backend/index.php", {
    method: "POST",
    body: new URLSearchParams({
      Command: "GetAllCategories",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data:", data);

      console.log("Fetched data (JSON format):", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        renderCategories(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
//CATEGORIES
let cart = [];

function addToCart(itemId, itemName, itemPrice, itemImage) {
  const product = {
    id: itemId,
    name: itemName,
    price: parseFloat(itemPrice),
    image: itemImage,
  };

  if (!product.id || !product.name || isNaN(product.price)) {
    console.error("Invalid product data:", product);
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

  animation.classList.add("animation-show");

  setTimeout(function () {
    animation.classList.remove("animation-show");
  }, 1000);
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
  const product = cart.find((item) => item.name === productName);
  if (product) {
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

  total = 0;

  // Create an object to summarize the products in the cart
  cartSummary = {};

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
    console.log(product);
    console.log(productName);
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
  console.log(total);
  cartTotal.textContent = total.toFixed(2);
}

// ToggleDarkMode
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");
}

function toggleColorInversion() {
  const video = document.getElementById("backgroundVideo");
  video.classList.toggle("video-invert");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Retrieve cart from localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  if (storedCart) {
    cart = storedCart;
  }
  renderCart();
  // Render hero section
  renderHero();
});

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function togglePersonMenu() {
  const personDropdown = document.querySelector(".dropdown-content");
  personDropdown.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  // After DOM is fully loaded
  setTimeout(function () {
    var loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(function () {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }, 500);
});

// Hamburger-Menü
document.addEventListener("DOMContentLoaded", () => {
  const drawerOpener = document.getElementById("drawerOpener");
  const drawer = document.getElementById("drawer");
  const drawerCloseButton = document.getElementById("drawerCloseButton");

  if (drawerOpener && drawer && drawerCloseButton) {
    drawerOpener.addEventListener("click", () => {
      drawer.classList.toggle("open");
    });

    drawerCloseButton.addEventListener("click", () => {
      drawer.classList.remove("open");
    });

    document.addEventListener("click", (event) => {
      if (
        !drawer.contains(event.target) &&
        !drawerOpener.contains(event.target)
      ) {
        drawer.classList.remove("open");
      }
    });

    const drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    });
  }
});

//loginform
function createLoginForm() {
  const loginForm = document.createElement("div");
  loginForm.id = "loginContainer";
  loginForm.className =
    "p-6 rounded-lg shadow-lg border-2 card h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20";

  loginForm.innerHTML = `
    <h2 id="formTitle" class="text-2xl font-semibold text-center mb-4">Login</h2>
    <form id="authForm">
      <div id="registerSection" class="hidden loginTransition mb-4 sm:w-full">
        
        <div class="mb-4 w-full sm:w-full lg:w-full">
          <label for="firstNameInput" class="block text-sm font-medium mb-1">First Name</label>
          <input id="firstNameInput" type="text" class="input input-bordered w-full" placeholder="Enter your first name" autocomplete="given-name">
        </div>
        <div class="mb-4 w-full sm:w-full lg:w-full">
          <label for="lastNameInput" class="block text-sm font-medium mb-1">Last Name</label>
          <input id="lastNameInput" type="text" class="input input-bordered w-full" placeholder="Enter your last name" autocomplete="family-name">
        </div>
         <div class="mb-4 w-full sm:w-full lg:w-full">
        <label for="emailInput" class="block text-sm font-medium mb-1">E-mail</label>
        <input id="emailInput" type="email" class="input input-bordered w-full" placeholder="Enter your email" autocomplete="email">
      </div>
      </div>
     
      <div class="mb-4 w-full sm:w-full lg:w-full">
          <label for="userNameInput" class="block text-sm font-medium mb-1">Username</label>
          <input id="userNameInput" name="userName" type="text" class="input input-bordered w-full" placeholder="Enter your username" autocomplete="username" required>
        </div>
      <div class="mb-4 w-full sm:w-full lg:w-full">
        <label for="passwordInput" class="block text-sm font-medium mb-1">Password</label>
        <input id="passwordInput" name="pw" type="password" class="input input-bordered w-full" placeholder="Enter your password" autocomplete="current-password" required>
      </div>
      <div class="flex items-center mb-4 mt-4" id="rememberMeSection">
        <input type="checkbox" class="checkbox mr-2">
        <label class="text-sm">Remember me</label>
      </div>
      <button id="loginButton" class="btn btn-primary w-full mb-4">Login</button>
      <div id="registerMessage" class="text-sm mb-4">
        If you are not registered yet! <a href="#" id="registerLink" class="text-blue-600">Register now</a>
      </div>
      <div id="loginMessage" class="hidden text-sm mb-4">
        If you are registered! <a href="#" id="loginLink" class="text-blue-600">Login</a>
      </div>
    </form>
  `;

  document.body.appendChild(loginForm);

  const registerLink = loginForm.querySelector("#registerLink");
  const loginLink = loginForm.querySelector("#loginLink");
  const registerSection = loginForm.querySelector("#registerSection");
  const loginButton = loginForm.querySelector("#loginButton");
  const registerMessage = loginForm.querySelector("#registerMessage");
  const loginMessage = loginForm.querySelector("#loginMessage");
  const rememberMeSection = loginForm.querySelector("#rememberMeSection");
  const formTitle = loginForm.querySelector("#formTitle");
  const authForm = loginForm.querySelector("#authForm");

  // Toggle between login and register forms
  registerLink.addEventListener("click", (event) => {
    event.preventDefault();
    registerSection.classList.toggle("hidden");
    registerMessage.classList.toggle("hidden");
    loginMessage.classList.toggle("hidden");
    rememberMeSection.classList.toggle("hidden");
    loginForm.classList.toggle("expanded");

    if (!registerSection.classList.contains("hidden")) {
      formTitle.textContent = "Register";
      loginButton.textContent = "Register";
      loginButton.removeEventListener("click", handleLogin);
      loginButton.addEventListener("click", handleRegister);
    } else {
      formTitle.textContent = "Login";
      loginButton.textContent = "Login";
      loginButton.removeEventListener("click", handleRegister);
      loginButton.addEventListener("click", handleLogin);
    }
  });

  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    registerSection.classList.add("hidden");
    registerMessage.classList.add("hidden");
    loginMessage.classList.add("hidden");
    rememberMeSection.classList.remove("hidden");
    loginForm.classList.remove("expanded");

    formTitle.textContent = "Login";
    loginButton.textContent = "Login";
    loginButton.removeEventListener("click", (event)=>handleRegister(event));
    loginButton.addEventListener("click", (event)=>handleLogin(event));

    if (registerSection.classList.contains("hidden")) {
      registerMessage.classList.remove("hidden");
    } else {
      registerMessage.classList.add("hidden");
    }
  });

  function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementsByName("userName")[0].value;
    const pw = document.getElementsByName("pw")[0].value;

    fetch("../Backend/index.php", {
      method: "POST",
      body: new URLSearchParams({
        Command: "loginUser",
        userName: username,
        userPW: pw,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Login response fail");
      }
    });
    // Implement login functionality here
  }
  return loginForm;
}
function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstNameInput").value;
  const lastName = document.getElementById("lastNameInput").value;
  const username = document.getElementById("userNameInput").value;
  const email = document.getElementById("emailInput").value;
  const pw = document.getElementById("passwordInput").value;

  fetch("../Backend/index.php", {
    method: "POST",
    body: new URLSearchParams({
      Command: "registerNewUser",
      userFirstName: firstName,
      userLastName: lastName,
      userName: username,
      userEmail: email,
      userPW: pw,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Remove existing content
      xInnerHtmlAndCallback(() => {
        const messageDiv = document.createElement("div");
        messageDiv.className = "transform -translate-x-1/2 px-4 py-2 rounded shadow";

        if (data[0]) {
          // Registration successful
          messageDiv.textContent = "Registration successful!";
          messageDiv.classList.add("m-*");
        } else {
          // Registration failed
          messageDiv.textContent = "Registration failed! " + data[1];
          messageDiv.classList.add("m-*");
        }

        document.body.appendChild(messageDiv);

        setTimeout(() => {
          if (data[0]) {
            xInnerHtmlAndCallback(renderLoginForm());
          } else {
            xInnerHtmlAndCallback(renderRegisterForm());
          }
        }, 2000);
      });
    })
    .catch((error) => {
      console.error(
        "There was a problem with the registration request:",
        error
      );
    });
}
function renderLoginForm() {
  const loginForm = document.getElementById("loginForm");
  loginForm.innerHTML = "";
  const loginFormItem = createLoginForm();
  loginForm.appendChild(loginFormItem);
}
//loginform end
//hero
function createHero() {
  const hero = document.createElement("div");
  hero.className = "mx-auto";

  hero.innerHTML = `
  <div class="hero min-h-screen relative overflow-hidden">
    <video id="backgroundVideo" autoplay loop muted playsinline class="video-filter absolute w-full h-full object-cover">
      <source src="hero.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="hero-overlay bg-opacity-60 absolute inset-0"></div>
    <div class="hero-content text-center text-neutral-content relative z-10">
      <div class="max-w-md mx-auto">
        <h1 class="mb-6 text-4xl md:text-8xl lg:text-14xl font-bold">WELCOME</h1>
        <button id="scrollButton" class="btn btn-primary px-8 py-3 md:px-12 md:py-4" onclick="xInnerHtmlAndCallback(fetchCategories)">
          BROWSE OFFERS NOW
        </button>
      </div>
    </div>
  </div>
`;

  return hero;
}
function renderHero() {
  const hero = document.getElementById("heroComp");
  hero.innerHTML = "";
  const heroItem = createHero();
  hero.appendChild(heroItem);
}
//hero end

function xInnerHtmlAndCallback(callback) {
  const spaConfig = document.querySelector(".spaConfig");

  if (spaConfig) {
    const divs = spaConfig.querySelectorAll("div");
    divs.forEach((div) => {
      div.innerHTML = "";
    });
  }
  if (typeof callback === "function") {
    callback();
  }
}

//checkout

function loadCartItems() {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  return storedCart ? storedCart : [];
}

function getCartItems() {
  return cartItems;
}

function createCheckout() {
  
  const checkout = document.createElement("div");
  checkout.id = "checkoutContainer table";


  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    checkout.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
  } else {
    Object.keys(cartSummary).forEach((productName) => {
      const product = cartSummary[productName];
      const itemDiv = document.createElement("div");
      itemDiv.className = "checkout-item ";
      
      itemDiv.innerHTML = `<tr>
        
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img
                    src="${product.image}"
                    alt="item photo" />
                </div>
              </div>
          </td>

          <td>
            ${product.quantity}
          </td>

          <td>
              <div class="font-bold">${productName}</div>
          </td>

          <td>${product.price * product.quantity}</td>
          
        </tr>`;
      checkout.appendChild(itemDiv);
    });

    const totalContainer = createElement(
      "div"
    );
    totalContainer.innerHTML =`
    <p>${total}</p>`;
    checkoutList.appendChild(totalContainer);
    checkoutTotal.textContent = total.toFixed(2);
    
  }
  return checkout;
}

function renderCheckout() {
  const checkout = document.getElementById("checkout");
  checkout.innerHTML = "";
  const checkoutItem = createCheckout();
  checkout.appendChild(checkoutItem);
}

function InitializeCart() {
  cartItems = loadCartItems();
  renderCheckout();
}

let cartItems = [];

document.addEventListener("DOMContentLoaded", InitializeCart);



// TODO: Functions to be implemented

function showLogin() {
  alert("Login functionality to be implemented.");
}

function showRegister() {
  alert("Register functionality to be implemented.");
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
