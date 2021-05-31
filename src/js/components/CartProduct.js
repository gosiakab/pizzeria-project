import { select } from "../settings.js";
import AmountWidget from "./components/AmountWidget.js";

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    console.log("new CartProduct", thisCartProduct);
    console.log("productData", menuProduct);
  }

  getData() {
    const thisCartProduct = this;

    const productSummary = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      amout: thisCartProduct.amount,
      params: thisCartProduct.params,
    };
    return productSummary;
  }
  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidgetElem = element.querySelector(
      select.cartProduct.amountWidget
    );
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(
      select.cartProduct.remove
    );
  }
  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new AmountWidget(
      thisCartProduct.dom.amountWidgetElem
    );

    thisCartProduct.dom.amountWidgetElem.addEventListener(
      "updated",
      function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price =
          thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      }
    );
  }
  remove() {
    const thisCartProduct = this;

    const event = new CustomEvent("remove", {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener("click", function (event) {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener("click", function (event) {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}

export default CartProduct;
