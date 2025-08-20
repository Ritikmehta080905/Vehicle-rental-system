
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

// Close the navigation when a link is clicked
navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// ScrollReveal options
const scrollRevealOptions = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

// Apply ScrollReveal to different sections
ScrollReveal().reveal(".header__container h1", { ...scrollRevealOptions });
ScrollReveal().reveal(".header__container form", { ...scrollRevealOptions, delay: 500 });
ScrollReveal().reveal(".header__container img", { ...scrollRevealOptions, delay: 1000 });
ScrollReveal().reveal(".range__card", { duration: 1000, interval: 500 });
ScrollReveal().reveal(".location__image img", { ...scrollRevealOptions, origin: "right" });
ScrollReveal().reveal(".location__content .section__header", { ...scrollRevealOptions, delay: 500 });
ScrollReveal().reveal(".location__content p", { ...scrollRevealOptions, delay: 1000 });
ScrollReveal().reveal(".location__content .location__btn", { ...scrollRevealOptions, delay: 1500 });
ScrollReveal().reveal(".story__card", { ...scrollRevealOptions, interval: 500 });
ScrollReveal().reveal(".download__image img", { ...scrollRevealOptions, origin: "right" });
ScrollReveal().reveal(".download__content .section__header", { ...scrollRevealOptions, delay: 500 });
ScrollReveal().reveal(".download__links", { ...scrollRevealOptions, delay: 1000 });

// Swiper configuration for image carousel
const price = ["225", "455", "275", "625", "395"];
const priceEl = document.getElementById("select-price");

function updateSwiperImage(eventName, args) {
  if (eventName === "slideChangeTransitionStart") {
    const index = args && args[0].realIndex;
    priceEl.innerText = price[index];
    const selectCards = document.querySelectorAll(".select__card");
    selectCards.forEach((item) => item.classList.remove("show__info"));
    selectCards[index].classList.add("show__info");
  }
}

const swiper = new Swiper(".swiper", {
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    depth: 500,
    modifier: 1,
    scale: 0.75,
    slideShadows: false,
    stretch: -100,
  },
  onAny(event, ...args) {
    updateSwiperImage(event, args);
  },
});

// Clone banner items for infinite scroll effect
const banner = document.querySelector(".banner__wrapper");
const bannerContent = Array.from(banner.children);
bannerContent.forEach((item) => {
  const duplicateNode = item.cloneNode(true);
  duplicateNode.setAttribute("aria-hidden", true);
  banner.appendChild(duplicateNode);
});

//admin
async function fetchRenters() {
  const response = await fetch('http://localhost:5000/admin/renters');
  const renters = await response.json();
  displayUsers(renters);
}

async function fetchListers() {
  const response = await fetch('http://localhost:5000/admin/listers');
  const listers = await response.json();
  displayUsers(listers);
}

function displayUsers(users) {
  const tableBody = document.getElementById('user-table-body');
  tableBody.innerHTML = ""; // Clear previous data

  users.forEach(user => {
      const row = `<tr>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.mobile_number}</td>
      </tr>`;
      tableBody.innerHTML += row;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var map = L.map('map').setView([37.7749, -122.4194], 13); // Default to San Francisco

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([37.7749, -122.4194]).addTo(map)  // Marker on the map
      .bindPopup("Hello! This is your rental location.")
      .openPopup();
});

var map = L.map('map').setView([19.029714807212617, 73.01662163754607], 13); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([19.029714807212617, 73.01662163754607]).addTo(map)
    .bindPopup("Hello! This is your rental location.")
    .openPopup();

   
  
  L.marker([19.029714807212617, 73.01662163754607], { icon: customIcon }).addTo(map)
      .bindPopup("Terna Engineering College");
  

