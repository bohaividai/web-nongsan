// Hiển thị sản phẩm từ backend
let currentProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://web-nongsan.onrender.com/api/products')
    .then(res => res.json())
    .then(data => {
      currentProducts = data;
      renderProducts(currentProducts);
    })
    .catch(err => console.error('제품을 로드하는 중에 오류가 발생했습니다:', err));
});

function renderProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<p>제품을 찾을 수 없습니다!</p>";
    return;
  }

  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product");

    const imageUrl = `https://web-nongsan.onrender.com/uploads/${product.image.replace(/^\/+/, '')}`;


    div.innerHTML = `
      <img src="${imageUrl}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>장바구니에 추가</button>
    `;

    productList.appendChild(div);
  });
}





function searchProducts() {
  const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
  const filtered = currentProducts.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
}

// Thêm vào giỏ hàng
function addToCart(product) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("장바구니에 달기 전에 로그인해 주세요!");
    return;
  }

  const cartKey = `cart_${user.id}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(`장바구니에 ${product.name} 달겨요!`);
}

// 드롭 인/오우파워
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userActions = document.getElementById('userActions');

  if (user && userActions) {
    userActions.innerHTML = `
      👋 안녕, <strong>${user.name}</strong> |
      <a href="cart.html">🛒 장바구니</a> |
      ${user.role === 'seller' ? '<a href="seller.html">판매자 페이지</a> |' : ''}
      <a href="#" onclick="logout()">로그아웃</a>
    `;
  } else if (userActions) {
    userActions.innerHTML = `
      <a href="login.html">로그인</a> |
      <a href="signup.html">회원가입</a> |
      <a href="seller.html">판매자 계정</a> |
      <a href="cart.html">🛒 장바구니</a>
    `;
  }
});

function logout() {
  if (confirm('로그아웃하고 싶습니까?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  }
}
