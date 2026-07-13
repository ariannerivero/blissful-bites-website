"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaRegEnvelope,
  FaTimes,
} from "react-icons/fa";

const eventTypes = [
  {
    icon: "🎂",
    title: "Birthdays",
    description: "Make birthdays extra sweet with warm mini doughnuts.",
  },
  {
    icon: "💍",
    title: "Weddings",
    description: "A fun and memorable treat for your special day.",
  },
  {
    icon: "🎪",
    title: "Festivals & Markets",
    description: "Fresh doughnuts and lemonade made for busy crowds.",
  },
  {
    icon: "🏢",
    title: "Corporate Events",
    description: "A cheerful treat for teams, clients, and guests.",
  },
  {
    icon: "🏫",
    title: "School Events",
    description: "A family-friendly favourite for school celebrations.",
  },
  {
    icon: "🎉",
    title: "Private Parties",
    description: "Perfect for showers, reunions, and special gatherings.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  location: "",
  guestCount: "",
  message: "",
  website: "",
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [trustSectionVisible, setTrustSectionVisible] = useState(false);

  const [trustCounts, setTrustCounts] = useState({
    events: 0,
    festivals: 0,
    customers: 0,
  });

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  useEffect(() => {
    const trustSection = document.getElementById("trust-signals");

    if (!trustSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustSectionVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(trustSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trustSectionVisible) return;

    const duration = 1600;
    const startTime = performance.now();

    const targets = {
      events: 1200,
      festivals: 500,
      customers: 120000,
    };

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setTrustCounts({
        events: Math.floor(targets.events * easedProgress),
        festivals: Math.floor(targets.festivals * easedProgress),
        customers: Math.floor(targets.customers * easedProgress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [trustSectionVisible]);

  function openEventForm() {
    setFormStatus("idle");
    setFormOpen(true);
    setMenuOpen(false);
  }

  function closeEventForm() {
    if (formStatus !== "submitting") {
      setFormOpen(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");

    try {
      const response = await fetch("/api/event-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to submit event request.");
      }

      setFormStatus("success");
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link
            href="#home"
            className="brand-logo"
            aria-label="Blissful Bites home"
          >
            <Image
              src="/images/blissful-bites-logo.png"
              alt="Blissful Bites Mini Doughnuts"
              width={145}
              height={110}
              priority
            />
          </Link>

          <button
            type="button"
            className={`mobile-menu-button ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-navigation ${menuOpen ? "is-open" : ""}`}>
            <Link href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="#events" onClick={() => setMenuOpen(false)}>
              Events
            </Link>

            <Link href="#gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </Link>

            <Link href="#contact" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>

            <div className="header-cta-wrapper">
              <button
                type="button"
                className="header-cta"
                onClick={openEventForm}
              >
                Request a Free Event Quote →
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-decoration flower flower-one">✿</div>
          <div className="hero-decoration flower flower-two">✿</div>
          <div className="hero-decoration flower flower-three">✿</div>
          <div className="hero-decoration sprinkle sprinkle-one" />
          <div className="hero-decoration sprinkle sprinkle-two" />
          <div className="hero-decoration sprinkle sprinkle-three" />

          <div className="hero-inner">
            <div className="hero-content">
              <p className="section-eyebrow dark-eyebrow">
                Mini doughnuts, fresh lemonades
              </p>

              <h1>Little bites.<br />Big happiness.</h1>

              <p className="hero-description">
                Warning: Fresh made mini doughnuts
                <br />
                &amp; freshly squeezed lemonade
                <br />
                may cause extreme happiness 💗
              </p>

              <div className="heroActions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={openEventForm}
                >
                  Request a Free Event Quote →
                </button>

                <a className="textLink" href="#about">
                  Discover Blissful Bites →
                </a>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <Image
                src="/images/mini-doughnuts-and-lemonade.png"
                alt="Fresh mini doughnuts and fresh-squeezed lemonade from Blissful Bites"
                width={520}
                height={520}
                className="hero-image"
                priority
              />
            </div>
          </div>

          <div className="torn-edge hero-torn-edge" />
        </section>

        <section id="trust-signals" className="trust-signals-section">
          <div className="content-container trust-signals-grid">
            <article className="trust-signal trust-signal-featured">
              <span className="trust-number">#1</span>
              <p>Doughnut Food Truck in Peterborough</p>
            </article>

            <article className="trust-signal">
              <span className="trust-number">
                {trustCounts.events.toLocaleString()}+
              </span>
              <p>Successful Events</p>
            </article>

            <article className="trust-signal">
              <span className="trust-number">
                {trustCounts.festivals.toLocaleString()}+
              </span>
              <p>Festivals Attended</p>
            </article>

            <article className="trust-signal">
              <span className="trust-number">
                {trustCounts.customers.toLocaleString()}+
              </span>
              <p>Happy Customers</p>
            </article>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="content-container about-grid">
            <div className="about-content">
              <p className="section-eyebrow">Made fresh. Served happy.</p>

              <h2>
                Your favourite{' '}
                <br/>
                event treat,{' '}
                <br/>
                made right on{' '}
                <br/>
                the spot.
              </h2>

              <button
                type="button"
                className="primary-button"
                onClick={openEventForm}
              >
                Request a Free Event Quote →
              </button>
            </div>

            <div className="about-image-wrapper">
              <Image
                src="/images/blissful-bites-trailer.png"
                alt="Blissful Bites mini doughnuts food trailer at an outdoor event"
                width={820}
                height={560}
                className="about-image"
              />
            </div>
          </div>
        </section>

        <section id="events" className="events-section">
          <div className="content-container">
            <div className="section-heading">
              <p className="section-eyebrow">Perfect for any occasion</p>
              <h2>We bring the happiness to</h2>
            </div>

            <div className="event-card-grid">
              {eventTypes.map((eventType) => (
                <article className="event-card" key={eventType.title}>
                  <div className="event-icon" aria-hidden="true">
                    {eventType.icon}
                  </div>

                  <div>
                    <h3>{eventType.title}</h3>
                    <p>{eventType.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="centered-cta">
              <button
                type="button"
                className="primary-button large-button"
                onClick={openEventForm}
              >
                Request a Free Event Quote →
              </button>
            </div>
          </div>
        </section>

        <section className="upcoming-events-section">
          <div className="content-container upcoming-events-inner">
            <div className="upcoming-events-heading">
              <p className="section-eyebrow">Upcoming events</p>
              <h2>Find Us This Week</h2>

              <p>
                Stop by for warm mini doughnuts and freshly squeezed lemonade.
              </p>
            </div>

            <div className="upcoming-events-list">
              <article className="upcoming-event-card">
                <div className="upcoming-event-date">
                  <span>JUL</span>
                  <strong>15</strong>
                </div>

                <div className="upcoming-event-details">
                  <p className="event-location">
                    <FaMapMarkerAlt aria-hidden="true" />
                    Peterborough Music Fest <br />
                    Del Crary Park, Peterborough, ON K9J 3G3
                  </p>

                  <h3>Saturday, July 18</h3>
                  <p className="event-time">11:00 AM – 9:00 PM</p>
                </div>
              </article>

              <article className="upcoming-event-card">
                <div className="upcoming-event-date">
                  <span>JUL</span>
                  <strong>18</strong>
                </div>

                <div className="upcoming-event-details">
                  <p className="event-location">
                    <FaMapMarkerAlt aria-hidden="true" />
                    Peterborough Music Fest <br />
                    Del Crary Park, Peterborough, ON K9J 3G3
                  </p>

                  <h3>Sunday, July 19</h3>
                  <p className="event-time">11:00 AM – 9:00 PM</p>
                </div>
              </article>
            </div>

            <div className="upcoming-events-action">
              <a className="primary-button upcoming-events-button" href="#events">
                View All Events →
              </a>
            </div>
          </div>
        </section>

        <section id="menu" className="hidden-anchor" aria-hidden="true" />
        <section id="gallery" className="hidden-anchor" aria-hidden="true" />
      </main>

      <footer id="contact" className="site-footer">
        <div className="torn-edge footer-torn-edge" />

        <div className="footer-decoration footer-sprinkle-one" />
        <div className="footer-decoration footer-sprinkle-two" />
        <div className="footer-decoration footer-sprinkle-three" />
        <div className="footer-decoration footer-sprinkle-four" />

        <div className="content-container footer-inner">
          <div className="footer-brand">
            <Image
              src="/images/blissful-bites-logo.png"
              alt="Blissful Bites Mini Doughnuts"
              width={115}
              height={88}
            />

            <div>
              <h3>
                Blissful Bites
                <br />
                Mini Doughnuts
              </h3>

              <p>
                <FaMapMarkerAlt />
                Peterborough, Ontario
              </p>

              <a href="mailto:blissfulbitesminidoughnuts@outlook.com">
                <FaRegEnvelope />
                blissfulbitesminidoughnuts@outlook.com
              </a>
            </div>
          </div>

          <div className="footer-right">
            <p>Powered by ServlyPro. All rights reserved 2026.</p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/blissfulbitesminidoughnuts/"
                target="_blank"
                rel="noreferrer"
                aria-label="Blissful Bites on Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/people/Blissful-Bites-Mini-Doughnuts/61577043477900/?ref=PROFILE_EDIT_xav_ig_profile_page_web#"
                target="_blank"
                rel="noreferrer"
                aria-label="Blissful Bites on Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.tiktok.com/@blissfulbitesdoughnuts"
                target="_blank"
                rel="noreferrer"
                aria-label="Blissful Bites on TikTok"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {formOpen && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEventForm();
            }
          }}
        >
          <div
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-request-title"
          >
            <button
              type="button"
              className="modal-close-button"
              aria-label="Close event request form"
              onClick={closeEventForm}
            >
              <FaTimes />
            </button>

            {formStatus === "success" ? (
              <div className="success-message">
                <div className="success-icon">🎉</div>
                <p className="section-eyebrow">Request received</p>
                <h2>Thank you!</h2>
                <p>
                  Your event request has been sent to Blissful Bites. We will
                  contact you soon to discuss your celebration.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setFormOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="modal-heading">
                  <p className="section-eyebrow">Let&apos;s make it sweet</p>
                  <h2 id="event-request-title">Request Blissful Bites</h2>
                  <p>
                    Tell us about your event. Submitting this form does not
                    confirm your booking. We will contact you to discuss
                    availability and event details.
                  </p>
                </div>

                <form className="event-form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="name">Full name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            email: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">Phone number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            phone: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="eventType">Event type *</label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        value={formData.eventType}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            eventType: event.target.value,
                          })
                        }
                      >
                        <option value="">Select an event</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Festival or Market">
                          Festival or Market
                        </option>
                        <option value="Corporate Event">
                          Corporate Event
                        </option>
                        <option value="School Event">School Event</option>
                        <option value="Private Party">Private Party</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="eventDate">Preferred date *</label>
                      <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.eventDate}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            eventDate: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="eventTime">Preferred time</label>
                      <input
                        id="eventTime"
                        name="eventTime"
                        type="time"
                        value={formData.eventTime}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            eventTime: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field form-field-wide">
                      <label htmlFor="location">Event location *</label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="Venue name, city, or full address"
                        required
                        value={formData.location}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            location: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field form-field-wide">
                      <label htmlFor="guestCount">
                        Estimated number of guests
                      </label>
                      <input
                        id="guestCount"
                        name="guestCount"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={formData.guestCount}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            guestCount: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-field form-field-wide">
                      <label htmlFor="message">Tell us about your event</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Share any details, questions, or special requests."
                        value={formData.message}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            message: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div
                      className="honeypot-field"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            website: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {formStatus === "error" && (
                    <p className="form-error" role="alert">
                      We could not send your request. Please try again or email
                      blissfulbitesminidoughnuts@outlook.com.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="primary-button submit-button"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting"
                      ? "Sending Request..."
                      : "Send Event Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}