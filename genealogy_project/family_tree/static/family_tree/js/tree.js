// ========================================
// SYSTÈME D'ARBRE GÉNÉALOGIQUE HIÉRARCHIQUE
// ========================================

let treeData = [];

// Charger les données
async function loadTreeData() {
    try {
        const response = await fetch('/api/tree-data/');
        treeData = await response.json();
        console.log('✅ Données chargées:', treeData.length, 'personnes');
        return true;
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('Erreur de chargement', 'error');
        return false;
    }
}

// Trouver personne
function findPerson(personId) {
    return treeData.find(p => p.id === personId);
}

// Calculer la génération d'une personne (0 = patriarche, 1 = enfants, etc.)
function calculateGeneration(personId) {
    const person = findPerson(personId);
    if (!person) return 0;

    // Si pas de parents, c'est la génération 0
    if (!person.father_id && !person.mother_id) {
        return 0;
    }

    // Sinon, c'est la génération du parent + 1
    let parentGeneration = 0;
    if (person.father_id) {
        parentGeneration = Math.max(parentGeneration, calculateGeneration(person.father_id));
    }
    if (person.mother_id) {
        parentGeneration = Math.max(parentGeneration, calculateGeneration(person.mother_id));
    }

    return parentGeneration + 1;
}

// FONCTION PRINCIPALE - Toggle descendants
window.toggleChildren = async function(personId) {
    console.log('🔄 Toggle pour:', personId);

    const existingContainer = document.querySelector(`#descendants-${personId}`);
    const button = document.querySelector(`button[data-person-id="${personId}"]`);

    if (existingContainer) {
        // FERMER
        console.log('📉 Fermeture descendants');
        existingContainer.style.maxHeight = '0';
        if (button) {
            button.classList.remove('expanded');
            const svg = button.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(0deg)';
        }
        setTimeout(() => existingContainer.remove(), 400);
    } else {
        // OUVRIR
        console.log('📈 Ouverture descendants');
        await loadTreeData();
        await showDescendants(personId);
        if (button) {
            button.classList.add('expanded');
            const svg = button.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(180deg)';
        }
    }
}

