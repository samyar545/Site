async function loadNotifications() {
  if (!isLoggedIn()) return window.location.href = '/login.html';

  const result = await api.getNotifications();
  const notifications = result.notifications || [];
  const unreadCount = result.unreadCount || 0;

  const notificationsPanel = document.getElementById('notificationsPanel');
  notificationsPanel.innerHTML = `
    <div class="notifications-header">
      <p>خوانده نشده: ${unreadCount}</p>
      ${unreadCount > 0 ? '<button onclick="markAllAsRead()" class="btn-small">علامت گذاری همه به عنوان خوانده شده</button>' : ''}
    </div>
    <div class="notifications-list">
      ${notifications.map(n => `
        <div class="notification-item ${n.is_read ? 'read' : 'unread'}">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
          <p class="date">${new Date(n.created_at).toLocaleDateString('fa-IR')}</p>
          <button onclick="deleteNotification(${n.id})" class="btn-small-danger">حذف</button>
        </div>
      `).join('')}
    </div>
  `;
}

async function markAllAsRead() {
  await api.markAllAsRead();
  loadNotifications();
}

async function deleteNotification(id) {
  await api.deleteNotification(id);
  loadNotifications();
}

document.addEventListener('DOMContentLoaded', loadNotifications);
