async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return alert('تمام فیلدها الزامی هستند');

  const result = await api.login(email, password);
  if (result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    window.location.href = '/';
  } else {
    alert('خطا در وارد شدن: ' + (result.error || 'نامشخص'));
  }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});