// Afficher les descendants d'une personne
async function showDescendants(personId) {
    const person = findPerson(personId);

    if (!person || !person.children_by_spouse || person.children_by_spouse.length === 0) {
        showNotification('Aucun descendant');
        return;
    }

    console.log('👶 Affichage descendants de', person.name);

    // Trouver la carte parent
    const parentCard = document.querySelector(`[data-person-id="${personId}"]`);
    if (!parentCard) return;

    const parentContainer = parentCard.closest('.generation-level') || parentCard.closest('.children-generation');

    // Créer conteneur descendants
    const descendantsContainer = document.createElement('div');
    descendantsContainer.id = `descendants-${personId}`;
    descendantsContainer.className = 'descendants-container';
    descendantsContainer.style.maxHeight = '0';
    descendantsContainer.style.overflow = 'hidden';
    descendantsContainer.style.transition = 'max-height 0.5s ease';

    // Ligne de connexion verticale
    const connector = document.createElement('div');
    connector.className = 'vertical-connector';
    connector.innerHTML = '<div class="connector-line-vertical"></div>';
    descendantsContainer.appendChild(connector);

    // Pour chaque conjoint et leurs enfants
    let totalChildren = 0;
    person.children_by_spouse.forEach(group => {
        totalChildren += group.children.length;
    });

    // Calculer la génération réelle des enfants
    const childGeneration = calculateGeneration(personId) + 1;

    // Génération des enfants
    const childrenGeneration = document.createElement('div');
    childrenGeneration.className = 'children-generation generation-level';

    const genHeader = document.createElement('div');
    genHeader.className = 'generation-header';
    genHeader.innerHTML = `
        <span class="generation-badge">Génération ${childGeneration + 1}</span>
        <h3 class="generation-title" style="font-size: 1.8rem;">${totalChildren} Enfant${totalChildren > 1 ? 's' : ''} de ${person.name.split(' ')[0]}</h3>
    `;
    childrenGeneration.appendChild(genHeader);

    // Grouper par conjoint
    person.children_by_spouse.forEach((group, groupIndex) => {
        if (group.spouse) {
            const spouseHeader = document.createElement('div');
            spouseHeader.className = 'spouse-indicator-inline';

            const initials = group.spouse.name.split(' ').map(n => n[0]).join('');
            const genderClass = group.spouse.gender ? group.spouse.gender.toLowerCase() : 'f';

            let photoHtml = group.spouse.photo_url
                ? `<img src="${group.spouse.photo_url}" alt="${group.spouse.name}">`
                : `<div class="mini-placeholder ${genderClass}">${initials}</div>`;

            spouseHeader.innerHTML = `
                <span class="spouse-label">💑 Avec</span>
                <a href="/person/${group.spouse.id}/" class="spouse-link-inline">
                    <div class="spouse-photo-tiny">${photoHtml}</div>
                    <strong>${group.spouse.name}</strong>
                </a>
            `;
            childrenGeneration.appendChild(spouseHeader);
        }

        // Grille des enfants
        const childrenRow = document.createElement('div');
        childrenRow.className = 'person-row';

        group.children.forEach(child => {
            const childCard = createPersonCard(child);
            childrenRow.appendChild(childCard);
        });

        childrenGeneration.appendChild(childrenRow);

        // Séparateur entre conjoints
        if (groupIndex < person.children_by_spouse.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'spouse-separator-thin';
            childrenGeneration.appendChild(sep);
        }
    });

    descendantsContainer.appendChild(childrenGeneration);

    // Insérer dans le DOM
    if (parentContainer.nextSibling) {
        parentContainer.parentNode.insertBefore(descendantsContainer, parentContainer.nextSibling);
    } else {
        parentContainer.parentNode.appendChild(descendantsContainer);
    }

    // Animation
    setTimeout(() => {
        descendantsContainer.style.maxHeight = descendantsContainer.scrollHeight + 5000 + 'px';
    }, 10);

    // IMPORTANT : Mettre à jour TOUS les boutons après insertion
    setTimeout(async () => {
        console.log('🔄 Appel de updateAllButtons après insertion des descendants...');
        await updateAllButtons();
    }, 200);

    // Observer pour ajuster hauteur
    const observer = new MutationObserver(() => {
        if (descendantsContainer.style.maxHeight !== '0px') {
            descendantsContainer.style.maxHeight = descendantsContainer.scrollHeight + 5000 + 'px';
        }
    });

    observer.observe(descendantsContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
}

// Créer carte personne
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.setAttribute('data-person-id', person.id);
    card.style.animation = 'fadeInUp 0.6s ease';

    const initials = person.name.split(' ').map(n => n[0]).join('');
    const genderClass = person.gender.toLowerCase();

    let photoHtml = person.photo_url
        ? `<img src="${person.photo_url}" alt="${person.name}">`
        : `<div class="photo-placeholder ${genderClass}">${initials}</div>`;

    let datesHtml = '';
    if (person.birth_date) {
        const birthYear = new Date(person.birth_date).getFullYear();
        datesHtml = `<p class="dates">${birthYear}`;
        if (person.death_date) {
            datesHtml += ` - ${new Date(person.death_date).getFullYear()}`;
        }
        datesHtml += '</p>';
    }

    // IMPORTANT : Ne pas déterminer les enfants ici, juste mettre un bouton de chargement
    card.innerHTML = `
        <div class="person-photo">${photoHtml}</div>
        <div class="person-info">
            <h3>${person.name}</h3>
            ${datesHtml}
        </div>
        <div class="person-actions">
            <a href="/person/${person.id}/" class="btn-view">👤 Profil</a>
            <button class="btn-expand" data-person-id="${person.id}" type="button" style="min-width: 150px;">
                <span class="expand-text">⏳ Vérification...</span>
            </button>
        </div>
    `;

    return card;
}

// FONCTION UNIVERSELLE : Mettre à jour TOUS les boutons sur la page
async function updateAllButtons() {
    console.log('\n🔄 ==========================================');
    console.log('🔄 MISE À JOUR UNIVERSELLE DE TOUS LES BOUTONS');
    console.log('🔄 ==========================================\n');

    // Recharger les données fraîches de l'API
    await loadTreeData();

    console.log('📦 Données disponibles:', treeData.length, 'personnes');

    // Trouver TOUS les boutons sur la page (initiaux + dynamiques)
    const allButtons = document.querySelectorAll('.btn-expand[data-person-id]');
    console.log('🔘 Total de boutons trouvés:', allButtons.length);

    allButtons.forEach((button, index) => {
        const personId = parseInt(button.getAttribute('data-person-id'));
        const person = findPerson(personId);

        console.log(`\n--- Bouton ${index + 1}/${allButtons.length} ---`);
        console.log(`🆔 ID: ${personId}`);

        if (!person) {
            console.error(`❌ PERSONNE ID ${personId} INTROUVABLE dans treeData`);
            button.innerHTML = '<span class="expand-text" style="color: red;">Erreur</span>';
            return;
        }

        console.log(`👤 Nom: ${person.name}`);

        // Vérifier les enfants
        const hasChildren = person.children_by_spouse &&
                          Array.isArray(person.children_by_spouse) &&
                          person.children_by_spouse.length > 0;

        console.log(`📊 children_by_spouse existe: ${!!person.children_by_spouse}`);
        console.log(`📊 Est un array: ${Array.isArray(person.children_by_spouse)}`);
        console.log(`📊 Nombre de groupes: ${person.children_by_spouse ? person.children_by_spouse.length : 0}`);

        if (hasChildren) {
            let totalCount = 0;
            person.children_by_spouse.forEach((group, gi) => {
                const count = group.children ? group.children.length : 0;
                console.log(`   📎 Groupe ${gi + 1}: ${count} enfants`);
                totalCount += count;
            });

            console.log(`✅ TOTAL: ${totalCount} enfant(s) → Activation du bouton`);

            if (totalCount > 0) {
                button.innerHTML = `
                    <span class="expand-text">${totalCount} enfant${totalCount > 1 ? 's' : ''}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease;">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `;
                button.onclick = () => toggleChildren(personId);
                button.style.cursor = 'pointer';
                button.classList.add('has-children');
                console.log(`   ✅ Bouton activé pour ${person.name}`);
            } else {
                console.log(`   ⚠️ Groupes présents mais 0 enfants total`);
                const badge = document.createElement('span');
                badge.className = 'no-children-badge';
                badge.textContent = 'Fin de lignée';
                button.replaceWith(badge);
            }
        } else {
            console.log(`❌ Pas de children_by_spouse valide → Badge "Pas d'enfants"`);
            const badge = document.createElement('span');
            badge.className = 'no-children-badge';
            badge.textContent = 'Pas d\'enfants';
            button.replaceWith(badge);
        }
    });

    console.log('\n✅ ==========================================');
    console.log(`✅ ${allButtons.length} BOUTONS TRAITÉS`);
    console.log('✅ ==========================================\n');
}

