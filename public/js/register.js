async function register() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!username || !email || !password) return alert('تمام فیلدها الزامی هستند');
  if (password !== confirmPassword) return alert('رمز های عبور مطابقت ندارند');

  const result = await api.register(username, email, password);
  if (result.userId) {
    alert('ثبت نام موفقیت آمیز! اکنون وارد شوید');
    window.location.href = '/login.html';
  } else {
    alert('خطا در ثبت نام: ' + (result.error || 'نامشخص'));
  }
}

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  register();
});
