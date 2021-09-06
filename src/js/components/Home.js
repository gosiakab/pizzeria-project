/*global Flickity */
import { templates, select } from "../settings.js";
import { app } from "/js/app.js";

class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.render(element);
    thisHome.initWidgets();
    thisHome.goToPage();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.order = element.querySelector(select.home.order);
    thisHome.dom.booking = element.querySelector(select.home.booking);
  }

  initWidgets() {
    const thisHome = this;

    thisHome.element = document.querySelector(select.home.carousel);
    thisHome.flkty = new Flickity(thisHome.element, {
      // eslint-disable-line
      cellAlign: "left",
      contain: true,
      prevNextButtons: false,
      autoPlay: true,
    });
  }

  goToPage() {
    const thisHome = this;

    thisHome.dom.order.addEventListener("click", function () {
      app.activatePage("order");
    });
    thisHome.dom.booking.addEventListener("click", function () {
      app.activatePage("booking");
    });
  }
}

export default Home;
