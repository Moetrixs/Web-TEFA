// Variabel global untuk menyimpan data produk
let products = [];

// Fungsi untuk menambahkan produk baru
function addProduct() {
    const nameInput = document.getElementById('product-name');
    const stockInput = document.getElementById('product-stock');
    const priceInput = document.getElementById('product-price');
    const descInput = document.getElementById('product-description');
    const imageInput = document.getElementById('product-image');
    
    const name = nameInput.value.trim();
    const stock = parseInt(stockInput.value);
    const price = parseInt(priceInput.value);
    const description = descInput.value.trim();
    const image = imageInput.value.trim();

    if (name === '' || isNaN(stock) || stock < 0 || isNaN(price) || price < 0 || description === '' || image === '') {
        alert('Mohon masukkan semua data produk dengan valid, termasuk harga dan URL gambar.');
        return;
    }
    
    products = getProducts();
    const newProduct = { name, stock, price, description, image };
    products.push(newProduct);
    
    saveProducts(products);
    
    // Bersihkan input
    nameInput.value = '';
    stockInput.value = '';
    priceInput.value = '';
    descInput.value = '';
    imageInput.value = '';
    
    alert('Produk berhasil ditambahkan!');
}

// Fungsi untuk menghapus produk
function deleteProduct(index) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        return;
    }
    
    products = getProducts();
    products.splice(index, 1);
    
    saveProducts(products);
    drawProducts();
}

// Fungsi untuk menampilkan formulir edit produk
function showEditForm(index) {
    products = getProducts();
    const product = products[index];

    document.getElementById('add-form').style.display = 'none';
    document.getElementById('edit-form').style.display = 'block';

    document.getElementById('edit-product-title').innerText = `Edit Produk: ${product.name}`;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-stock').value = product.stock;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-image').value = product.image;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-save-btn').dataset.index = index;
}

// Fungsi untuk menyimpan perubahan dari formulir edit
function saveEditedProduct() {
    const index = document.getElementById('edit-save-btn').dataset.index;
    const product = products[index];

    const newName = document.getElementById('edit-name').value.trim();
    const newStock = parseInt(document.getElementById('edit-stock').value);
    const newPrice = parseInt(document.getElementById('edit-price').value);
    const newImage = document.getElementById('edit-image').value.trim();
    const newDesc = document.getElementById('edit-description').value.trim();
    
    if (newName === '' || isNaN(newStock) || newStock < 0 || isNaN(newPrice) || newPrice < 0 || newImage === '' || newDesc === '') {
        alert('Mohon isi semua data dengan valid.');
        return;
    }

    product.name = newName;
    product.stock = newStock;
    product.price = newPrice;
    product.image = newImage;
    product.description = newDesc;

    saveProducts(products);
    alert('Perubahan berhasil disimpan!');
    window.location.href = 'katalog.html';
}

// Fungsi untuk membuat tautan WhatsApp
function createWhatsAppLink(productName, productPrice) {
    const phoneNumber = '6285263675857'; 
    const message = `Halo, saya tertarik dengan produk *${productName}* dengan harga Rp. ${productPrice} di Galeri Produk TEFA SMK Negeri 7 Pekanbaru. Apakah produk ini masih tersedia?`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Fungsi untuk menampilkan halaman detail produk
function showProductDetail(index) {
    products = getProducts();
    const product = products[index];

    if (!product) {
        alert('Produk tidak ditemukan!');
        return;
    }

    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-stock').innerText = `Stok: ${product.stock}`;
    document.getElementById('detail-description').innerText = product.description;
    document.getElementById('detail-price').innerText = `Harga: Rp. ${product.price}`;

    const orderBtn = document.getElementById('order-btn');
    orderBtn.href = createWhatsAppLink(product.name, product.price);
}

// Fungsi untuk menggambar produk di canvas (hanya di halaman katalog)
function drawProducts() {
    const canvas = document.getElementById('product-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    products = getProducts();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cardWidth = 300;
    const cardHeight = 350;
    const padding = 20;
    const cols = Math.floor(canvas.width / (cardWidth + padding));
    const rows = Math.ceil(products.length / cols);
    canvas.height = rows * (cardHeight + padding) + padding;

    products.forEach((product, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * (cardWidth + padding);
        const y = row * (cardHeight + padding);
        
        product.x = x;
        product.y = y;
        product.width = cardWidth;
        product.height = cardHeight;
        
        product.deleteBtn = { x: x + cardWidth - 40, y: y + 10, size: 30 };
        product.editBtn = { x: x + cardWidth - 80, y: y + 10, size: 30 };

        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, cardWidth, cardHeight);

        ctx.beginPath();
        ctx.arc(product.deleteBtn.x + product.deleteBtn.size / 2, product.deleteBtn.y + product.deleteBtn.size / 2, product.deleteBtn.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#dc3545';
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('X', product.deleteBtn.x + product.deleteBtn.size / 2, product.deleteBtn.y + product.deleteBtn.size / 2 + 7);
        
        ctx.beginPath();
        ctx.arc(product.editBtn.x + product.editBtn.size / 2, product.editBtn.y + product.editBtn.size / 2, product.editBtn.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffc107';
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('✎', product.editBtn.x + product.editBtn.size / 2, product.editBtn.y + product.editBtn.size / 2 + 5);

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, cardWidth, 200);
            
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(product.name, x + cardWidth / 2, y + 220);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = '#555';
            ctx.fillText(`Stok: ${product.stock} | Rp. ${product.price}`, x + cardWidth / 2, y + 245);
        };
        img.src = product.image;
    });
}

// Fungsi untuk mengambil data produk dari localStorage
function getProducts() {
    const productsJSON = localStorage.getItem('products');
    return productsJSON ? JSON.parse(productsJSON) : [];
}

// Fungsi untuk menyimpan data produk ke localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Event listener untuk mendeteksi klik pada canvas (hanya di halaman katalog)
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('product-canvas');
    if (!canvas) return;

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        products.forEach((product, index) => {
            if (mouseX >= product.editBtn.x && mouseX <= product.editBtn.x + product.editBtn.size &&
                mouseY >= product.editBtn.y && mouseY <= product.editBtn.y + product.editBtn.size) {
                window.location.href = `input.html?editIndex=${index}`;
                return;
            }

            if (mouseX >= product.deleteBtn.x && mouseX <= product.deleteBtn.x + product.deleteBtn.size &&
                mouseY >= product.deleteBtn.y && mouseY <= product.deleteBtn.y + product.deleteBtn.size) {
                deleteProduct(index);
                return;
            }
            
            if (mouseX >= product.x && mouseX <= product.x + product.width &&
                mouseY >= product.y && mouseY <= product.y + product.height) {
                window.location.href = `deskripsi.html?index=${index}`;
            }
        });
    });
});