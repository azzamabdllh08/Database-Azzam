const USERNAME = "TMG123";

const PASSWORD_HASH =
  "dd49477b0b970dde26d58606384cfedd0dc5740b719bffc06442e7d949849deb";

async function sha256(text) {
  const data = new TextEncoder().encode(text);

  const hashBuffer =
    await crypto.subtle.digest("SHA-256", data);

  return Array
    .from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const password =
      document.getElementById("password").value;

    const error =
      document.getElementById("error");

    const passwordHash =
      await sha256(password);

    if (
      username === USERNAME &&
      passwordHash === PASSWORD_HASH
    ) {

      sessionStorage.setItem(
        "dashboard_authenticated",
        "true"
      );

      window.location.href = "index.html";

    } else {

      error.style.display = "block";

    }

  });
