const form = document.getElementById('profile-form');
const profileDisplay = document.getElementById('profile-display');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const bioInput = document.getElementById('bio');
const picInput = document.getElementById('profilePic');

const displayPic = document.getElementById('displayPic');
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');
const displayBio = document.getElementById('displayBio');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const reader = new FileReader();
  const file = picInput.files[0];

  reader.onload = function () {
    displayPic.src = reader.result;
    showProfile();
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    showProfile(); // No image selected
  }
});

function showProfile() {
  displayName.textContent = nameInput.value;
  displayEmail.textContent = emailInput.value;
  displayBio.textContent = bioInput.value;

  form.style.display = 'none';
  profileDisplay.style.display = 'block';
}

function editProfile() {
  form.style.display = 'block';
  profileDisplay.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const profilePicInput = document.getElementById('profilePic');
  const fileNameDisplay = document.getElementById('fileName');

  uploadBtn.addEventListener('click', () => {
    profilePicInput.click();
  });

  profilePicInput.addEventListener('change', () => {
    const fileName = profilePicInput.files[0]?.name || 'No file chosen';
    fileNameDisplay.textContent = fileName;
  });

  // Prevent form reload on submit (if you’re handling data manually)
  const form = document.getElementById('profile-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Your existing save logic goes here
  });
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear any stored data if needed (e.g., localStorage or sessionStorage)
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to the sign-in page
  window.location.href = "../pages/sign.html";  // update path if sign-in page is elsewhere
});
