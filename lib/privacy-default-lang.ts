/**
 * Default full-page privacy HTML when the property has no custom policy,
 * for FR / SP (EN uses `DEFAULT_PRIVACY_POLICY` in constants).
 * Same theme hooks as the English template for `.luxury-privacy-container`.
 */
export const DEFAULT_PRIVACY_POLICY_FR = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Politique de confidentialité</title>
<style>
:root { --bg-primary:#FDFBF7; --text-primary:#1A1614; --text-secondary:#6B635C; --accent:#C5A059; --border:#E6DED3; }
body { font-family:system-ui,sans-serif; background:var(--bg-primary); color:var(--text-primary); line-height:1.7; padding:2rem; max-width:720px; margin:0 auto; }
h1 { font-size:1.75rem; margin-bottom:0.5rem; color:var(--accent); }
p { margin:1rem 0; color:var(--text-secondary); }
h2 { font-size:1.1rem; margin-top:2rem; color:var(--text-primary); }
ul { padding-left:1.25rem; }
</style></head>
<body>
<h1>Politique de confidentialité</h1>
<p>Cette politique décrit comment nous traitons vos données personnelles lorsque vous utilisez notre service d’enregistrement des invités.</p>
<h2>Données collectées</h2>
<p>Nous pouvons collecter votre nom, coordonnées, pièces d’identité (selon la loi locale), signature et informations de séjour nécessaires à l’enregistrement.</p>
<h2>Finalités</h2>
<ul>
<li>Respect des obligations légales (ex. déclaration aux autorités)</li>
<li>Gestion de votre réservation et communication avec l’établissement</li>
<li>Sécurité et prévention de la fraude</li>
</ul>
<h2>Conservation</h2>
<p>Les données sont conservées le temps nécessaire aux obligations légales et à la gestion du séjour, puis supprimées ou anonymisées selon la réglementation applicable.</p>
<h2>Vos droits</h2>
<p>Selon le droit applicable, vous pouvez demander l’accès, la rectification ou la suppression de vos données. Contactez l’établissement ou l’hôte pour toute demande.</p>
<h2>Contact</h2>
<p>Pour toute question relative à cette politique, adressez-vous à l’établissement auprès duquel vous effectuez votre enregistrement.</p>
</body></html>`;

export const DEFAULT_PRIVACY_POLICY_ES = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Política de privacidad</title>
<style>
:root { --bg-primary:#FDFBF7; --text-primary:#1A1614; --text-secondary:#6B635C; --accent:#C5A059; --border:#E6DED3; }
body { font-family:system-ui,sans-serif; background:var(--bg-primary); color:var(--text-primary); line-height:1.7; padding:2rem; max-width:720px; margin:0 auto; }
h1 { font-size:1.75rem; margin-bottom:0.5rem; color:var(--accent); }
p { margin:1rem 0; color:var(--text-secondary); }
h2 { font-size:1.1rem; margin-top:2rem; color:var(--text-primary); }
ul { padding-left:1.25rem; }
</style></head>
<body>
<h1>Política de privacidad</h1>
<p>Esta política describe cómo tratamos sus datos personales cuando utiliza nuestro servicio de registro de huéspedes.</p>
<h2>Datos recopilados</h2>
<p>Podemos recopilar su nombre, datos de contacto, documentos de identidad (según la ley local), firma e información de estancia necesaria para el registro.</p>
<h2>Finalidades</h2>
<ul>
<li>Cumplimiento de obligaciones legales (p. ej. declaración a las autoridades)</li>
<li>Gestión de su reserva y comunicación con el alojamiento</li>
<li>Seguridad y prevención del fraude</li>
</ul>
<h2>Conservación</h2>
<p>Los datos se conservan el tiempo necesario para las obligaciones legales y la gestión de la estancia; después se eliminan o anonimizan según la normativa aplicable.</p>
<h2>Sus derechos</h2>
<p>Según la ley aplicable, puede solicitar acceso, rectificación o supresión de sus datos. Contacte al alojamiento o al anfitrión para cualquier solicitud.</p>
<h2>Contacto</h2>
<p>Para preguntas sobre esta política, diríjase al establecimiento ante el que realiza su registro.</p>
</body></html>`;
