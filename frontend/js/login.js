const formLogin = document.getElementById("formLogin");
const mensajeError = document.getElementById("mensajeError");

if (getToken()) {
  window.location.href = "dashboard.html";
}

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeError.style.display = "none";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    guardarSesion(data.token, data.usuario);
    window.location.href = "dashboard.html";
  } catch (err) {
    mensajeError.textContent = err.message;
    mensajeError.style.display = "block";
  }
});
