document.addEventListener('DOMContentLoaded', () => {
    const namePopup = document.getElementById('name-popup');
    const nameInput = document.getElementById('name-input');
    const submitNameBtn = document.getElementById('submit-name');
    const mainContent = document.getElementById('main-content');
    const createPublicBtn = document.getElementById('create-public');
    const createPrivateBtn = document.getElementById('create-private');
    const groupsContainer = document.getElementById('groups-container');

    let sessionUserName = '';

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
            ${lockIcon}
        `;

        groupsContainer.appendChild(groupTile);
    };

    // Event listeners for creating groups
    createPublicBtn.addEventListener('click', () => createGroup(false));
    createPrivateBtn.addEventListener('click', () => createGroup(true));
});
