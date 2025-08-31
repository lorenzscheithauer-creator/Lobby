document.addEventListener('DOMContentLoaded', () => {
    const namePopup = document.getElementById('name-popup');
    const nameInput = document.getElementById('name-input');
    const submitNameBtn = document.getElementById('submit-name');
    const mainContent = document.getElementById('main-content');
    const createPublicBtn = document.getElementById('create-public');
    const createPrivateBtn = document.getElementById('create-private');
    const groupsContainer = document.getElementById('groups-container');

    let sessionUserName = '';
    let isInGroup = false; // Flag to track if user is in a group

    // Check if a name is already set for the session
    if (sessionStorage.getItem('userName')) {
        sessionUserName = sessionStorage.getItem('userName');
        namePopup.style.display = 'none';
        mainContent.style.display = 'block';
    }

    // Handle name submission
    submitNameBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            sessionUserName = name;
            sessionStorage.setItem('userName', name);
            namePopup.style.display = 'none';
            mainContent.style.display = 'block';
        } else {
            alert('Bitte gib einen Namen ein.');
        }
    });

    // Function to create a group
    const createGroup = (isPrivate) => {
        if (isInGroup) {
            alert('Du bist bereits in einer Gruppe. Verlasse zuerst deine aktuelle Gruppe, um eine neue zu erstellen.');
            return;
        }

        const groupName = prompt('Gib einen Namen für die Gruppe ein:');
        if (!groupName) return; // User cancelled

        let password = null;
        if (isPrivate) {
            password = prompt('Gib ein Passwort für die private Gruppe ein:');
            if (password === null) return; // User cancelled
        }

        const groupTile = document.createElement('div');
        groupTile.classList.add('group-tile');

        const lockIcon = isPrivate ? '<span class="lock-icon">🔒</span>' : '';

        groupTile.innerHTML = `
            <div class="group-info">
                <h3>${groupName}</h3>
            </div>
            <div class="group-actions">
                ${lockIcon}
                <button class="leave-btn">Verlassen</button>
            </div>
        `;

        groupsContainer.appendChild(groupTile);
        isInGroup = true;
    };

    // Event listeners for creating groups
    createPublicBtn.addEventListener('click', () => createGroup(false));
    createPrivateBtn.addEventListener('click', () => createGroup(true));

    // --- Event Listeners for Interactive Placeholders ---
    const placeholderLinks = document.querySelectorAll('.placeholder-link');
    placeholderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the link from navigating
            const linkId = e.currentTarget.id;
            if (linkId.startsWith('game-link')) {
                alert('Hier könnten die Spiele angezeigt werden!');
            } else if (linkId === 'wheel-link') {
                alert('Das Glücksrad wird bald hinzugefügt!');
            }
        });
    });

    // --- Event Listener for Leave Buttons (using Event Delegation) ---
    groupsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('leave-btn')) {
            const groupTile = e.target.closest('.group-tile');
            if (groupTile) {
                groupTile.remove();
                isInGroup = false; // Reset the flag, allowing user to join/create a new group
            }
        }
    });
});
