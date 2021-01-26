/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  ("use strict");

  const select = {
    templateOf: {
      menuProduct: "#template-menu-product",
    },
    containerOf: {
      menu: "#product-list",
      cart: "#cart",
    },
    all: {
      menuProducts: "#product-list > .product",
      menuProductsActive: "#product-list > .product.active",
      formInputs: "input, select",
    },
    menuProduct: {
      clickable: ".product__header",
      form: ".product__order",
      priceElem: ".product__total-price .price",
      imageWrapper: ".product__images",
      amountWidget: ".widget-amount",
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: "active",
      imageVisible: "active",
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
  };
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      console.log("new Product:", thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      console.log("HTML generated!");

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMfromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );
      thisProduct.form = thisProduct.element.querySelector(
        select.menuProduct.form
      );
      thisProduct.formInputs = thisProduct.form.querySelectorAll(
        select.all.formInputs
      );
      thisProduct.cartButton = thisProduct.element.querySelector(
        select.menuProduct.cartButton
      );
      thisProduct.priceElem = thisProduct.element.querySelector(
        select.menuProduct.priceElem
      );
      thisProduct.imageWrapper = thisProduct.element.querySelector(
        select.menuProduct.imageWrapper
      );
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(
        select.menuProduct.amountWidget
      );
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener("update", function (event) {
        thisProduct.processOrder();
      });
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );

      /* START: click event listener to trigger */
      clickableTrigger.addEventListener("click", function (event) {
        console.log("Clicked!");

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classlist.toggle("active");

        /* find all active products */
        const allActiveProducts = document.querySelector(
          select.all.menuProductsActive
        );

        /* START LOOP: for each active product */
        for (let activeProduct of allActiveProducts) {
          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != null && activeProduct != thisProduct.element) {
            /* remove class active for the active product */
            activeProduct.classlist.remove("active");

            /* END: if the active product isn't the element of thisProduct */
          }

          /* END LOOP: for each active product */
        }

        /* END: click event listener to trigger */
      });
    }

    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener("submit", function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener("change", function () {
          thisProduct.processOrder();
        });
      }
      thisProduct.cartButton.addEventListener("click", function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log("formData", formData);

      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;

      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params) {
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];

        /* START LOOP: for each optionId in param.options */
        for (let optionId in param.options) {
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];

          const selectedOption =
            formData[paramId] && formData[paramId].includes(optionId);

          /* START IF: if option is selected and option is not default */
          if (selectedOption) {
            if (!option.default == true) {
              price = price + 0;
            } else if (!option.default == true) {
              price = price + option.price;
            } else if (!option.default == true) {
              price = price - option.price;
            }

            const image = thisProduct.imageWrapper.querySelector(
              "." + paramId + "-" + optionId
            );
            if (image) {
              image.classList.add(classNames.menuProduct.imageVisible);
            } else {
              image.classlist.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }

      /* multiply price by amount */
      price *= thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = price;
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      console.log("AmountWidget:", thisWidget);
      console.log("constructor arguments:", element);

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(
        select.widgets.amount.input
      );
      thisWidget.linkDecrease = thisWidget.element.querySelector(
        select.widgets.amount.linkDecrease
      );
      thisWidget.linkIncrease = thisWidget.element.querySelector(
        select.widgets.amount.linkIncrease
      );
      thisWidget.value = thisWidget.element.querySelector(
        settings.amountWidget.defaultValue
      );
    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      /*TODO: Add validation */

      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.input.value = thisWidget.value;
    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener("change", function (event) {
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener("click", function (event) {
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener("click", function (event) {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce() {
      const thisWidget = this;

      const event = new Event("update");
      thisWidget.element.dispatchEvent(event);
    }
  }

  const app = {
    initMenu: function () {
      const testProduct = new Product();
      console.log("testProduct:", testProduct);
    },
    init: function () {
      const thisApp = this;
      console.log("*** App starting ***");
      console.log("thisApp:", thisApp);
      console.log("classNames:", classNames);
      console.log("settings:", settings);
      console.log("templates:", templates);

      thisApp.initMenu();
    },
  };

  app.init();
}
