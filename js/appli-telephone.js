// ---- RACINES SUR LE TÉLÉPHONE : INSTALLER + FAIRE CONNAÎTRE (n° 279, 03/10/2026) ----
// Modèle : ancestria-web/site/src-web/appli-telephone/AppliTelephone.tsx (même logique, en JS sans outil).
// Posé DANS la page d'accueil, sous le titre (jamais un bloc qui flotte par-dessus) :
//   - « Installer Racines sur mon téléphone » : Android/Chrome = fenêtre d'installation en un toucher
//     (beforeinstallprompt) ; iPhone = Apple ne le permet pas → les 2 gestes ; déjà installée = bouton absent ;
//   - « Faire connaître Racines » : partage du téléphone avec message + lien ; sans partage (ordinateur) : lien copié.
const MESSAGE = 'Racines à l’Histoire — la maison d’édition numérique de La Réunion, gratuite : l’histoire de l’île, de tome en tome et de ville en ville.';
const adresse = () => new URL('./', location.href).href;

let invite = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); invite = e; dessiner(); });
window.addEventListener('appinstalled', () => { invite = null; dessiner('Racines est sur votre écran d’accueil.'); });

export function modeInstallation({ autonome, inviteDisponible, agent, tactile }) {
  if (autonome) return 'deja-installee';
  if (inviteDisponible) return 'un-toucher';
  if (/iPhone|iPad|iPod/i.test(agent)) return 'iphone';
  if (tactile || /Android|Mobile/i.test(agent)) return 'autre-telephone';
  return 'ordinateur';
}

let aide = false;
function dessiner(message = '') {
  const bloc = document.querySelector('[data-bloc="appli-telephone"]');
  if (!bloc) return;
  const mode = modeInstallation({
    autonome: matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
    inviteDisponible: invite !== null,
    agent: navigator.userAgent,
    tactile: matchMedia('(pointer: coarse)').matches,
  });
  bloc.dataset.mode = mode;
  bloc.innerHTML = `
    <p class="tel-appli-texte">Racines est gratuite. Gardez-la sur votre téléphone et faites-la connaître autour de vous.</p>
    <div class="tel-appli-boutons">
      ${mode !== 'deja-installee' && mode !== 'ordinateur'
        ? `<button type="button" class="btn tel-btn-plein" data-bouton="installer"><i class="ph ph-download-simple"></i>Installer Racines sur mon ${matchMedia('(pointer: coarse)').matches ? 'téléphone' : 'ordinateur'}</button>` : ''}
      <button type="button" class="btn btn-primary tel-btn" data-bouton="partager"><i class="ph ph-share-network"></i>Faire connaître Racines</button>
    </div>
    ${aide && mode === 'iphone' ? `<ol class="tel-aide" data-aide="iphone">
        <li>Touchez <b>Partager</b> (le carré avec une flèche, en bas de Safari).</li>
        <li>Touchez <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.</li></ol>` : ''}
    ${aide && mode === 'autre-telephone' ? `<ol class="tel-aide" data-aide="android">
        <li>Ouvrez ce lien dans <b>Chrome</b>.</li>
        <li>Touchez <b>⋮</b> en haut à droite, puis <b>« Installer l’application »</b> (ou « Ajouter à l’écran d’accueil »).</li></ol>` : ''}
    ${message ? `<p class="tel-appli-message" data-message>${message}</p>` : ''}`;
}

document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-bouton]');
  if (!b) return;
  if (b.dataset.bouton === 'installer') {
    if (invite) {
      const i = invite;
      try {
        await i.prompt();
        const { outcome } = await i.userChoice;
        if (outcome === 'accepted') invite = null;
        dessiner(outcome === 'accepted' ? 'Racines est sur votre écran d’accueil.' : '');
        return;
      } catch {
        invite = null;   // fenêtre refusée par le navigateur : on montre les gestes à la place
      }
    }
    aide = !aide; dessiner();
    return;
  }
  try {
    // téléphone (écran tactile) : le partage du téléphone ; ordinateur : le lien est copié (sa demande), même si Windows sait partager
    if (navigator.share && matchMedia('(pointer: coarse)').matches) { await navigator.share({ title: 'Racines à l’Histoire', text: MESSAGE, url: adresse() }); return; }
    await navigator.clipboard.writeText(`${MESSAGE} ${adresse()}`);
    dessiner('Lien copié : collez-le dans un message (WhatsApp, Facebook, SMS…).');
  } catch {
    // partage annulé par la personne : rien à dire
  }
});
dessiner();
// ---- FIN INSTALLER + FAIRE CONNAÎTRE ----
