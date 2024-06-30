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
// Create an object to summarize the products in the cart
cartSummary = {};
total = 0;
function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");

  cartList.innerHTML = "";

  total = 0;
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
  // Retrieve cart from localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  if (storedCart) {
    cart = storedCart;
  }
  checkAuthentication();
  renderCart();
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
  loginForm.className =
    "p-6 rounded-lg shadow-lg border-2 card h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20";

  loginForm.innerHTML = `
    <h2 id="formTitle" class="text-2xl font-semibold text-center mb-4">Login</h2>
    
    <div class="mb-4 w-full sm:w-full lg:w-full">
        <label for="userNameInput" class="block text-sm font-medium mb-1">Username</label>
        <input id="userNameInput" name="userName" type="text" class="input-bordered w-full pl-4" placeholder="Enter your username" autocomplete="username" required>
    </div>

    <div class="mb-4 w-full sm:w-full lg:w-full">
      <label for="passwordInput" class="block text-sm font-medium mb-1">Password</label>
      <input id="passwordInput" name="pw" type="password" class="input-bordered w-full pl-4" placeholder="Enter your password" autocomplete="current-password" required>
    </div>

    <div class="flex items-center mb-4 mt-4" id="rememberMeSection">
      <input type="checkbox" class="checkbox mr-2">
      <label class="text-sm">Remember me</label>
    </div>

    <button onclick="handleLogin(event)" id="loginButton" class="btn btn-primary w-full mb-4">Login</button>

    <div id="registerMessage" class="text-sm mb-4">
      If you are not registered yet! <a href="#" onclick= "xInnerHtmlAndCallback(renderRegisterForm)" id="registerLink" class="text-blue-600">Register now</a>
    </div>
  `;

  return loginForm;
}

function handleLogin(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const username = document.getElementsByName("userName")[0].value;
  const pw = document.getElementsByName("pw")[0].value;

  fetch("../Backend/index.php", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      Command: "loginUser",
      userName: username,
      userPW: pw,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login response failed");
      }
      return response.json();
    })
    .then((data) => {
      const messageDiv = document.createElement("div");
      messageDiv.className =
        "px-4 py-2 rounded shadow text-system m-auto bg-system z-50";

      if (data[0]) {
        // Login successful
        messageDiv.textContent = "Login successful!";
        sessionManager.setTokenAndUsername(data[1], username); // save token
      } else {
        alert("User or Password doesn't exist");
        console.error("Login failed: ", data[1]);
      }
      const mainContainer = document.querySelector(".spaConfig");
      mainContainer.appendChild(messageDiv);

      setTimeout(() => {
        if (data[0]) {
          checkAuthentication();
        }
      }, 2000);
    })
    .catch((error) => {
      console.error("There was a problem with the login request:", error);
    });
}
//test
// Remove existing content


//test
function renderLoginForm() {
  const loginForm = document.getElementById("loginForm");
  loginForm.innerHTML = "";
  const loginFormItem = createLoginForm();
  loginForm.appendChild(loginFormItem);
}

