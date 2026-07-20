// theme.js - DreamTeam Theme Management Script
(function() {
  function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('dt_theme', themeName);
    updateToggleBtnIcon(themeName);
  }

  function updateToggleBtnIcon(themeName) {
    var icon = document.getElementById('theme-icon');
    if (!icon) return;
    if (themeName === 'light') {
      icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      icon.innerHTML = '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  // Check saved theme or use browser dark mode preference
  var savedTheme = localStorage.getItem('dt_theme');
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var initialTheme = savedTheme || 'light';
  
  // Set initial theme on HTML node immediately to prevent page flashing
  document.documentElement.setAttribute('data-theme', initialTheme);

  window.addEventListener('DOMContentLoaded', function() {
    updateToggleBtnIcon(initialTheme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
      });
    }
  });
})();
