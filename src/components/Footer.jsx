import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <img src="/cliprelay-icon.png" alt="" className="footer__logo-img" />
              <span>Clip<span className="wordmark-accent">Relay</span></span>
            </a>
            <p className="footer__tagline">
              Organic short-form distribution at scale.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4>Product</h4>
              <a href="#what-we-do">What we do</a>
              <a href="#proof">Proof</a>
              <a href="#how-it-works">How it works</a>
              <a href="#why-organic">Why organic</a>
              <a href="#contact">Start a campaign</a>
            </div>
            <div className="footer__col">
              <h4>Company</h4>
              <a href="mailto:Team@cliprelaymedia.com">Team@cliprelaymedia.com</a>
            </div>
            <div className="footer__col">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__nda">
            Privacy by default. Clients choose whether to go public — we never share without permission.
          </p>
          <p className="footer__copy">&copy; {new Date().getFullYear()} ClipRelay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
