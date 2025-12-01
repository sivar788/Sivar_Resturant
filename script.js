 // ===================================
      // 1. THEME SWITCHER (Dark/Light Mode)
      // ===================================
      const themeToggleBtn = document.getElementById("theme-toggle");
      const sunIcon = document.getElementById("sun-icon");
      const moonIcon = document.getElementById("moon-icon");

      function toggleTheme() {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
          sunIcon.classList.remove("hidden");
          moonIcon.classList.add("hidden");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          moonIcon.classList.remove("hidden");
          sunIcon.classList.add("hidden");
        }
      }

      // Apply saved theme or default to light
      function loadTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
          moonIcon.classList.remove("hidden");
          sunIcon.classList.add("hidden");
        } else {
          document.documentElement.classList.remove("dark");
          sunIcon.classList.remove("hidden");
          moonIcon.classList.add("hidden");
        }
      }

      themeToggleBtn.addEventListener("click", toggleTheme);
      loadTheme();

      // ===================================
      // 2. SINGLE-PAGE NAVIGATION
      // ===================================
      function showPage(pageId) {
        // Hide all sections
        document.querySelectorAll(".page-section").forEach((section) => {
          section.classList.remove("active");
        });
        // Show the target section
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
          targetSection.classList.add("active");
        }

        // Hide mobile menu on navigation
        document.getElementById("mobile-menu").classList.add("hidden");

        // Update URL hash (for back button/link sharing)
        history.pushState(null, null, `#${pageId}`);
      }

      // Handle URL hash on load
      window.onload = function () {
        const initialHash = window.location.hash.substring(1) || "home";
        showPage(initialHash);
      };
      // Handle back button
      window.addEventListener("popstate", () => {
        const hash = window.location.hash.substring(1) || "home";
        showPage(hash);
      });

      // Mobile Menu Toggle
      document
        .getElementById("mobile-menu-btn")
        .addEventListener("click", () => {
          document.getElementById("mobile-menu").classList.toggle("hidden");
        });

      // ===================================
      // 3. MENU FILTERING
      // ===================================
      function filterMenu(tag = "all") {
        const menuItems = document.querySelectorAll(".menu-item-card");
        const filterButtons = document.querySelectorAll(".menu-filter-btn");

        // Update active state on buttons
        filterButtons.forEach((btn) => {
          btn.classList.remove(
            "active-filter",
            "bg-primary-brand",
            "text-white"
          );
          btn.classList.add(
            "border-gray-400",
            "dark:border-gray-500",
            "hover:bg-gray-200",
            "dark:hover:bg-dark-card",
            "text-gray-800",
            "dark:text-gray-200"
          );
          if (btn.getAttribute("data-tag") === tag) {
            btn.classList.add(
              "active-filter",
              "bg-primary-brand",
              "text-white"
            );
            btn.classList.remove(
              "border-gray-400",
              "dark:border-gray-500",
              "hover:bg-gray-200",
              "dark:hover:bg-dark-card",
              "text-gray-800",
              "dark:text-gray-200"
            );
          }
        });

        // Filter items
        menuItems.forEach((item) => {
          const itemTags = item.getAttribute("data-tags").split(" ");
          const search = document
            .getElementById("menu-search")
            .value.toLowerCase();
          const name = item.querySelector("h4").textContent.toLowerCase();

          const tagMatch = tag === "all" || itemTags.includes(tag);
          const searchMatch = name.includes(search);

          if (tagMatch && searchMatch) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      }

      // ===================================
      // 4. MOCK ONLINE ORDERING / CART
      // ===================================
      let cart = [];
      const TAX_RATE = 0.08;

      function renderCart() {
        const cartItemsEl = document.getElementById("cart-items");
        const subtotalEl = document.getElementById("cart-subtotal");
        const taxEl = document.getElementById("cart-tax");
        const totalEl = document.getElementById("cart-total");
        const emptyMessage = document.getElementById("empty-cart-message");

        cartItemsEl.innerHTML = ""; // Clear current items

        if (cart.length === 0) {
          emptyMessage.style.display = "block";
          subtotalEl.textContent = "$0.00";
          taxEl.textContent = "$0.00";
          totalEl.textContent = "$0.00";
          return;
        }

        emptyMessage.style.display = "none";
        let subtotal = 0;

        // Group items by ID and calculate quantity
        const groupedCart = cart.reduce((acc, item) => {
          const existing = acc.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity++;
          } else {
            acc.push({ ...item, quantity: 1 });
          }
          return acc;
        }, []);

        groupedCart.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          const itemEl = document.createElement("div");
          itemEl.className = "flex justify-between items-center text-sm";
          itemEl.innerHTML = `
                    <span class="font-medium truncate max-w-[150px]">${
                      item.quantity
                    }x ${item.name}</span>
                    <div class="flex items-center space-x-2">
                        <span class="font-bold">$${itemTotal.toFixed(2)}</span>
                        <button onclick="removeFromCart(${
                          item.id
                        })" class="text-red-500 hover:text-red-700 text-lg leading-none p-1" aria-label="Remove one ${
            item.name
          }">&times;</button>
                    </div>
                `;
          cartItemsEl.appendChild(itemEl);
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
      }

      function addToCart(item) {
        cart.push(item);
        renderCart();
        alert(`${item.name} added to cart!`);
      }

      function removeFromCart(itemId) {
        const index = cart.findIndex((item) => item.id === itemId);
        if (index > -1) {
          cart.splice(index, 1); // Remove only one instance
        }
        renderCart();
      }

      function checkout() {
        if (cart.length === 0) {
          alert("Your cart is empty. Please add items before checking out.");
          return;
        }
        const total = parseFloat(
          document.getElementById("cart-total").textContent.replace("$", "")
        );
        alert(
          `Simulating Checkout! Total: $${total.toFixed(
            2
          )}. Thank you for your mock order!`
        );
        // Clear cart after mock checkout
        cart = [];
        renderCart();
      }

      // Initial call for cart and menu filter
      renderCart();
      filterMenu("all");