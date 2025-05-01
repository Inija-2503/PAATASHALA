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

