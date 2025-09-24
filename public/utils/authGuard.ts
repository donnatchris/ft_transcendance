const token = localStorage.getItem("token");
if (!token) {
	console.log("[Public authGuard] No token found. Redirecting to login.");
	window.location.href = "login.html";
}
