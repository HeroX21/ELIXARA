// ELIXARA site interactions: navigation, filters, search, modal, FAQ, scroll states.
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const header = document.querySelector("[data-header]");
const scrollTopButton = document.querySelector("[data-scroll-top]");
const modal = document.querySelector("[data-product-modal]");
const modalContent = document.querySelector("[data-modal-content]");

const products = {
  "arabic-oud-attar": {
    name: "Arabic Oud Attar",
    category: "Arabic Attars",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-oud.svg",
    description: "Warm oud attar with a soft amber base, suitable for evening wear and gifting."
  },
  "rose-musk-attar": {
    name: "Rose Musk Attar",
    category: "Arabic Attars",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-rose.svg",
    description: "Alcohol-free rose and musk profile with a clean, traditional feel."
  },
  "daily-musk": {
    name: "Daily Musk Perfume",
    category: "Daily Wear Perfumes",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-musk.svg",
    description: "Fresh musk perfume made for office, college, and everyday use."
  },
  "long-lasting-oud": {
    name: "Long Lasting Oud",
    category: "Long Lasting Perfumes",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-oud.svg",
    description: "A stronger perfume blend with woody oud and amber notes for longer wear."
  },
  "inspired-classic": {
    name: "Inspired Classic Blend",
    category: "Inspired Fragrances",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-gift.svg",
    description: "A familiar modern fragrance profile crafted for daily confidence."
  },
  "oud-gift-set": {
    name: "Oud Gift Set",
    category: "Oud Collection",
    price: "Ask on WhatsApp",
    image: "assets/images/perfume-gift.svg",
    description: "Gift-ready oud and attar pairing for festivals, weddings, and family occasions."
  }
};

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("hidden");
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("shadow-md", window.scrollY > 12);
  header.classList.toggle("bg-[#fff8eb]/96", window.scrollY > 12 && !header.classList.contains("dark-nav"));
  if (scrollTopButton) {
    scrollTopButton.classList.toggle("opacity-0", window.scrollY < 420);
    scrollTopButton.classList.toggle("pointer-events-none", window.scrollY < 420);
  }
};

window.addEventListener("scroll", updateHeader);
updateHeader();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const applyProductFilters = () => {
  const activeFilter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const searchTerm = (document.querySelector("[data-product-search]")?.value || "").trim().toLowerCase();
  document.querySelectorAll("[data-product-card]").forEach((card) => {
    const matchesCategory = activeFilter === "all" || card.dataset.productCategory === activeFilter;
    const matchesSearch = card.dataset.productText.includes(searchTerm);
    card.classList.toggle("hidden", !(matchesCategory && matchesSearch));
  });
};

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyProductFilters();
  });
});

document.querySelector("[data-product-search]")?.addEventListener("input", applyProductFilters);

const closeModal = () => {
  modal?.classList.add("hidden");
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-product-id]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = products[button.dataset.productId];
    if (!modal || !modalContent || !product) return;
    modalContent.innerHTML = `
      <button class="absolute right-4 top-4 text-3xl text-[#171717]" type="button" aria-label="Close product details" data-modal-close>&times;</button>
      <div class="grid gap-6 md:grid-cols-[.9fr_1.1fr]">
        <img src="${product.image}" alt="${product.name}" class="h-72 w-full bg-[#efe1bf] object-cover" loading="lazy">
        <div class="flex flex-col justify-center">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-[#9a742e]">${product.category}</p>
          <h2 class="mt-3 font-luxury text-4xl text-[#171717]">${product.name}</h2>
          <p class="mt-4 text-sm leading-7 text-black/68">${product.description}</p>
          <p class="mt-4 font-semibold text-[#171717]">${product.price}</p>
          <a href="https://wa.me/918929393525?text=Hello%20ELIXARA%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(product.name)}" class="primary-button mt-7 w-fit" target="_blank" rel="noopener">Inquire on WhatsApp</a>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    modalContent.querySelector("[data-modal-close]")?.addEventListener("click", closeModal);
  });
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.querySelectorAll("[data-faq-question]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.closest("[data-faq-item]")?.querySelector("[data-faq-answer]");
    const icon = button.querySelector("[data-faq-icon]");
    answer?.classList.toggle("hidden");
    icon?.classList.toggle("rotate-45");
  });
});

document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const message = [
    "Hello ELIXARA, I want to inquire about perfumes/attars.",
    `Name: ${formData.get("name") || ""}`,
    `Phone: ${formData.get("phone") || ""}`,
    `Interest: ${formData.get("interest") || ""}`,
    `Message: ${formData.get("message") || ""}`
  ].join("\n");
  window.open(`https://wa.me/918929393525?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

scrollTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
