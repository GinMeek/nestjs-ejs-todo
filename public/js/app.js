document.addEventListener('DOMContentLoaded', () => {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Initial check data-bs-theme="dark"
  if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

  // Listen for changes in the system preference
  prefersDarkScheme.addEventListener('change', (event) => {
    if (event.matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  });

  const toastElements = document.querySelectorAll('.toast');
  toastElements.forEach((el) => {
    // Bootstrap 5 auto-hides after 5000ms by default
    const toast = new bootstrap.Toast(el, { delay: 5000 });
    toast.show();

    // Remove the toast from DOM after it's hidden to keep it clean
    el.addEventListener('hidden.bs.toast', () => {
      el.remove();
      // If no toasts left, remove the Close All button
      if (document.querySelectorAll('.toast').length === 0) {
        closeAllToasts();
      }
    });
  });
});

function closeAllToasts() {
  const toastElList = document.querySelectorAll('.toast');
  toastElList.forEach((el) => {
    const toast = bootstrap.Toast.getInstance(el);
    if (toast) toast.hide();
  });
  // Optional: Hide the Close All button itself
  const closeBtn = document.querySelector('[onclick="closeAllToasts()"]');
  if (closeBtn) closeBtn.style.display = 'none';
}
