async function loadProfile() {
  if (!isLoggedIn()) return window.location.href = '/login.html';

  const result = await api.getProfile();
  const user = result;
  const profileInfo = document.getElementById('profileInfo');
  profileInfo.innerHTML = `
    <div class="profile-header">
      ${user.avatar ? `<img src="${user.avatar}" alt="${user.username}" class="avatar" />` : '<div class="avatar-placeholder">👤</div>'}
      <div class="profile-text">
        <h2>${user.username}</h2>
        <p>${user.email}</p>
        ${user.bio ? `<p class="bio">${user.bio}</p>` : ''}
        <p class="date">عضویت: ${new Date(user.created_at).toLocaleDateString('fa-IR')}</p>
      </div>
    </div>
    <button onclick="editProfile()" class="btn">ویرایش پروفایل</button>
    <button onclick="window.location.href='#change-password'" class="btn">تغیر رمز عبور</button>
  `;
}

function editProfile() {
  alert('بخش ویرایش پروفایل');
}

document.addEventListener('DOMContentLoaded', loadProfile);
