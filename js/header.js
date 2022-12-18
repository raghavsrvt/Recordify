// Header
let menuBtn = document.getElementById('menu-btn');
let navBar = document.getElementById('resp-nav');
let respNavContainer = document.getElementById('resp-nav-container');

menuBtn.addEventListener('click', () => {
  navBar.classList.toggle('active');
  menuBtn.classList.toggle('active');

  if (navBar.classList.contains('active')) {
    respNavContainer.classList.add('not-active');
  }
  else {
    respNavContainer.classList.remove('not-active');
  }

  if (navBar.classList.contains('active')) {
    menuBtn.innerHTML = '<i class = "fa-solid fa-xmark"></i>';
  }

  else {
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
})

navBar.addEventListener('click', () => {
  navBar.classList.toggle('active');
  menuBtn.classList.toggle('active');

  if (navBar.classList.contains('active')) {
    menuBtn.innerHTML = '<i class = "fa-solid fa-xmark"></i>';
  }

  else {
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});