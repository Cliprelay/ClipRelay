import './LegalPage.css'

const EFFECTIVE_DATE = 'June 13, 2026'

const privacy = {
  title: 'Privacy Policy',
  sections: [
    {
      heading: 'What we collect',
      body: [
        'When you contact us through the form on this site, we collect the information you provide: your name, email address, subject, and message.',
        'We may also collect basic, anonymous analytics about how the site is used (such as page views). We do not use this to identify you personally.',
      ],
    },
    {
      heading: 'How we use it',
      body: [
        'We use the information you send us to respond to your inquiry and, if we work together, to provide our services. That\'s it.',
        'We do not sell your personal data. We do not share it with third parties for marketing.',
      ],
    },
    {
      heading: 'Form processing',
      body: [
        'Contact-form submissions are processed and delivered to us by our form provider. Your submission is transmitted securely and arrives in our inbox like an email.',
      ],
    },
    {
      heading: 'Data retention',
      body: [
        'We keep correspondence for as long as it\'s useful for responding to you or maintaining our working relationship. If you\'d like your information deleted, email us and we\'ll remove it.',
      ],
    },
    {
      heading: 'Questions',
      body: [
        'For any privacy questions or requests, contact Team@cliprelaymedia.com.',
      ],
    },
  ],
}

const terms = {
  title: 'Terms of Service',
  sections: [
    {
      heading: 'About this site',
      body: [
        'This website provides information about ClipRelay\'s short-form content distribution services. Browsing the site does not create a business relationship between you and ClipRelay.',
      ],
    },
    {
      heading: 'No warranties',
      body: [
        'The content on this site is provided "as is," without warranties of any kind, express or implied. We work to keep information accurate and current, but we make no guarantee that it is complete or error-free.',
      ],
    },
    {
      heading: 'Third-party statistics',
      body: [
        'Industry statistics cited on this site are drawn from third-party sources and are provided for general information. They describe the short-form video market — not the results of any specific ClipRelay campaign.',
      ],
    },
    {
      heading: 'No guarantee of results',
      body: [
        'Nothing on this site constitutes a guarantee of specific campaign outcomes. Every engagement is governed by an individual written agreement between ClipRelay and the client, which sets out the actual scope, terms, and deliverables.',
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'To the fullest extent permitted by law, ClipRelay is not liable for any indirect, incidental, or consequential damages arising from your use of this site or reliance on its content.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        'The content, design, and branding on this site belong to ClipRelay. Please don\'t reproduce them without permission.',
      ],
    },
    {
      heading: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The version posted here is the one in effect.',
      ],
    },
  ],
}

export default function LegalPage({ type }) {
  const doc = type === 'privacy' ? privacy : terms

  return (
    <div className="legal">
      <header className="legal__header">
        <a href="/" className="legal__logo">
          <img src="/cliprelay-icon.png" alt="" className="legal__logo-img" />
          <span>Clip<span className="wordmark-accent">Relay</span></span>
        </a>
        <a href="/" className="legal__back">← Back to site</a>
      </header>

      <main className="legal__main">
        <h1 className="legal__title">{doc.title}</h1>
        <p className="legal__date">Effective date: {EFFECTIVE_DATE}</p>

        {doc.sections.map((s, i) => (
          <section key={i} className="legal__section">
            <h2>{s.heading}</h2>
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}

        <p className="legal__contact">
          Questions? Contact <a href="mailto:Team@cliprelaymedia.com">Team@cliprelaymedia.com</a>.
        </p>
      </main>
    </div>
  )
}
