document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You are not logged in.");
    window.location.href = "/pages/sign.html";
    return;
  }

  fetch("/api/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Authentication failed");
      }
      return res.json();
    })
    .then((data) => {
      const user = data.data.user;
      document.getElementById("name").textContent = user.name;
      document.getElementById("email").textContent = user.email;
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      alert("Session expired or invalid token. Please sign in again.");
      localStorage.removeItem("token");
      window.location.href = "/pages/sign.html";
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/pages/sign.html";
  });
});
