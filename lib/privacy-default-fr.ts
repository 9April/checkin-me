import { LUXURY_PRIVACY_STYLES } from './privacy-luxury-styles';

/** Full styled default privacy policy when no custom HTML is stored (French). */
export const DEFAULT_PRIVACY_POLICY_FR = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Politique de confidentialité - CheckIn Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;900&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    ${LUXURY_PRIVACY_STYLES}
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">Mamounia Check-In Services</div>
            <div class="last-updated">Dernière mise à jour : 1er avril 2026</div>
        </div>
    </header>

    <section class="hero">
        <h1>Politique de confidentialité</h1>
        <p class="hero-subtitle">Nous prenons votre vie privée au sérieux. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre service d'enregistrement des voyageurs.</p>
    </section>

    <nav class="toc">
        <div class="toc-grid">
            <a href="#who-we-are" class="toc-item">
                <span class="toc-number">01</span>
                <div class="toc-title">Qui sommes-nous</div>
                <div class="toc-desc">Coordonnées de l'entreprise</div>
            </a>
            <a href="#data-collection" class="toc-item">
                <span class="toc-number">02</span>
                <div class="toc-title">Données collectées</div>
                <div class="toc-desc">Données personnelles et réservation</div>
            </a>
            <a href="#why-collect" class="toc-item">
                <span class="toc-number">03</span>
                <div class="toc-title">Pourquoi nous les collectons</div>
                <div class="toc-desc">Base légale du traitement</div>
            </a>
            <a href="#how-use" class="toc-item">
                <span class="toc-number">04</span>
                <div class="toc-title">Comment nous les utilisons</div>
                <div class="toc-desc">Finalités du traitement</div>
            </a>
            <a href="#retention" class="toc-item">
                <span class="toc-number">05</span>
                <div class="toc-title">Conservation des données</div>
                <div class="toc-desc">Durée de conservation</div>
            </a>
            <a href="#rights" class="toc-item">
                <span class="toc-number">06</span>
                <div class="toc-title">Vos droits</div>
                <div class="toc-desc">Accès, suppression, export</div>
            </a>
            <a href="#security" class="toc-item">
                <span class="toc-number">07</span>
                <div class="toc-title">Mesures de sécurité</div>
                <div class="toc-desc">Protection de vos données</div>
            </a>
            <a href="#contact" class="toc-item">
                <span class="toc-number">08</span>
                <div class="toc-title">Contact</div>
                <div class="toc-desc">Questions et réclamations</div>
            </a>
        </div>
    </nav>

    <main class="content">
        <section id="who-we-are" class="section">
            <span class="section-number">01</span>
            <h2>Qui sommes-nous</h2>
            <p>Mamounia Check-In Services est exploité par Mamounia, prestataire indépendant proposant des solutions d'enregistrement numérique des voyageurs pour les hôtes de locations de courte durée.</p>
            <p><strong>Informations :</strong></p>
            <ul>
                <li>Exploitant : Mamounia</li>
                <li>Type d'activité : Prestataire de services indépendant</li>
                <li>Siège : Casablanca, Maroc</li>
                <li>E-mail : [e-mail administrateur]</li>
            </ul>
        </section>

        <section id="data-collection" class="section">
            <span class="section-number">02</span>
            <h2>Quelles données nous collectons</h2>
            <p>Nous collectons différents types d'informations selon que vous êtes hôte ou voyageur :</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Type de donnée</th>
                        <th>Exemples</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Identification personnelle</strong></td>
                        <td>Nom complet, date de naissance, nationalité, adresse</td>
                        <td>Formulaire voyageur</td>
                    </tr>
                    <tr>
                        <td><strong>Coordonnées</strong></td>
                        <td>E-mail, téléphone, contact d'urgence</td>
                        <td>Formulaire voyageur</td>
                    </tr>
                    <tr>
                        <td><strong>Documents de voyage</strong></td>
                        <td>Numéro passeport/CIN, photo du document, selfie de vérification</td>
                        <td>Téléchargement formulaire</td>
                    </tr>
                    <tr>
                        <td><strong>Détails de réservation</strong></td>
                        <td>Dates, logement, nombre de voyageurs, motif du séjour</td>
                        <td>Synchronisation calendrier hôte</td>
                    </tr>
                    <tr>
                        <td><strong>Informations complémentaires</strong></td>
                        <td>Plaque d'immatriculation, demandes particulières, heure d'arrivée</td>
                        <td>Formulaire (facultatif)</td>
                    </tr>
                </tbody>
            </table>

            <div class="highlight-box">
                <p><strong>Données sensibles :</strong> Les photos de passeport ou de pièce d'identité peuvent révéler des données sensibles. Nous les traitons sur la base de votre consentement explicite et avec des mesures de sécurité renforcées, dont le chiffrement.</p>
            </div>
        </section>

        <section id="why-collect" class="section">
            <span class="section-number">03</span>
            <h2>Pourquoi nous collectons ces données (base légale)</h2>
            <p>Conformément au RGPD, tout traitement repose sur une base légale. Nous nous appuyons notamment sur :</p>
            
            <ul>
                <li><strong>Exécution du contrat (art. 6(1)(b)) :</strong> Nous avons besoin de votre nom, de vos coordonnées et des informations de réservation pour fournir le service d'enregistrement demandé.</li>
                
                <li><strong>Obligation légale (art. 6(1)(c)) :</strong> De nombreuses juridictions imposent l'enregistrement des voyageurs auprès des autorités. Nous collectons les données d'identité pour aider les hôtes à respecter ces obligations.</li>
                
                <li><strong>Intérêt légitime (art. 6(1)(f)) :</strong> Contacts d'urgence et informations véhicule pour la sécurité du logement et des personnes.</li>
                
                <li><strong>Consentement explicite (art. 9(2)(a)) :</strong> Pour les photos de documents et selfies (données sensibles), nous demandons un consentement que vous pouvez retirer à tout moment.</li>
            </ul>
        </section>

        <section id="how-use" class="section">
            <span class="section-number">04</span>
            <h2>Comment nous utilisons vos données</h2>
            <p>Nous utilisons vos informations pour :</p>
            
            <ul>
                <li><strong>Vérification d'identité :</strong> Associer les voyageurs aux réservations et limiter la fraude</li>
                <li><strong>Communication avec l'hôte :</strong> Transmettre les informations nécessaires au propriétaire du logement</li>
                <li><strong>Conformité légale :</strong> Produire les déclarations exigées par les autorités locales</li>
                <li><strong>Fonctionnement du service :</strong> Instructions d'arrivée, Wi-Fi, règlement intérieur</li>
                <li><strong>Support :</strong> Répondre à vos questions et résoudre les incidents</li>
                <li><strong>Amélioration du service :</strong> Analyses agrégées et anonymisées lorsque c'est possible</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Nous ne faisons pas :</strong> vendre vos données à des tiers, les utiliser à des fins marketing sans consentement, ni les partager au-delà de ce qui est décrit ici.</p>
            </div>
        </section>

        <section id="retention" class="section">
            <span class="section-number">05</span>
            <h2>Conservation des données</h2>
            <p>Nous conservons les données uniquement le temps nécessaire :</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Catégorie</th>
                        <th>Durée</th>
                        <th>Motif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Données de réservation active</td>
                        <td>Jusqu'au départ</td>
                        <td>Prestation du service</td>
                    </tr>
                    <tr>
                        <td>Historique d'enregistrement</td>
                        <td>90 jours après le départ</td>
                        <td>Litiges, dégâts éventuels</td>
                    </tr>
                    <tr>
                        <td>Déclaration voyageur (si obligation légale)</td>
                        <td>5 ans</td>
                        <td>Obligation légale</td>
                    </tr>
                    <tr>
                        <td>Photos passeport / pièce d'identité</td>
                        <td>90 jours après le départ</td>
                        <td>Puis suppression définitive</td>
                    </tr>
                    <tr>
                        <td>Comptes hôtes</td>
                        <td>Jusqu'à suppression du compte</td>
                        <td>Fourniture du service</td>
                    </tr>
                    <tr>
                        <td>Statistiques anonymisées</td>
                        <td>Indéfiniment</td>
                        <td>Amélioration (sans identification)</td>
                    </tr>
                </tbody>
            </table>

            <p>Après ces délais, nous supprimons définitivement vos données ou les anonymisons de façon irréversible.</p>
        </section>

        <section id="rights" class="section">
            <span class="section-number">06</span>
            <h2>Vos droits (RGPD)</h2>
            <p>Vous disposez notamment des droits suivants :</p>
            
            <ul>
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression lorsque c'est applicable</li>
                <li><strong>Droit à la limitation :</strong> restreindre certains traitements</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> notamment pour les traitements fondés sur l'intérêt légitime</li>
                <li><strong>Retrait du consentement :</strong> pour les photos de documents, à tout moment (certaines fonctions peuvent être limitées)</li>
                <li><strong>Réclamation :</strong> auprès de l'autorité de protection des données compétente</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Exercer vos droits :</strong> écrivez à privacy@checkinpro.com ou utilisez les paramètres de votre espace. Réponse sous 30 jours en règle générale.</p>
            </div>
        </section>

        <section id="security" class="section">
            <span class="section-number">07</span>
            <h2>Sécurité</h2>
            <p>Nous mettons en œuvre des mesures adaptées :</p>
            
            <ul>
                <li><strong>Chiffrement en transit :</strong> HTTPS pour les échanges avec nos serveurs</li>
                <li><strong>Chiffrement au repos :</strong> photos et données sensibles protégées (dont AES-256)</li>
                <li><strong>Contrôles d'accès :</strong> chaque hôte n'accède qu'à ses propres dossiers ; MFA pour l'administration</li>
                <li><strong>Journaux d'audit :</strong> traçabilité des accès et modifications</li>
                <li><strong>Sauvegardes :</strong> sauvegardes chiffrées et géographiquement séparées</li>
                <li><strong>Tests de sécurité :</strong> audits réguliers</li>
                <li><strong>Notification de violation :</strong> information des personnes et autorités dans les délais prévus par le RGPD</li>
            </ul>

            <p><strong>Votre responsabilité :</strong> protégez vos identifiants, ne partagez pas votre mot de passe, déconnectez-vous sur les appareils partagés.</p>
        </section>

        <section id="contact" class="section">
            <span class="section-number">08</span>
            <h2>Contact</h2>
            <p>Pour toute question sur cette politique ou pour exercer vos droits :</p>
            
            <ul>
                <li><strong>E-mail :</strong> privacy@checkinpro.com</li>
                <li><strong>Délégué à la protection des données :</strong> dpo@checkinpro.com</li>
                <li><strong>Courrier :</strong> [Dénomination sociale], [Adresse complète]</li>
                <li><strong>Délai de réponse :</strong> nous visons une réponse sous 5 jours ouvrés</li>
            </ul>

            <p><strong>Réclamation :</strong> si vous n'êtes pas satisfait de notre réponse, vous pouvez saisir l'autorité de contrôle compétente (CNIL pour la France, APDP pour le Maroc selon le cas, etc.).</p>
            
            <ul>
                <li>Résidents UE : autorité nationale de protection des données</li>
                <li>Royaume-Uni : ICO (ico.org.uk)</li>
                <li>Liste des autorités : edpb.europa.eu</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Évolutions :</strong> nous pouvons mettre à jour cette politique ; les changements importants vous seront signalés par e-mail et la date en tête de page sera actualisée.</p>
            </div>
        </section>
    </main>

</body>
</html>`;
