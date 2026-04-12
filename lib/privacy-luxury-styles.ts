export const LUXURY_PRIVACY_STYLES = `
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
`;
