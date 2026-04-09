export const DEFAULT_PRIVACY_POLICY = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - CheckIn Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;900&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #FDFBF7;
            --bg-secondary: #F7F3ED;
            --text-primary: #1A1614;
            --text-secondary: #6B635C;
            --accent: #E85D04;
            --accent-light: #FFF0E6;
            --border: #E6DED3;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'IBM Plex Sans', -apple-system, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.7;
            font-size: 16px;
            overflow-x: hidden;
        }

        /* Header */
        header {
            position: sticky;
            top: 0;
            background: rgba(253, 251, 247, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            z-index: 100;
            animation: slideDown 0.6s ease;
        }

        @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: 'Fraunces', serif;
            font-weight: 900;
            font-size: 1.5rem;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }

        .last-updated {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        /* Hero */
        .hero {
            max-width: 1200px;
            margin: 0 auto;
            padding: 5rem 2rem 3rem;
            animation: fadeInUp 0.8s ease 0.2s both;
        }

        @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .hero h1 {
            font-family: 'Fraunces', serif;
            font-weight: 900;
            font-size: 4rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            font-weight: 300;
        }

        /* Navigation */
        .toc {
            max-width: 1200px;
            margin: 3rem auto;
            padding: 0 2rem;
        }

        .toc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            animation: fadeInUp 0.8s ease 0.4s both;
        }

        .toc-item {
            background: var(--bg-secondary);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: var(--text-primary);
            display: block;
        }

        .toc-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(232, 93, 4, 0.12);
            border-color: var(--accent);
        }

        .toc-number {
            font-family: 'Fraunces', serif;
            font-weight: 600;
            font-size: 0.875rem;
            color: var(--accent);
            margin-bottom: 0.5rem;
            display: block;
        }

        .toc-title {
            font-weight: 500;
            font-size: 1.125rem;
            margin-bottom: 0.25rem;
        }

        .toc-desc {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 300;
        }

        /* Content */
        .content {
            max-width: 800px;
            margin: 5rem auto;
            padding: 0 2rem 5rem;
        }

        .section {
            margin-bottom: 5rem;
            animation: fadeInUp 0.8s ease both;
            scroll-margin-top: 100px;
        }

        .section:nth-child(1) { animation-delay: 0.5s; }
        .section:nth-child(2) { animation-delay: 0.6s; }
        .section:nth-child(3) { animation-delay: 0.7s; }
        .section:nth-child(4) { animation-delay: 0.8s; }
        .section:nth-child(5) { animation-delay: 0.9s; }

        .section-number {
            font-family: 'Fraunces', serif;
            font-weight: 600;
            font-size: 0.875rem;
            color: var(--accent);
            margin-bottom: 1rem;
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--accent-light);
            border-radius: 6px;
        }

        .section h2 {
            font-family: 'Fraunces', serif;
            font-weight: 900;
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .section p {
            margin-bottom: 1.5rem;
            color: var(--text-primary);
        }

        .section ul {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
        }

        .section li {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .section li strong {
            color: var(--text-primary);
            font-weight: 500;
        }

        .highlight-box {
            background: var(--accent-light);
            border-left: 4px solid var(--accent);
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 8px;
        }

        .highlight-box p {
            margin-bottom: 0;
        }

        .data-table {
            width: 100%;
            margin: 2rem 0;
            border-collapse: collapse;
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
        }

        .data-table th {
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 1rem;
            text-align: left;
            font-weight: 500;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .data-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        /* Footer */
        footer {
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 3rem 2rem;
            margin-top: 5rem;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
        }

        .footer-section h3 {
            font-family: 'Fraunces', serif;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .footer-section p,
        .footer-section a {
            color: rgba(253, 251, 247, 0.7);
            text-decoration: none;
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9375rem;
        }

        .footer-section a:hover {
            color: var(--accent-light);
        }

        .copyright {
            max-width: 1200px;
            margin: 3rem auto 0;
            padding-top: 2rem;
            border-top: 1px solid rgba(253, 251, 247, 0.2);
            text-align: center;
            color: rgba(253, 251, 247, 0.5);
            font-size: 0.875rem;
        }

        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }

            .section h2 {
                font-size: 2rem;
            }

            .toc-grid {
                grid-template-columns: 1fr;
            }

            .header-content {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
        }
    </style>
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
