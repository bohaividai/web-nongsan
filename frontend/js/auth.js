const apiUrl = 'https://web-nongsan.onrender.com/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  // Đăng ký
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      try {
        const res = await fetch(`${apiUrl}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
          window.location.href = 'login.html';
        }
      } catch (error) {
        alert('Lỗi kết nối tới server.');
        console.error(error);
      }
    });
  }

  // Đăng nhập
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        alert('Đăng nhập thành công!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'index.html';
      } catch (error) {
        alert('Lỗi kết nối tới server.');
        console.error(error);
      }
    });
  }
});
