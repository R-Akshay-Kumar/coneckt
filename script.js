document.addEventListener("DOMContentLoaded", () => {
    
    const authForm = document.getElementById("auth-form");

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            window.location.href = "chat.html";
        });

        const toggleLink = document.getElementById("form-toggle-link");
        if (toggleLink) {
            const formContainer = document.getElementById("form-container");
            const formTitle = document.getElementById("form-title");
            const submitBtn = document.getElementById("submit-btn");
            const togglePrompt = document.getElementById("toggle-prompt");

            toggleLink.addEventListener("click", (e) => {
                e.preventDefault();
                const currentMode = formContainer.dataset.mode;
                
                if (currentMode === "login") {
                    formContainer.dataset.mode = "signup";
                    formTitle.textContent = "Create Account";
                    submitBtn.textContent = "Sign Up";
                    togglePrompt.textContent = "Already have an account?";
                    toggleLink.textContent = "Login here";
                } else {
                    formContainer.dataset.mode = "login";
                    formTitle.textContent = "Welcome Back";
                    submitBtn.textContent = "Login";
                    togglePrompt.textContent = "Don't have an account?";
                    toggleLink.textContent = "Sign up here";
                }
            });
        }
    }

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
                    if (firstChat) {
                        firstChat.click();
                    }
                } else if (tab === "groups") {
                    contactList.style.display = "none";
                    groupList.style.display = "block";
                    listPanelTitle.textContent = "Groups";
                    const firstGroup = groupList.querySelector(".contact-item");
                    if (firstGroup) {
                        firstGroup.click();
                    }
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

        function switchChat(item) {
            document.querySelectorAll(".contact-item").forEach(i => {
                i.classList.remove("active");
            });
            item.classList.add("active");
            const newChatName = item.dataset.name;
            const initialMessage = item.dataset.initialMessage;
            chatWithName.textContent = newChatName;
            messageList.innerHTML = `
                <div class="message received">
                    <p>${initialMessage}</p>
                    <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;
        }

        contactList.addEventListener("click", (event) => {
            const clickedContact = event.target.closest(".contact-item");
            if (clickedContact) {
                switchChat(clickedContact);
            }
        });

        groupList.addEventListener("click", (event) => {
            const clickedGroup = event.target.closest(".contact-item");
            if (clickedGroup) {
                switchChat(clickedGroup);
            }
        });

        const firstActiveChat = contactList.querySelector(".contact-item.active");
        if (firstActiveChat) {
            switchChat(firstActiveChat);
        }
    }
});