function createRegisterForm() {
  const registerForm = document.createElement("div");
  registerForm.id = "loginContainer";
  registerForm.className =
    "p-6 rounded-lg shadow-lg border-2 card h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20";

  registerForm.innerHTML = `
    <h2 id="formTitle" class="text-2xl font-semibold text-center mb-4">Register</h2>
    
    <div class="flex">  
      <div class="mb-4 w-1/2 sm:w-1/2 lg:w-1/2">
        <label for="firstNameInput" class="block text-sm font-medium mb-1">First Name</label>
        <input id="firstNameInput" type="text" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your first name" autocomplete="given-name">
      </div>
      <div class="mb-4 ml-4 w-1/2 sm:w-1/2 lg:w-1/2">
        <label for="lastNameInput" class="block text-sm font-medium mb-1">Last Name</label>
        <input id="lastNameInput" type="text" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your last name" autocomplete="family-name">
      </div>
    </div>

    <div class ="mb-4 w-full sm:w-full lg:w-full">
      <label for="adressInput" class="block text-sm font-medium mb-1">Adress</label>
      <input id="adressInput" type="text" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your adress" autocomplete="adress">
    </div>

    <div class="mb-4 w-full sm:w-full lg:w-full">
      <label for="emailInput" class="block text-sm font-medium mb-1">E-mail</label>
      <input id="emailInput" type="email" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your email" autocomplete="email">
    </div>
    
    <div class="mb-4 w-full sm:w-full lg:w-full">
        <label for="userNameInput" class="block text-sm font-medium mb-1">Username</label>
        <input id="userNameInput" name="userName" type="text" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your username" autocomplete="username" required>
    </div>
    <div class="mb-4 w-full sm:w-full lg:w-full">
      <label for="passwordInput" class="block text-sm font-medium mb-1">Password</label>
      <input id="passwordInput" name="pw" type="password" class="bg-black-600 input-bordered w-full pl-4" placeholder="Enter your password" autocomplete="current-password" required>
    </div>
    <div class="flex items-center mb-4 mt-4" id="rememberMeSection">
      <input type="checkbox" class="checkbox mr-2">
      <label class="text-sm">Remember me</label>
    </div>
    <button onclick="handleRegister(event)" id="registerButton" class="btn btn-primary w-full mb-4">Register</button>
    
    <div id="loginMessage" class="text-sm mb-2">
      If you are registered! <a href="#" onclick= "xInnerHtmlAndCallback(renderLoginForm)" id="loginLink" class="text-blue-600">Login</a>
    </div>
  `;

  return registerForm;
}
function handleRegister(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const firstName = document.getElementById("firstNameInput").value;
  const lastName = document.getElementById("lastNameInput").value;
  const username = document.getElementById("userNameInput").value;
  const email = document.getElementById("emailInput").value;
  const pw = document.getElementById("passwordInput").value;
  const adress = document.getElementById("adressInput").value;

  fetch("../Backend/index.php", {
    method: "POST",
    body: new URLSearchParams({
      Command: "registerNewUser",
      userFirstName: firstName,
      userLastName: lastName,
      userAdress: adress,
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
        messageDiv.className =
          "px-4 py-2 rounded shadow text-system m-auto bg-system z-50";

        if (data[0]) {
          // Registration successful
          messageDiv.textContent = "Registration successful!";
        } else {
          // Registration failed
          messageDiv.textContent = "Registration failed! " + data[1];
        }
        const mainContainer = document.querySelector(".spaConfig");
        mainContainer.appendChild(messageDiv);

        setTimeout(() => {
          if (data[1] == "User and customer successfully registered.") {
            xInnerHtmlAndCallback(renderLoginForm);
          } else if (data[1] == "Username or email already in use.") {
            xInnerHtmlAndCallback(renderRegisterForm);
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

function renderRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  registerForm.innerHTML = "";
  const registerFormItem = createRegisterForm();
  registerForm.appendChild(registerFormItem);
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
  const checkoutHeader = document.createElement("div");

  checkoutHeader.innerHTML = `<h2 class=" checkouttext text-lg md:text-4xl font-bold mb-4 text-center">Checkout</h2>`;

  const checkout = document.createElement("table");
  checkout.id = "checkoutContainer";
  checkout.className = "p-4 bg-gray-100 rounded-lg shadow-lg";

  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    checkout.innerHTML = "<p class='text-center text-gray-400'>Ihr Warenkorb ist leer.</p>";
  } else {
    const formHeader = document.createElement("thead");
    formHeader.className="w-full bg-gray-700";
    formHeader.innerHTML = `
    <tr class="w-full text-white">
      <th class="p-2"></th>
      <th class="p-2 text-left">Product</th>
      <th class="p-2 text-left">Quantity</th>
      <th class="p-2 text-left">Price</th>
    </tr>`;
    formHeader.className = "bg-gray-700";

    checkout.appendChild(formHeader);

    Object.keys(cartSummary).forEach((productName) => {
      const product = cartSummary[productName];
      const itemDiv = document.createElement("tr");
      itemDiv.className = "checkout-item border-b border-gray-200 text-white";

      itemDiv.innerHTML = `
        
          <td class="p-4">
            <div class="flex items-center justify-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img
                    src="${product.image}"
                    alt="item photo" class="object-cover rounded-full" />
                </div>
              </div>
          </td>


          <td class="p-2">
              <div class="font-bold">${productName}</div>
          </td>

          <td class="p-2">
            ${product.quantity}
          </td>

          <td class="p-2">${(product.price * product.quantity).toFixed(2)}€</td>`;
      checkout.appendChild(itemDiv);
    });
  }
  const totalContainer = document.createElement("div");
    totalContainer.className="checkouttext";
    totalContainer.innerHTML = `
    <p class= "text-right text-lg font-bold mt-4 underline">Total price: ${total.toFixed(2)}€</p>`;

  const button = document.createElement("div");
  button.className="checkoutbutton text-right";
  button.innerHTML = `<button class="btn bg-blue-500 text-white px-4 py-2 rounded" onclick="xInnerHtmlAndCallback(handleUserData)">Order Now!</button>`

  const checkoutContainer = document.createElement("div");
  checkoutContainer.appendChild(checkoutHeader);
  checkoutContainer.appendChild(checkout);
  checkoutContainer.appendChild(totalContainer);
  checkoutContainer.appendChild(button);
  return checkoutContainer;
}

function calculateTotal(cartSummary) {
  let total = 0;
  Object.keys(cartSummary).forEach((productName) => {
    const product = cartSummary[productName];
    total += product.price * product.quantity;
  });
  return total;
}

function renderCheckout() {
  const checkout = document.getElementById("checkout");
  const checkoutOverlay = document.getElementById("cartOverlay");
  checkoutOverlay.classList.toggle("hidden");
  cartItems = loadCartItems();
  checkout.innerHTML = "";
  const checkoutItem = createCheckout();
  checkout.appendChild(checkoutItem);
}
let cartItems = [];

function createOrderConfirmation(userData, cartSummary) {
  const orderForm = document.createElement("div");
  orderForm.id = "orderConfirmation";
  orderForm.className =
    "p-6 rounded-lg shadow-lg border-2 card h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20";

  // Set order date dynamically
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };

  // Check if userData is defined before accessing its properties
  const firstName = userData ? userData.firstName : "";
  const lastName = userData ? userData.lastName : "";
  const adress = userData ? userData.adress : "";


  // Populate order summary list
  const orderSummaryList = document.createElement("ul");
  orderSummaryList.id = "orderSummaryList";
  let totalAmount = 0; // Variable to calculate total amount

  Object.keys(cartSummary).forEach((productName) => {
    const product = cartSummary[productName];
    const listItem = document.createElement("li");
    const productPrice = product.price * product.quantity;
    listItem.innerHTML = `${productName} - Quantity: ${
      product.quantity
    } - Price: ${productPrice.toFixed(2)}€`;
    orderSummaryList.appendChild(listItem);
    totalAmount += productPrice; // Accumulate total amount
  });

  orderForm.innerHTML = `
    <h1>Order Confirmation</h1>
    <p>Dear ${firstName} ${lastName},</p>
    <p>Thank you for your order! We are pleased to inform you that your order has been successfully processed.</p>
    <h2>Order Summary:</h2>
    ${orderSummaryList.outerHTML}
    <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}€</p>

    <h2>Shipping Address:</h2>
    <p>${firstName} ${lastName}<br>${adress}</p>

    <button id="downloadButton">Download PDF</button>
  `;

  // Set order date
  const orderDateElement = document.createElement("span");
  orderDateElement.id = "orderDate";
  orderDateElement.textContent = currentDate.toLocaleDateString("en-US", options);
  orderForm.insertBefore(orderDateElement, orderForm.firstChild);

  // Add event listener for PDF download
  orderForm.querySelector("#downloadButton").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Temporarily change styles for PDF generation
    orderForm.style.backgroundColor = "white";
    orderForm.style.color = "black";
    orderForm.style.padding = "20px";
    orderForm.style.width = "100%";
    orderForm.className =
      "p-6 shadow-lg h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20 pdf-style"; // Apply PDF styling

    const downloadButton = orderForm.querySelector("#downloadButton");
    downloadButton.style.display = "none"; // Hide the download button

    html2canvas(orderForm, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save("OrderConfirmation.pdf");

      // Revert styles back after PDF generation
      orderForm.style.backgroundColor = "";
      orderForm.style.color = "";
      orderForm.style.padding = "";
      orderForm.style.width = "";
      downloadButton.style.display = "";
      orderForm.className =
        "p-6 rounded-lg shadow-lg border-2 card h-auto gap-4 mx-auto w-3/4 lg:w-3/4 mt-20";

      // Remove PDF styling class after generating PDF
      orderForm.classList.remove("pdf-style");
    });
  });

  return orderForm;
}

function renderOrderConfirmation(userData, cartSummary) {
  const container = document.getElementById("orderConfirmation");
  container.innerHTML = "";
  container.appendChild(createOrderConfirmation(userData, cartSummary));
}

function handleUserData() {
  const userName = sessionManager.getUserN();
  const userToken = sessionManager.getToken();
  fetch("../Backend/index.php", {
    method: "POST",
    body: new URLSearchParams({
      Command: "getUserData",
      userName: userName,
      authToken: userToken,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server Response:", data);
      const userData = data[1];
      //data 1 should be the user data
      const firstName = userData.firstName;
      const lastName = userData.lastName;
      const adress = userData.adress;
      const email = userData.email;
      renderOrderConfirmation(userData, cartSummary);
      const userDetails = `First Name: ${firstName}, Last Name: ${lastName}, Address: ${adress}, Email: ${email}`;
      console.log(userDetails);
    });
}

async function checkAuthentication() {
  const isAuthenticated = await sessionManager.isAuthenticated();
  if (isAuthenticated) {
    xInnerHtmlAndCallback(renderHero);
    switchToLogoutButton();
  } else {
    console.log("Not authenticated for content");
    switchToLoginButton();
    xInnerHtmlAndCallback(renderHero);
  }
}
function switchToLogoutButton(){
  const button = document.getElementById("logInOrOutButton");
  button.innerHTML = "";
  button.innerHTML = `<a
                    class="btn btn-ghost rounded-btn"
                    onclick="handleLogout()"
                    >Logout</a
                  >`;
  const loggedInAs = document.getElementById('loggedInAs');
  const actualUser = sessionManager.getUserN();
  loggedInAs.innerHTML = `<div class="flex-col p1">
                            <p id="p1" class="text-sm">Currently logged in as: </p>
                            <p id="p1" class="italic font-bold">${actualUser}</p>
                          </div>
                          `;

}
function switchToLoginButton(){
  const button = document.getElementById("logInOrOutButton");
  button.innerHTML = "";
  button.innerHTML = `<a
                    class="btn btn-ghost rounded-btn"
                    onclick="xInnerHtmlAndCallback(renderLoginForm)"
                    >Login</a
                  >`;
  const loggedInAs = document.getElementById('loggedInAs');
  loggedInAs.innerHTML = '';

}
async function handleLogout() {
  const token = sessionManager.getToken();
  const username = sessionManager.getUserN();
  
  try {
    const response = await fetch("../Backend/index.php", {
      method: "POST",
      body: new URLSearchParams({
        Command: "logoutUser",
        userName: username,
        SessionID: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data[0]) {
      console.log("Logged out successfully");
      sessionManager.clearTokenAndUsername(); //clear storage
      await checkAuthentication();
    } else {
      sessionManager.clearTokenAndUsername();
      await checkAuthentication();
      console.log("Error with response. Watch " + data[1]);
    }
  } catch (error) {
    console.error("There was a problem with the login request:", error);
  }
}

function showAboutUs() {
  const aboutUsContainer = document.getElementById("aboutUsContainer");
  aboutUsContainer.className = ("text-center mx-auto mt-20");
  aboutUsContainer.innerHTML = ""; 


  const heading = document.createElement('h2');
  heading.textContent = 'Dev Team';
  heading.classList.add('about-heading');
  aboutUsContainer.appendChild(heading);

  const members = [
    { name: 'Andre', description: 'Databaseking' },
    { name: 'Elias', description: 'Talented Allrounder' },
    { name: 'Jesse', description: 'UIX/UI Design' },
    { name: 'Alex', description: 'Ein talentierter Koch und Feinschmecker.' },
    { name: 'Otto', description: 'Backend-Artist' },
    { name: 'Fatih', description: 'Engaging And Motivated' },
    { name: 'Robert', description: 'Silent Artist'},
    { name: 'Tom', description: 'Busy Student'},
  ];

  const container = document.createElement('div');
  container.className = 'about-card-container';

  members.forEach((member, index) => {
    const aboutCard = createAboutCard(member);
    container.appendChild(aboutCard);
    setTimeout(() => {
      aboutCard.classList.add('show');
    }, index * 100);
  });

  aboutUsContainer.appendChild(container);
}

function createAboutCard(member) {
  const card = document.createElement('div');
  card.className = 'about-card';

  const front = document.createElement('div');
  front.className = 'about-card-front';
  const name = document.createElement('h3');
  name.textContent = member.name;
  front.appendChild(name);

  const back = document.createElement('div');
  back.className = 'about-card-back';
  const description = document.createElement('p');
  description.textContent = member.description;
  back.appendChild(description);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  return card;
}
