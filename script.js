document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('congeForm');
    const historique = document.getElementById('historique');
    const demandesValidation = document.getElementById('demandesValidation'); 
    const raisonSelect = document.getElementById('raison');
    const autreRaisonContainer = document.getElementById('autreRaisonContainer');
    const autreRaisonInput = document.getElementById('autreRaison');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateDebut').setAttribute('min', today);
    document.getElementById('dateFin').setAttribute('min', today);
    
    const welcomeSection = document.getElementById('welcomeSection');
    const loginForm = document.getElementById('loginForm');
    const mainContent = document.getElementById('mainContent');
    const historiqueButton = document.getElementById('historiqueButton');
    const showLoginButton = document.getElementById('showLoginButton');
    const logoutButton = document.getElementById('logoutButton');

    // Afficher le formulaire de connexion lorsque l'utilisateur clique sur "Se connecter"
    showLoginButton.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        mainContent.classList.add('hidden');
    });

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        checkLoginStatus();
    });

    // Vérifiez si l'utilisateur est connecté
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            showLoginButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
            loginForm.classList.add('hidden');
            mainContent.classList.remove('hidden');
            historiqueButton.classList.remove('hidden');
        } else {
            showLoginButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
            loginForm.classList.add('hidden');
            mainContent.classList.add('hidden');
            historiqueButton.classList.add('hidden');
        }
    }

    // Gestion de la soumission du formulaire de connexion
    document.getElementById('login').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulez une vérification des identifiants
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isLoggedIn', 'true');
            checkLoginStatus();
        } else {
            alert('Nom d\'utilisateur ou mot de passe incorrect');
        }
    });

    // Vérifiez l'état de connexion au chargement de la page
    checkLoginStatus();

    raisonSelect.addEventListener('change', () => {
        if (raisonSelect.value === 'Autre') {
            autreRaisonContainer.classList.remove('hidden');
            autreRaisonInput.setAttribute('required', 'true');
        } else {
            autreRaisonContainer.classList.add('hidden');
            autreRaisonInput.removeAttribute('required');
        }
    });

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const secondPrenom = document.getElementById('secondPrenom').value;
            const dateDebut = document.getElementById('dateDebut').value;
            const dateFin = document.getElementById('dateFin').value;
            let raison = raisonSelect.value;

            // si autre choisi autre apparaît dans raison
            if (raison === 'Autre') {
                raison = autreRaisonInput.value;
            }

            const demande = {
                nom,
                prenom,
                secondPrenom,
                dateDebut,
                dateFin,
                raison,
                statut: 'en attente'
            };

            let demandes = JSON.parse(localStorage.getItem('demandes')) || [];
            demandes.push(demande);
            localStorage.setItem('demandes', JSON.stringify(demandes));
            alert("Demande enregistrée !");
            form.reset();

            afficherHistorique(demandes);
            form.reset();
            autreRaisonContainer.classList.add('hidden'); 
        });
    }

    function afficherHistorique(demandes) {
        if (historique) {
            historique.innerHTML = '';
            demandes.forEach(demande => {
                const li = document.createElement('li');
                li.classList.add('p-4', 'border', 'rounded-lg', 'shadow-sm');
                li.innerHTML = `
                    <strong>Nom:</strong> ${demande.nom}<br>
                    <strong>Prenom:</strong> ${demande.prenom}<br>
                    ${demande.secondPrenom ? `<strong>Deuxième prénom:</strong> ${demande.secondPrenom}<br>` : ''}
                    <strong>Date de début:</strong> ${demande.dateDebut}<br>
                    <strong>Date de fin:</strong> ${demande.dateFin}<br>
                    <strong>Raison:</strong> ${demande.raison}<br>
                    <strong>Statut:</strong> <span class="font-semibold ${getStatutClass(demande.statut)}">${demande.statut}</span>
                `;
                historique.appendChild(li);
            });
        }
    }

    function afficherDemandesValidation(demandes) {
        if (demandesValidation) {
            demandesValidation.innerHTML = '';
            demandes.forEach((demande, index) => {
                const li = document.createElement('li');
                li.classList.add('p-6', 'border', 'rounded-lg', 'shadow-md', 'bg-white');
                li.innerHTML = `
                    <div class="mb-4">
                        <strong>Nom:</strong> ${demande.nom}<br>
                        <strong>Prenom:</strong> ${demande.prenom}<br>
                        <strong>Deuxième prénom:</strong> ${demande.secondPrenom}<br>
                        <strong>Date de début:</strong> ${demande.dateDebut}<br>
                        <strong>Date de fin:</strong> ${demande.dateFin}<br>
                        <strong>Raison:</strong> ${demande.raison}<br>
                        <strong>Statut:</strong> <span class="font-semibold ${getStatutClass(demande.statut)}">${demande.statut}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600" onclick="changerStatut(${index}, 'approuvé')">Approuver</button>
                        <button class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600" onclick="changerStatut(${index}, 'refusé')">Refuser</button>
                    </div>
                `;
                demandesValidation.appendChild(li);
            });
        }
    }

    function getStatutClass(statut) {
        switch (statut) {
            case 'approuvé':
                return 'text-green-600';
            case 'refusé':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    }

    window.changerStatut = function(index, statut) {
        let demandes = JSON.parse(localStorage.getItem('demandes')) || [];
        demandes[index].statut = statut;
        localStorage.setItem('demandes', JSON.stringify(demandes));
        afficherDemandesValidation(demandes);
        if (historique) {
            afficherHistorique(demandes);
        }
    };

    const demandes = JSON.parse(localStorage.getItem('demandes')) || [];
    afficherHistorique(demandes);
    afficherDemandesValidation(demandes);
});