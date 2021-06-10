import { settings, select, classNames, templates } from "../settings.js";
import { utils } from "../utils.js";
import CartProduct from "./CartProduct.js";

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    console.log("new Cart", thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.renderTotalsKeys = [
      "totalNumber",
      "totalPrice",
      "subtotalPrice",
      "deliveryFee",
    ];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
        select.cart[key]
      );
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener("click", function () {
      console.log("thisCart.dom.wrapper", thisCart.dom.wrapper);
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener("updated", function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener("remove", function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener("submit", function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + "/" + settings.db.order;

    const payload = {
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.defaultDeliveryFee,
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      products: [],
    };
    for (let product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options);
  }

  add(menuProduct) {
    const thisCart = this;
    // thisCart.dom = {};
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    console.log("adding product", menuProduct);

    /* add DOM element to thisCart.dom.productList */

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log("thisCart.products", thisCart.products);
    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products) {
      thisCart.subtotalPrice = thisCart.subtotalPrice + product.price;
      thisCart.totalNumber = thisCart.totalNumber + product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice = thisCart.deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    console.log("totalPrice", thisCart.totalPrice);
    console.log("subtotalPrice", thisCart.subtotalPrice);
    console.log("totalNumber", thisCart.totalNumber);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;

    const indexOfcartProduct = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(indexOfcartProduct, 1);

    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
}

export default Cart;
