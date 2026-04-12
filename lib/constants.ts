import { LUXURY_PRIVACY_STYLES } from './privacy-luxury-styles';

export const DEFAULT_PRIVACY_POLICY = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - CheckIn Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;900&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    ${LUXURY_PRIVACY_STYLES}
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">Mamounia Check-In Services</div>
            <div class="last-updated">Last updated: April 1, 2026</div>
        </div>
    </header>

    <section class="hero">
        <h1>Privacy Policy</h1>
        <p class="hero-subtitle">We take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our guest check-in service.</p>
    </section>

    <nav class="toc">
        <div class="toc-grid">
            <a href="#who-we-are" class="toc-item">
                <span class="toc-number">01</span>
                <div class="toc-title">Who we are</div>
                <div class="toc-desc">Company details and contact</div>
            </a>
            <a href="#data-collection" class="toc-item">
                <span class="toc-number">02</span>
                <div class="toc-title">What we collect</div>
                <div class="toc-desc">Personal and booking data</div>
            </a>
            <a href="#why-collect" class="toc-item">
                <span class="toc-number">03</span>
                <div class="toc-title">Why we collect it</div>
                <div class="toc-desc">Legal basis for processing</div>
            </a>
            <a href="#how-use" class="toc-item">
                <span class="toc-number">04</span>
                <div class="toc-title">How we use it</div>
                <div class="toc-desc">Processing purposes</div>
            </a>
            <a href="#retention" class="toc-item">
                <span class="toc-number">05</span>
                <div class="toc-title">Data retention</div>
                <div class="toc-desc">How long we keep data</div>
            </a>
            <a href="#rights" class="toc-item">
                <span class="toc-number">06</span>
                <div class="toc-title">Your rights</div>
                <div class="toc-desc">Access, delete, export</div>
            </a>
            <a href="#security" class="toc-item">
                <span class="toc-number">07</span>
                <div class="toc-title">Security measures</div>
                <div class="toc-desc">How we protect your data</div>
            </a>
            <a href="#contact" class="toc-item">
                <span class="toc-number">08</span>
                <div class="toc-title">Contact us</div>
                <div class="toc-desc">Questions and complaints</div>
            </a>
        </div>
    </nav>

    <main class="content">
        <section id="who-we-are" class="section">
            <span class="section-number">01</span>
            <h2>Who we are</h2>
            <p>Mamounia Check-In Services is operated by Mamounia, an independent service provider offering digital guest check-in solutions for short-term rental hosts.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Operator: Mamounia</li>
                <li>Business Type: Independent Service Provider</li>
                <li>Location: Casablanca, Morocco</li>
                <li>Email: [admin email]</li>
            </ul>
        </section>

        <section id="data-collection" class="section">
            <span class="section-number">02</span>
            <h2>What data we collect</h2>
            <p>We collect different types of information depending on whether you're a host or a guest:</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data Type</th>
                        <th>Examples</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Personal Identification</strong></td>
                        <td>Full name, date of birth, nationality, home address</td>
                        <td>Guest form</td>
                    </tr>
                    <tr>
                        <td><strong>Contact Information</strong></td>
                        <td>Email address, phone number, emergency contact</td>
                        <td>Guest form</td>
                    </tr>
                    <tr>
                        <td><strong>Travel Documents</strong></td>
                        <td>Passport/ID number, document photo, verification selfie</td>
                        <td>Guest form upload</td>
                    </tr>
                    <tr>
                        <td><strong>Booking Details</strong></td>
                        <td>Check-in/out dates, property, number of guests, purpose of visit</td>
                        <td>Host calendar sync</td>
                    </tr>
                    <tr>
                        <td><strong>Additional Information</strong></td>
                        <td>Vehicle license plate, special requests, arrival time</td>
                        <td>Guest form (optional)</td>
                    </tr>
                </tbody>
            </table>

            <div class="highlight-box">
                <p><strong>Special Category Data:</strong> Passport and ID photos may reveal racial or ethnic origin. We process this data with explicit consent and extra security measures including encryption.</p>
            </div>
        </section>

        <section id="why-collect" class="section">
            <span class="section-number">03</span>
            <h2>Why we collect it (Legal Basis)</h2>
            <p>Under GDPR, we must have a lawful basis to process your data. We rely on:</p>
            
            <ul>
                <li><strong>Contractual Necessity (Article 6(1)(b)):</strong> We need your name, contact details, and booking information to provide the check-in service you requested.</li>
                
                <li><strong>Legal Obligation (Article 6(1)(c)):</strong> Many jurisdictions require hosts to register guests with local authorities. We collect passport/ID data to help hosts comply with these legal requirements.</li>
                
                <li><strong>Legitimate Interest (Article 6(1)(f)):</strong> We collect emergency contacts and vehicle information for the host's security and property protection.</li>
                
                <li><strong>Explicit Consent (Article 9(2)(a)):</strong> For passport photos and verification selfies (special category data), we ask for your explicit consent, which you can withdraw at any time.</li>
            </ul>
        </section>

        <section id="how-use" class="section">
            <span class="section-number">04</span>
            <h2>How we use your data</h2>
            <p>We use your information for the following purposes:</p>
            
            <ul>
                <li><strong>Identity Verification:</strong> Matching guests to bookings and preventing fraud</li>
                <li><strong>Host Communication:</strong> Sharing guest details with the property owner who is hosting you</li>
                <li><strong>Legal Compliance:</strong> Generating reports for local government authorities when required by law</li>
                <li><strong>Service Operations:</strong> Sending check-in instructions, wifi passwords, and house rules</li>
                <li><strong>Customer Support:</strong> Responding to your questions and resolving issues</li>
                <li><strong>Service Improvement:</strong> Analyzing usage patterns to improve our platform (anonymized data only)</li>
            </ul>

            <div class="highlight-box">
                <p><strong>We do NOT:</strong> Sell your data to third parties, use your data for marketing without consent, or share your information except as described in this policy.</p>
            </div>
        </section>


        <section id="retention" class="section">
            <span class="section-number">05</span>
            <h2>Data retention</h2>
            <p>We keep your data only as long as necessary:</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data Category</th>
                        <th>Retention Period</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Active booking data</td>
                        <td>Until checkout</td>
                        <td>Service delivery</td>
                    </tr>
                    <tr>
                        <td>Check-in records</td>
                        <td>90 days after checkout</td>
                        <td>Damage claims, disputes</td>
                    </tr>
                    <tr>
                        <td>Guest registration (where legally required)</td>
                        <td>5 years</td>
                        <td>Legal compliance</td>
                    </tr>
                    <tr>
                        <td>Passport/ID photos</td>
                        <td>90 days after checkout</td>
                        <td>Then permanently deleted</td>
                    </tr>
                    <tr>
                        <td>Account data (hosts)</td>
                        <td>Until account deletion</td>
                        <td>Service provision</td>
                    </tr>
                    <tr>
                        <td>Anonymized analytics</td>
                        <td>Indefinitely</td>
                        <td>Service improvement (cannot identify you)</td>
                    </tr>
                </tbody>
            </table>

            <p>After the retention period, we either permanently delete your data or anonymize it so it can no longer identify you.</p>
        </section>

        <section id="rights" class="section">
            <span class="section-number">06</span>
            <h2>Your rights under GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            
            <ul>
                <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                
                <li><strong>Right to Rectification:</strong> Correct any inaccurate or incomplete information</li>
                
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your data when it's no longer necessary or you withdraw consent. Note: We may need to retain some data for legal compliance.</li>
                
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data while you contest its accuracy or legality</li>
                
                <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format (JSON/CSV) to transfer to another service</li>
                
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interest</li>
                
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for passport photo processing at any time (though this may limit service functionality)</li>
                
                <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
            </ul>

            <div class="highlight-box">
                <p><strong>How to Exercise Your Rights:</strong> Email privacy@checkinpro.com or use the privacy settings in your dashboard. We'll respond within 30 days.</p>
            </div>
        </section>

        <section id="security" class="section">
            <span class="section-number">07</span>
            <h2>Security measures</h2>
            <p>We implement industry-standard security measures to protect your data:</p>
            
            <ul>
                <li><strong>Encryption in Transit:</strong> All data transmitted to our servers uses SSL/TLS encryption (HTTPS)</li>
                
                <li><strong>Encryption at Rest:</strong> Passport photos and sensitive fields are encrypted using AES-256 encryption</li>
                
                <li><strong>Access Controls:</strong> Role-based access ensures hosts only see their own guests' data. Multi-factor authentication for admin accounts.</li>
                
                <li><strong>Audit Logging:</strong> We log all data access and modifications for security monitoring</li>
                
                <li><strong>Regular Backups:</strong> Encrypted daily backups stored in separate geographic locations</li>
                
                <li><strong>Penetration Testing:</strong> Annual third-party security audits</li>
                
                <li><strong>Breach Notification:</strong> If a data breach occurs, we'll notify you and relevant authorities within 72 hours as required by GDPR</li>
            </ul>

            <p><strong>Your Responsibility:</strong> Keep your login credentials secure. Never share your password. Log out after using shared devices.</p>
        </section>

        <section id="contact" class="section">
            <span class="section-number">08</span>
            <h2>Contact us</h2>
            <p>If you have questions about this privacy policy or want to exercise your rights, contact us:</p>
            
            <ul>
                <li><strong>Email:</strong> privacy@checkinpro.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@checkinpro.com</li>
                <li><strong>Mail:</strong> [Your Company Name], [Full Address]</li>
                <li><strong>Response Time:</strong> We aim to respond within 5 business days</li>
            </ul>

            <p><strong>Filing a Complaint:</strong> If you're not satisfied with our response, you have the right to lodge a complaint with your local supervisory authority:</p>
            
            <ul>
                <li>EU residents: Contact your national Data Protection Authority</li>
                <li>UK residents: Information Commissioner's Office (ICO) - ico.org.uk</li>
                <li>Find your local authority: edpb.europa.eu/about-edpb/about-edpb/members_en</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Policy Updates:</strong> We may update this policy occasionally. We'll notify you of significant changes via email and update the "Last updated" date at the top of this page.</p>
            </div>
        </section>
    </main>

</body>
</html>`;
