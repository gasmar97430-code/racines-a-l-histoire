// ---- RACINES SUR LE TÉLÉPHONE : VITRINE DE LA COLLECTION (n° 279, 03/10/2026) ----
// Les couvertures comme dans le Catalogue de l'appli. Livre pas encore « Publié » : titre visible, mais il ne s'ouvre
// pas (n° 282) ; rien de son texte n'est en ligne (n° 276).
// Livre « Publié » : couverture nette ; un toucher ouvre sa fiche de présentation (n° 258 : jamais le livre entier).
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lettres = (n) => ['aucun', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'][n] ?? String(n);

function couverture(l) {
  // n° 282 (03/10) : titres nets, plus de bandeau ; un livre pas encore « Publié » ne s'ouvre pas (simple couverture).
  const publie = l.statut === 'Publié';
  const dedans = `<span class="couv-num">${esc(l.numero)}</span><span class="couv-trait"></span>
    <span class="couv-titre">${esc(l.titre)}</span><span class="couv-maison">M'ASTEL.974</span>`;
  return `<div class="carte-livre${publie ? '' : ' carte-fermee'}" data-livre="${esc(l.id)}" data-statut="${esc(l.statut)}">
    ${publie
      ? `<button type="button" class="couv" style="background:${l.fond};color:${l.encre}" data-ouvrir="${esc(l.id)}">${dedans}</button>`
      : `<div class="couv" style="background:${l.fond};color:${l.encre}">${dedans}</div>`}
    <span class="carte-zone">${esc(l.zone)}</span>
  </div>`;
}

async function monter() {
  const boite = document.querySelector('[data-collection]');
  let donnees;
  try {
    const r = await fetch('donnees/livres.json', { cache: 'no-store' });
    donnees = await r.json();
  } catch {
    boite.innerHTML = '<p class="tel-erreur">La collection n’a pas pu être chargée. Vérifiez la connexion, puis rouvrez l’appli.</p>';
    return;
  }
  const enCours = donnees.total - donnees.publies;
  document.querySelector('[data-compte]').textContent = donnees.publies
    ? `${donnees.total} livres · ${donnees.publies} parus · ${enCours} à paraître`
    : `${donnees.total} livres · chacun s'ouvrira ici dès sa parution`;
  boite.innerHTML = donnees.sections.filter((s) => s.livres.length).map((s) => `
    <section class="tel-section">
      <h2>${esc(s.titre)} <small>${s.livres.length}</small></h2>
      ${s.sous ? `<p class="tel-sous">${esc(s.sous)}</p>` : ''}
      <div class="tel-grille">${s.livres.map(couverture).join('')}</div>
    </section>`).join('');

  const fiche = document.querySelector('[data-fiche]');
  const parId = new Map(donnees.sections.flatMap((s) => s.livres).map((l) => [l.id, l]));
  boite.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ouvrir]');
    if (!b) return;
    const l = parId.get(b.dataset.ouvrir);
    fiche.innerHTML = `<div class="tel-fiche-tete" style="background:${l.fond};color:${l.encre}">
        <span class="couv-num">${esc(l.numero)}</span><h3>${esc(l.titre)}</h3>
        ${l.sous_titre ? `<p>${esc(l.sous_titre)}</p>` : ''}</div>
      <div class="tel-fiche-corps">
        ${l.periode ? `<p class="tel-fiche-meta">${esc(l.zone)} · ${esc(l.periode)}</p>` : ''}
        ${l.presentation ? `<p>${esc(l.presentation)}</p>` : '<p class="tel-sous">Présentation à venir.</p>'}
        <button type="button" class="btn btn-secondary" data-fermer>Fermer</button>
      </div>`;
    fiche.showModal();
  });
  fiche.addEventListener('click', (e) => { if (e.target === fiche || e.target.closest('[data-fermer]')) fiche.close(); });
  document.documentElement.dataset.vitrine = 'prete';
  document.documentElement.dataset.enCours = lettres(enCours);
}
monter();
// ---- FIN VITRINE ----
