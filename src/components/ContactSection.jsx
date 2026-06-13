import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ContactSection.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * ─────────────────────────────────────────────────────────────
 *  FORMSPREE SETUP — replace the ID below with your real one:
 *
 *  1. Go to https://formspree.io and create a free account
 *  2. Create a new form, set the recipient to Team@cliprelaymedia.com
 *  3. Copy the form ID (the part after /f/ in the endpoint URL)
 *  4. Paste it below, replacing "YOUR_FORM_ID"
 *
 *  Example: if your endpoint is https://formspree.io/f/xwkgjqal
 *  then set FORMSPREE_ID = 'xwkgjqal'
 * ─────────────────────────────────────────────────────────────
 */
const FORMSPREE_ID = 'YOUR_FORM_ID' // <-- PASTE YOUR FORMSPREE FORM ID HERE
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function ContactSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const formWrapRef = useRef(null)
  const sideRef = useRef(null)

  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })
      gsap.from(formWrapRef.current, {
        scrollTrigger: { trigger: formWrapRef.current, start: 'top 88%', end: 'top 60%', scrub: 1 },
        y: 35, opacity: 0,
      })
      gsap.from(sideRef.current, {
        scrollTrigger: { trigger: sideRef.current, start: 'top 88%', end: 'top 60%', scrub: 1 },
        y: 35, opacity: 0,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on edit
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('idle')

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm(initialForm)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={sectionRef} className="contact" id="contact">
      <div className="contact__inner">
        <div ref={headerRef} className="contact__header">
          <span className="section-label">Get in touch</span>
          <h2 className="section-title">
            Start a <span className="accent">campaign.</span>
          </h2>
        </div>

        <div className="contact__body">
          {/* ── Form ── */}
          <div ref={formWrapRef} className="contact__form-wrap">
            {status === 'success' ? (
              <div className="contact__success">
                <div className="contact__success-icon">✓</div>
                <p className="contact__success-text">Thanks — we'll be in touch shortly.</p>
                <button
                  className="contact__success-btn"
                  onClick={() => setStatus('idle')}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="contact__field">
                  <label htmlFor="contact-name" className="contact__label">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className={`contact__input ${errors.name ? 'contact__input--error' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="contact__error">{errors.name}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-email" className="contact__label">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className={`contact__input ${errors.email ? 'contact__input--error' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                  />
                  {errors.email && <span className="contact__error">{errors.email}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-subject" className="contact__label">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    className={`contact__input ${errors.subject ? 'contact__input--error' : ''}`}
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Campaign enquiry"
                  />
                  {errors.subject && <span className="contact__error">{errors.subject}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-message" className="contact__label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={`contact__input contact__textarea ${errors.message ? 'contact__input--error' : ''}`}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, content type, and goals."
                  />
                  {errors.message && <span className="contact__error">{errors.message}</span>}
                </div>

                {status === 'error' && (
                  <p className="contact__form-error">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  className="contact__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <span className="contact__spinner" />
                  ) : (
                    <>Send <span className="contact__submit-arrow">→</span></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Side info ── */}
          <div ref={sideRef} className="contact__side">
            <div className="contact__side-block">
              <h3 className="contact__side-title">Prefer email?</h3>
              <p className="contact__side-text">
                Reach us directly at
              </p>
              <a href="mailto:Team@cliprelaymedia.com" className="contact__email-link">
                Team@cliprelaymedia.com
              </a>
            </div>

            <div className="contact__side-block">
              <h3 className="contact__side-title">What to include</h3>
              <ul className="contact__side-list">
                <li>Content type (music, product, trailer, etc.)</li>
                <li>Target platforms (TikTok, Reels, Shorts)</li>
                <li>Budget range and timeline</li>
                <li>Any creative direction or references</li>
              </ul>
            </div>

            <div className="contact__side-block contact__side-block--nda">
              <p>Client campaigns run under NDA. Discretion is part of the service.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
