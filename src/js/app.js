import { settings, select, classNames, templates } from "./settings.js";
import Product from "./components/Product.js";
import Cart from "./components/Cart.js";
/* import AmountWidget from "./components/AmountWidget.js";
import CartProduct from "./components/CartProduct.js";*/

const app = {
  initData: function () {
    const thisApp = this;

    //thisApp.data = dataSource;
    thisApp.data = {};
    const url = settings.db.url + "/" + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log("parsedRespnse", parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log("thisApp.data", JSON.stringify(thisApp.data));
  },

  initMenu: function () {
    const thisApp = this;
    console.log("thisApp.data:", thisApp.data);

    for (let productData in thisApp.data.products) {
      //new Product(productData, thisApp.data.products[productData]);
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  init: function () {
    const thisApp = this;
    console.log("*** App starting ***");
    console.log("thisApp:", thisApp);
    console.log("classNames:", classNames);
    console.log("settings:", settings);
    console.log("templates:", templates);
    thisApp.initData();
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener("add-to-cart", function (event) {
      app.cart.add(event.detail.product);
    });
  },
};

app.init();
app.initCart();
