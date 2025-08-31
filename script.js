document.addEventListener('DOMContentLoaded', () => {

    const mockServer = {
        lobbies: [],
        nextLobbyId: 1,

        createLobby(name, isPrivate, password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const newLobby = {
                        id: this.nextLobbyId++,
                        name: name,
                        isPrivate: isPrivate,
                        password: password,
                        playerCount: 1,
                        maxPlayers: 4,
                    };
                    this.lobbies.push(newLobby);
                    resolve(newLobby);
                }, 500); // Simulate network delay
            });
        },

        joinLobby(lobbyId, password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const lobby = this.lobbies.find(l => l.id === lobbyId);

                    if (!lobby) {
                        return reject({ code: 'LOBBY_NOT_FOUND' });
                    }

                    if (lobby.playerCount >= lobby.maxPlayers) {
                        return reject({ code: 'LOBBY_FULL' });
                    }

                    // In a real app, you'd check the password for private lobbies here.

                    lobby.playerCount++;
                    resolve(lobby);
                }, 500); // Simulate network delay
            });
        }
    };

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

        mockServer.createLobby(groupName, isPrivate, password)
            .then(lobby => {
                renderGroup(lobby);
                isInGroup = true;
            })
            .catch(error => {
                console.error("Fehler beim Erstellen der Gruppe:", error);
                alert("Konnte die Gruppe nicht erstellen.");
            });
    };

    const renderGroup = (lobby) => {
        const groupTile = document.createElement('div');
        groupTile.classList.add('group-tile');
        groupTile.dataset.lobbyId = lobby.id;

        const lockIcon = lobby.isPrivate ? '<span class="lock-icon">🔒</span>' : '';

        groupTile.innerHTML = `
            <div class="group-info">
                <h3>${lobby.name}</h3>
                <p class="player-count">(${lobby.playerCount}/${lobby.maxPlayers})</p>
            </div>
            <div class="group-actions">
                ${lockIcon}
                <button class="join-btn">Beitreten</button>
                <button class="leave-btn">Verlassen</button>
            </div>
        `;

        groupsContainer.appendChild(groupTile);
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

    // --- Event Listener for Join/Leave Buttons (using Event Delegation) ---
    groupsContainer.addEventListener('click', (e) => {
        const groupTile = e.target.closest('.group-tile');
        if (!groupTile) return;

        if (e.target.classList.contains('join-btn')) {
            if (isInGroup) {
                alert('Du bist bereits in einer Gruppe. Verlasse zuerst deine aktuelle Gruppe, um einer neuen beizutreten.');
                return;
            }

            const lobbyId = parseInt(groupTile.dataset.lobbyId);
            // For private lobbies, a password prompt would be needed here.

            mockServer.joinLobby(lobbyId)
                .then(updatedLobby => {
                    const playerCountElement = groupTile.querySelector('.player-count');
                    playerCountElement.textContent = `(${updatedLobby.playerCount}/${updatedLobby.maxPlayers})`;
                    isInGroup = true;
                })
                .catch(error => {
                    if (error.code === 'LOBBY_FULL') {
                        alert('Die Gruppe ist bereits voll.');
                    } else {
                        console.error("Fehler beim Beitreten der Gruppe:", error);
                        alert("Konnte der Gruppe nicht beitreten.");
                    }
                });
        }

        if (e.target.classList.contains('leave-btn')) {
            // This is a simplified leave logic. In a real app, the server would need to be notified.
            groupTile.remove();
            isInGroup = false; // Reset the flag
        }
    });
});
