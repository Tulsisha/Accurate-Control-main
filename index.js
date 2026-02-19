
/* ================= GLOBAL DATA ================= */

let productData = {};
let currentBrand = "";


/* ================= LOAD BRAND DATA ================= */

async function loadBrandData(brandName) {

    currentBrand = brandName;

    try {
        const response = await fetch(`products/${brandName}.json`);
        productData = await response.json();

        // Open first available category by default
        const firstCategory = Object.keys(productData)[0];
        renderAllModels(firstCategory);

    } catch (error) {
        document.getElementById('contentArea').innerHTML =
            "<div class='alert alert-danger'>Unable to load product data</div>";
    }
}


/* ================= SIDEBAR TAB ================= */

function setActiveTab(element, category) {

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });

    element.classList.add('active');

    document.querySelectorAll('.submenu').forEach(menu => {
        menu.classList.remove('show');
    });

    const target = element.getAttribute('data-bs-target');
    if (target) document.querySelector(target).classList.add('show');

    renderAllModels(category);
}


/* ================= SHOW SINGLE PRODUCT ================= */

function showProduct(category, productKey, element) {

    const submenu = element.closest('.submenu');
    submenu.querySelectorAll('.submenu-item').forEach(item => {
        item.classList.remove('active');
    });

    element.classList.add('active');

    renderSingleProduct(category, productKey);
}


/* ================= RENDER ALL MODELS ================= */

function renderAllModels(category) {

    const data = productData[category];

    if (!data) {
        document.getElementById('contentArea').innerHTML =
            '<div class="alert alert-warning">Category not found</div>';
        return;
    }

    const modelsHTML = Object.entries(data.models).map(([key, model]) => `
        <div class="col-lg-6 col-md-6 mb-4">
            <div class="model-card" onclick="showProductFromCard('${category}', '${key}')">
                <div class="model-image model-imagess">
                    <img src="${model.image}" alt="${model.name}"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e8ecf1%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%235a6376%22%3E${model.name}%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="model-info">
                    <div class="model-name">${model.name}</div>
                    <div class="model-description">${model.description}</div>
                    <span class="model-badge">${model.badge}</span>
                </div>
            </div>
        </div>
    `).join('');

    const html = `
        <h2 class="product-title">${data.title}</h2>

        <div class="description-box">
            <p>${data.description}</p>
        </div>

        <h4 class="mt-4 mb-3" style="font-family: 'Rajdhani', sans-serif; color: var(--siemens-dark); font-weight: 600;">
            <i class="bi bi-grid-3x3-gap me-2"></i>Available Models
        </h4>

        <div class="row">
            ${modelsHTML}
        </div>

        <div class="features-box">
            <h3>Category Features & Advantages</h3>
            <ul class="feature-list">
                ${data.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}


/* ================= RENDER SINGLE PRODUCT ================= */

function renderSingleProduct(category, productKey) {

    const data = productData[category];
    const model = data.models[productKey];

    if (!model) {
        document.getElementById('contentArea').innerHTML =
            '<div class="alert alert-warning">Product not found</div>';
        return;
    }

    const html = `
        <h2 class="product-title">${data.title}</h2>

        <div class="description-box">
            <p>${data.description}</p>
        </div>

        <div class="row">
            <div class="col-md-12 mb-4">
                <div class="model-card">
                    <div class="model-image">
                        <img src="${model.image}" alt="${model.name}"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e8ecf1%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%235a6376%22%3E${model.name}%3C/text%3E%3C/svg%3E'">
                    </div>
                    <div class="model-info">
                        <div class="model-name">${model.name}</div>
                        <div class="model-description">${model.description}</div>
                        <span class="model-badge">${model.badge}</span>
                    </div>
                </div>
            </div>
        </div>

        ${model.specs ? `
        <div class="features-box">
            <h3><i class="bi bi-cpu me-2"></i>Technical Specifications</h3>
            <ul class="feature-list">
                ${model.specs.map(spec => `<li>${spec}</li>`).join('')}
            </ul>
        </div>` : ''}

        <div class="features-box">
            <h3><i class="bi bi-star me-2"></i>Key Features & Benefits</h3>
            <ul class="feature-list">
                ${data.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>

        <div class="alert alert-info mt-4">
            <strong>Need more information?</strong> Contact our technical team for ${model.name}.
        </div>
    `;

    document.getElementById('contentArea').innerHTML = html;
}


/* ================= CARD CLICK ================= */

function showProductFromCard(category, productKey) {

    const submenu = document.getElementById(`submenu-${category}`);

    if (submenu) {
        submenu.querySelectorAll('.submenu-item').forEach(item => {
            const onclick = item.getAttribute('onclick');
            item.classList.toggle('active', onclick && onclick.includes(`'${productKey}'`));
        });
    }

    renderSingleProduct(category, productKey);
}


/* ================= AUTO LOAD BRAND ================= */

document.addEventListener('DOMContentLoaded', function () {

    const pageName = window.location.pathname
        .split('/')
        .pop()
        .replace('.html', '');

    loadBrandData(pageName);
});


// side bar menu

function loadPart(id, file) {
    fetch(file)
      .then(res => res.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      })
      .then(initSidebar); // important
  }
  
  function initSidebar() {
  
    const menuToggle = document.getElementById("menuToggle");
    const sidePanel = document.getElementById("sidePanel");
    const menuClose = document.getElementById("menuClose");
    const menuOverlay = document.getElementById("menuOverlay");
  
    if (!menuToggle) return;
  
    menuToggle.onclick = () => {
      sidePanel.classList.add("active");
      menuOverlay.classList.add("active");
    };
  
    menuClose.onclick = () => {
      sidePanel.classList.remove("active");
      menuOverlay.classList.remove("active");
    };
  
    menuOverlay.onclick = () => {
      sidePanel.classList.remove("active");
      menuOverlay.classList.remove("active");
    };
  }
  
  loadPart("header", "./Header.html");
  loadPart("footer", "./footer.html");
  