// Ancienne fonction pour compatibilité
async function updateInitialButtons() {
    return updateAllButtons();
}

// Recherche
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            document.querySelectorAll('.person-card').forEach(c => {
                c.classList.remove('search-highlight', 'search-dimmed');
            });
            return;
        }

        timeout = setTimeout(() => searchPeople(query), 300);
    });
}

async function searchPeople(query) {
    try {
        const response = await fetch(`/api/search/?q=${encodeURIComponent(query)}`);
        const results = await response.json();

        const cards = document.querySelectorAll('.person-card');
        cards.forEach(c => c.classList.remove('search-highlight', 'search-dimmed'));

        if (results.length === 0) {
            showNotification('Personne introuvable', 'info');
            return;
        }

        const ids = results.map(r => r.id);
        let first = null;

        cards.forEach(card => {
            const id = parseInt(card.getAttribute('data-person-id'));
            if (ids.includes(id)) {
                card.classList.add('search-highlight');
                if (!first) first = card;
            } else {
                card.classList.add('search-dimmed');
            }
        });

        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
        console.error('Erreur recherche:', error);
    }
}

// Notification
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed; top: 100px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#e74c3c' : '#3498db'};
        color: white; border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 1000;
        animation: slideInRight 0.4s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

// INITIALISATION
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌳 ===== ARBRE GÉNÉALOGIQUE HIÉRARCHIQUE =====');
    const success = await loadTreeData();
    if (success) {
        await updateAllButtons();
        console.log('✅ Prêt ! Cliquez pour dérouler les générations.');
    }
});

// Rafraîchir au retour
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('👁️ Page redevenue visible - rafraîchissement...');
        updateAllButtons();
    }
});

// Styles
const style = document.createElement('style');
style.textContent = `
    .descendants-container {
        position: relative;
        padding-left: 2rem;
    }

    .vertical-connector {
        display: flex;
        justify-content: center;
        padding: 1rem 0;
    }

    .connector-line-vertical {
        width: 3px;
        height: 60px;
        background: linear-gradient(to bottom, var(--secondary), var(--accent));
        border-radius: 2px;
    }

    .children-generation {
        background: rgba(102, 126, 234, 0.03);
        padding: 2rem;
        border-radius: 20px;
        border-left: 4px solid var(--accent);
        margin-bottom: 2rem;
    }

    .spouse-indicator-inline {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        background: white;
        border-radius: 50px;
        margin: 1rem auto;
        width: fit-content;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .spouse-label {
        color: var(--text-light);
        font-size: 0.9rem;
    }

    .spouse-link-inline {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        font-weight: 600;
    }

    .spouse-photo-tiny {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        overflow: hidden;
    }

    .spouse-photo-tiny img,
    .spouse-photo-tiny .mini-placeholder {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .spouse-separator-thin {
        height: 2px;
        background: linear-gradient(to right, transparent, var(--border), transparent);
        margin: 1.5rem 0;
    }

    .btn-expand.expanded svg {
        transform: rotate(180deg);
    }

    .search-highlight {
        box-shadow: 0 0 0 4px #d4af37 !important;
        animation: pulse 1.5s ease infinite;
    }

    .search-dimmed { opacity: 0.3; }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 4px #d4af37; }
        50% { box-shadow: 0 0 0 8px rgba(212, 175, 55, 0.4); }
    }

    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('📜 Script arbre hiérarchique chargé !');