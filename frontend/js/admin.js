document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('https://web-nongsan.onrender.com/api/admin/products');
      if (!response.ok) {
        throw new Error('Lỗi khi tải danh sách sản phẩm');
      }
      const products = await response.json();
      const adminProductList = document.getElementById('adminProductList');
  
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.seller_name || ''}</td>
          <td>
            <button onclick="approveProduct(${product.id})">Duyệt</button>
            <button onclick="deleteProduct(${product.id})">Xóa</button>
          </td>
        `;
        adminProductList.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      alert('Không thể tải danh sách sản phẩm.');
    }
  });
  
  async function approveProduct(productId) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${productId}/approve`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi duyệt sản phẩm');
      }
      alert('Duyệt sản phẩm thành công!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Không thể duyệt sản phẩm.');
    }
  }
  
  async function deleteProduct(productId) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Lỗi khi xóa sản phẩm');
      }
      alert('Xóa sản phẩm thành công!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Không thể xóa sản phẩm.');
    }
  }
  