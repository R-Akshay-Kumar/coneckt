document.addEventListener("DOMContentLoaded", () => {

    // AUTH SECTION (LOGIN + SIGNUP)
    const authForm = document.getElementById("auth-form");
    const formContainer = document.getElementById("form-container");
    const formToggleLink = document.getElementById("form-toggle-link");

    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const mode = formContainer.dataset.mode;

            if (mode === "signup") {
                const fullName = document.getElementById("full-name").value;

                if (!fullName || !email || !password) {
                    alert("⚠️ Please fill all fields.");
                    return;
                }

                const res = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ full_name: fullName, email, password })
                });

                const data = await res.json();
                alert(data.message);
                formToggleLink.click();
                return;
            }

            if (mode === "login") {
                const res = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("user_name", data.user_name);
                    window.location.href = "chat.html";
                } else {
                    alert(data.message);
                }
            }
        });

        // Toggle between Login and Signup modes
        formToggleLink.addEventListener("click", (e) => {
            e.preventDefault();

            const formTitle = document.getElementById("form-title");
            const submitBtn = document.getElementById("submit-btn");
            const togglePrompt = document.getElementById("toggle-prompt");

            if (formContainer.dataset.mode === "login") {
                formContainer.dataset.mode = "signup";
                formTitle.textContent = "Create Account";
                submitBtn.textContent = "Sign Up";
                togglePrompt.textContent = "Already have an account?";
                formToggleLink.textContent = "Login here";
            } else {
                formContainer.dataset.mode = "login";
                formTitle.textContent = "Welcome Back";
                submitBtn.textContent = "Login";
                togglePrompt.textContent = "Don't have an account?";
                formToggleLink.textContent = "Sign up here";
            }
        });
    }

    // -------------------- CHAT PAGE SECTION --------------------
    const messageForm = document.getElementById("message-form");
    if (messageForm) {
        const messageInput = document.getElementById("message-input");
        const messageList = document.getElementById("message-list");
        const contactList = document.getElementById("contact-list");
        const groupList = document.getElementById("group-list");
        const chatWithName = document.getElementById("chat-with-name");
        const listPanelTitle = document.getElementById("list-panel-title");

        const profileBtn = document.getElementById("profile-btn");
        const profileMenu = document.getElementById("profile-menu");
        const logoutBtn = document.getElementById("logout-btn");
        const navButtons = document.querySelectorAll(".nav-button");

        profileBtn.addEventListener("click", (event) => {
            profileMenu.classList.toggle("show");
            event.stopPropagation();
        });

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "login.html";
        });

        window.addEventListener("click", (e) => {
            if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove("show");
            }
        });

        navButtons.forEach(button => {
            button.addEventListener("click", () => {
                navButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                
                const tab = button.dataset.tab;
                if (tab === "chats") {
                    contactList.style.display = "block";
                    groupList.style.display = "none";
                    listPanelTitle.textContent = "Chats";
                    const firstChat = contactList.querySelector(".contact-item");
                    if (firstChat) firstChat.click();
                } else if (tab === "groups") {
                    contactList.style.display = "none";
                    groupList.style.display = "block";
                    listPanelTitle.textContent = "Groups";
                    const firstGroup = groupList.querySelector(".contact-item");
                    if (firstGroup) firstGroup.click();
                }
            });
        });

        messageForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const messageText = messageInput.value.trim();

            if (messageText !== "") {
                createMessageElement(messageText, "sent");
                messageInput.value = "";
                messageList.scrollTop = messageList.scrollHeight;

                setTimeout(() => {
                    createMessageElement("Hello!", "received");
                    messageList.scrollTop = messageList.scrollHeight;
                }, 1000);
            }
        });

        function createMessageElement(text, type) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", type);
            const textP = document.createElement("p");
            textP.textContent = text;
            const timestampSpan = document.createElement("span");
            timestampSpan.classList.add("timestamp");
            timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.appendChild(textP);
            messageDiv.appendChild(timestampSpan);
            messageList.appendChild(messageDiv);
        }
    }
});
