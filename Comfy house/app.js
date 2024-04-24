const cartBtn = document.querySelector(".cart-btn");
const handburgerBtn = document.querySelector(".nav-icon");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItmes = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const shopNowBtn = document.querySelector(".shopNow");
const navBar = document.querySelector(".navbar");
const element = document.getElementById("001");
const navHeight = navBar.getBoundingClientRect().height;

// cart
let cart = [];
let buttonDOM;

//getting the products
class Products {
  async getProducts() {
    try {
      let response = await fetch("products.json");
      let { items } = await response.json();

      let products = items.map((item) => {
        let { price, title } = item.fields;
        let { id } = item.sys;
        let image = item.fields.image.fields.file.url;

        return { price, title, id, image };
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let content = "";
    products.forEach((product) => {
      content += `
        <article class="product">
          <div class="img-container">
            <img src=${product.image} class="product-img">
            <button class="bag-btn" data-id=${product.id}>
              <div id="cart">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M388.3 104.1a4.7 4.7 0 0 0 -4.4-4c-2 0-37.2-.8-37.2-.8s-21.6-20.8-29.6-28.8V503.2L442.8 472S388.7 106.5 388.3 104.1zM288.7 70.5a116.7 116.7 0 0 0 -7.2-17.6C271 32.9 255.4 22 237 22a15 15 0 0 0 -4 .4c-.4-.8-1.2-1.2-1.6-2C223.4 11.6 213 7.6 200.6 8c-24 .8-48 18-67.3 48.8-13.6 21.6-24 48.8-26.8 70.1-27.6 8.4-46.8 14.4-47.2 14.8-14 4.4-14.4 4.8-16 18-1.2 10-38 291.8-38 291.8L307.9 504V65.7a41.7 41.7 0 0 0 -4.4 .4S297.9 67.7 288.7 70.5zM233.4 87.7c-16 4.8-33.6 10.4-50.8 15.6 4.8-18.8 14.4-37.6 25.6-50 4.4-4.4 10.4-9.6 17.2-12.8C232.2 54.9 233.8 74.5 233.4 87.7zM200.6 24.4A27.5 27.5 0 0 1 215 28c-6.4 3.2-12.8 8.4-18.8 14.4-15.2 16.4-26.8 42-31.6 66.5-14.4 4.4-28.8 8.8-42 12.8C131.3 83.3 163.8 25.2 200.6 24.4zM154.2 244.6c1.6 25.6 69.3 31.2 73.3 91.7 2.8 47.6-25.2 80.1-65.7 82.5-48.8 3.2-75.7-25.6-75.7-25.6l10.4-44s26.8 20.4 48.4 18.8c14-.8 19.2-12.4 18.8-20.4-2-33.6-57.2-31.6-60.8-86.9-3.2-46.4 27.2-93.3 94.5-97.7 26-1.6 39.2 4.8 39.2 4.8L221.4 225.4s-17.2-8-37.6-6.4C154.2 221 153.8 239.8 154.2 244.6zM249.4 82.9c0-12-1.6-29.2-7.2-43.6 18.4 3.6 27.2 24 31.2 36.4Q262.6 78.7 249.4 82.9z"/></svg>

              </div>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
     
      `;
      // console.log(product, content);
    });
    productsDOM.innerHTML = content;
  }

  getBagButtons() {
    let buttons = [...document.querySelectorAll(".bag-btn")];
    buttonDOM = buttons;
    buttons.forEach((btn) => {
      let { id } = btn.dataset;
      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        btn.textContent = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        let targetBtn = event.target;
        targetBtn.textContent = "In Cart";
        targetBtn.disabled = true;

        //get product from products
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        // add to cart arr
        cart.push(cartItem);

        //save cart  to local storage
        Storage.saveCart(cart);
        // setting values
        this.setValues(cart);
        //update ui cart item totals
        this.addCartItem(cartItem);
        // show overlay and cart
        this.showCart();
        clearCartBtn.classList.add("showClear-cart-btn");
      });
    });
  }

  setValues(cart) {
    let temItem = 0;
    let temTotals = 0;
    cart.forEach((item) => {
      temItem += item.amount;
      temTotals += +(item.price * item.amount).toFixed(2);
    });

    cartItmes.textContent = temItem;
    cartTotal.textContent = temTotals.toFixed(2);

    // console.log(temItem, cartTotal);
  }

  addCartItem(cart) {
    cartContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="cart-item" id=${cart.id}>
            <img src="${cart.image}" alt="product">
            <div>
              <h4>${cart.title}</h4>
              <h5>$${cart.price}</h5>
              <span class="remove-item" data-id=${cart.id}>remove</span>
            </div>
            <div class="arrowDIV">
              <span class="fa-chevron-up" data-id=${cart.id}>&#8743 </span>
              <p class="item-amount" data-id=${cart.id}>${cart.amount}</p>
              <span class="fa-chevron-down" data-id=${cart.id}>&#8744 </span>
            </div>
          </div>
    `
    );
    // console.log(cartContent, cart);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
    if (cartContent.childElementCount == 0) {
      clearCartBtn.classList.remove("showClear-cart-btn");
    } else {
      clearCartBtn.classList.add("showClear-cart-btn");
    }
  }

  closeCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  setupApp() {
    cart = Storage.getCart();
    this.setValues(cart);
    cart.forEach((item) => this.addCartItem(item));
    cartBtn.addEventListener("click", this.showCart);
    handburgerBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.closeCart);
    shopNowBtn.addEventListener("click", this.smoothScroll);

    // console.log(cart);
  }

  smoothScroll(e) {
    e.preventDefault();

    let position = element.offsetTop - navHeight;

    window.scrollTo({
      left: 0,
      top: position,
    });
  }

  logic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let itemID = event.target.dataset.id;
        this.removeItem(itemID);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let increament = event.target;
        let id = increament.dataset.id;
        let temItem = cart.find((item) => item.id === id);
        temItem.amount = temItem.amount + 1;
        this.setValues(cart);
        Storage.saveCart(cart);
        let value = increament
          .closest(".arrowDIV")
          .querySelector(".item-amount");
        value.textContent = temItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let decreament = event.target;
        let id = decreament.dataset.id;
        let temItem = cart.find((item) => item.id === id);
        temItem.amount = temItem.amount - 1;
        this.setValues(cart);
        Storage.saveCart(cart);
        let value = decreament
          .closest(".arrowDIV")
          .querySelector(".item-amount");
        value.textContent = temItem.amount;

        if (temItem.amount < 1) {
          this.removeItem(id);
        }
      }
      if (cartContent.childElementCount < 1) {
        this.closeCart();
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    this.closeCart();
    // clearCartBtn.classList.remove("showClear-cart-btn");
  }

  removeItem(id) {
    cart = cart.filter((item) => {
      return item.id !== id;
    });
    this.setValues(cart);
    Storage.saveCart(cart);
    document.getElementById(id).remove();
    let btn = this.getSingleBtn(id);
    btn.innerHTML = `
     <div id="cart">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M388.3 104.1a4.7 4.7 0 0 0 -4.4-4c-2 0-37.2-.8-37.2-.8s-21.6-20.8-29.6-28.8V503.2L442.8 472S388.7 106.5 388.3 104.1zM288.7 70.5a116.7 116.7 0 0 0 -7.2-17.6C271 32.9 255.4 22 237 22a15 15 0 0 0 -4 .4c-.4-.8-1.2-1.2-1.6-2C223.4 11.6 213 7.6 200.6 8c-24 .8-48 18-67.3 48.8-13.6 21.6-24 48.8-26.8 70.1-27.6 8.4-46.8 14.4-47.2 14.8-14 4.4-14.4 4.8-16 18-1.2 10-38 291.8-38 291.8L307.9 504V65.7a41.7 41.7 0 0 0 -4.4 .4S297.9 67.7 288.7 70.5zM233.4 87.7c-16 4.8-33.6 10.4-50.8 15.6 4.8-18.8 14.4-37.6 25.6-50 4.4-4.4 10.4-9.6 17.2-12.8C232.2 54.9 233.8 74.5 233.4 87.7zM200.6 24.4A27.5 27.5 0 0 1 215 28c-6.4 3.2-12.8 8.4-18.8 14.4-15.2 16.4-26.8 42-31.6 66.5-14.4 4.4-28.8 8.8-42 12.8C131.3 83.3 163.8 25.2 200.6 24.4zM154.2 244.6c1.6 25.6 69.3 31.2 73.3 91.7 2.8 47.6-25.2 80.1-65.7 82.5-48.8 3.2-75.7-25.6-75.7-25.6l10.4-44s26.8 20.4 48.4 18.8c14-.8 19.2-12.4 18.8-20.4-2-33.6-57.2-31.6-60.8-86.9-3.2-46.4 27.2-93.3 94.5-97.7 26-1.6 39.2 4.8 39.2 4.8L221.4 225.4s-17.2-8-37.6-6.4C154.2 221 153.8 239.8 154.2 244.6zM249.4 82.9c0-12-1.6-29.2-7.2-43.6 18.4 3.6 27.2 24 31.2 36.4Q262.6 78.7 249.4 82.9z"/></svg>
     </div>
      add to bag`;
    btn.disabled = false;
  }

  getSingleBtn(id) {
    return buttonDOM.find((button) => button.dataset.id === id);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProducts(id) {
    let source = JSON.parse(localStorage.getItem("products"));
    let sourced = source.find((item) => item.id === id);
    return sourced;
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupApp();

  products
    .getProducts()
    .then((product) => {
      ui.displayProducts(product);
      Storage.saveProducts(product);
    })
    .then(() => {
      ui.getBagButtons();
      ui.logic();
    });
});
