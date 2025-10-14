import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  subject: '',
  message: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text: string }

  const messageCount = useMemo(() => form.message.length, [form.message]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const validate = (values) => {
    const v = values || form;
    const next = {};
    if (!v.name || v.name.trim().length < 3) next.name = 'Please enter at least 3 characters.';
    if (!v.email || !emailRegex.test(v.email)) next.email = 'Please enter a valid email address.';
    if (v.phone && !phoneRegex.test(v.phone)) next.phone = 'Phone must be 10 digits.';
    if (!v.role || v.role === 'Select your role') next.role = 'Please select your role.';
    if (!v.subject || v.subject.trim().length === 0) next.subject = 'Please enter a subject.';
    if (v.subject && v.subject.length > 100) next.subject = 'Subject must be under 100 characters.';
    if (!v.message || v.message.trim().length === 0) next.message = 'Please enter a message.';
    if (v.message && v.message.length > 500) next.message = 'Message must be under 500 characters.';
    return next;
  };

  const isFormValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      setSubmitting(true);
      // Simulate API call; integrate real endpoint when available
      await new Promise((res) => setTimeout(res, 1200));
      setNotice({ type: 'success', text: "Message sent successfully! We'll get back to you within 24-48 hours." });
      setForm(initialForm);
    } catch (err) {
      setNotice({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = 'input';
  const labelBase = 'block text-sm font-medium mb-1';
  const errorText = 'mt-1 text-sm text-red-600';

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-gradient-to-r from-gray-50 to-purple-50 border-b">
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-pink-600">Home</Link> <span className="mx-1">›</span> <span>Contact</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Get In Touch</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, support, or feedback.
          </p>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 gap-8">
          {/* LEFT: FORM */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>

            {notice && (
              <div className={`mb-4 rounded-lg p-3 ${notice.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {notice.text}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase} htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className={`${inputBase} ${errors.name ? 'border-red-500' : ''}`}
                    value={form.name}
                    onChange={onChange}
                  />
                  {errors.name && <div className={errorText}>{errors.name}</div>}
                </div>

                <div>
                  <label className={labelBase} htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`${inputBase} ${errors.email ? 'border-red-500' : ''}`}
                    value={form.email}
                    onChange={onChange}
                  />
                  {errors.email && <div className={errorText}>{errors.email}</div>}
                </div>

                <div>
                  <label className={labelBase} htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={`${inputBase} ${errors.phone ? 'border-red-500' : ''}`}
                    value={form.phone}
                    onChange={onChange}
                  />
                  {errors.phone && <div className={errorText}>{errors.phone}</div>}
                </div>

                <div>
                  <label className={labelBase} htmlFor="role">I am a *</label>
                  <select
                    id="role"
                    name="role"
                    className={`${inputBase} ${errors.role ? 'border-red-500' : ''}`}
                    value={form.role}
                    onChange={onChange}
                  >
                    <option>Select your role</option>
                    <option>Buyer</option>
                    <option>Seller</option>
                    <option>Partner/Collaborator</option>
                    <option>Other</option>
                  </select>
                  {errors.role && <div className={errorText}>{errors.role}</div>}
                </div>
              </div>

              <div className="mt-4">
                <label className={labelBase} htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is this regarding?"
                  className={`${inputBase} ${errors.subject ? 'border-red-500' : ''}`}
                  value={form.subject}
                  onChange={onChange}
                  maxLength={100}
                />
                {errors.subject && <div className={errorText}>{errors.subject}</div>}
              </div>

              <div className="mt-4">
                <label className={labelBase} htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your query or feedback..."
                  className={`${inputBase} ${errors.message ? 'border-red-500' : ''}`}
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">{messageCount}/500 characters</div>
                {errors.message && <div className={errorText}>{errors.message}</div>}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${submitting || !isFormValid ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={submitting || !isFormValid}
                >
                  {submitting ? <span className="inline-flex items-center gap-2"><span className="spinner"></span> Sending...</span> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: CONTACT INFO */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="bg-[#f9f9f9] p-4 rounded-lg border flex items-start gap-3">
                <div className="text-2xl">📧</div>
                <div>
                  <div className="font-semibold">Email</div>
                  <a className="text-pink-600 hover:underline" href="mailto:support@sheleads.com">support@sheleads.com</a>
                </div>
              </div>

              <div className="bg-[#f9f9f9] p-4 rounded-lg border flex items-start gap-3">
                <div className="text-2xl">📞</div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <a className="text-pink-600 hover:underline" href="tel:+919999999999">+91 XXXXX XXXXX</a>
                </div>
              </div>

              <div className="bg-[#f9f9f9] p-4 rounded-lg border flex items-start gap-3">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-gray-700 whitespace-pre-line">Your College Name
City, State - Pincode
India</div>
                </div>
              </div>

              <div className="bg-[#f9f9f9] p-4 rounded-lg border flex items-start gap-3">
                <div className="text-2xl">⏰</div>
                <div>
                  <div className="font-semibold">We're Available</div>
                  <div className="text-gray-700 whitespace-pre-line">Monday - Saturday
9:00 AM - 6:00 PM IST
(Closed on Sundays)</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-pink-100 text-pink-600 flex items-center justify-center">IG</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-pink-100 text-pink-600 flex items-center justify-center">in</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-pink-100 text-pink-600 flex items-center justify-center">f</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-pink-100 text-pink-600 flex items-center justify-center">x</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HELP */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Need Quick Help?</h2>
          <div className="grid grid-cols-3 gap-6">
            {[{
              icon: '🏪', title: 'Seller Support', desc: 'Need help with adding products, managing orders, or account settings?', cta: 'Seller Help Center', href: '/seller/dashboard'
            }, {
              icon: '🛍️', title: 'Buyer Support', desc: 'Questions about orders, payments, or returns?', cta: 'Buyer Help Center', href: '/products'
            }, {
              icon: '🔧', title: 'Technical Support', desc: 'Facing website issues or bugs?', cta: 'Report Issue', href: '#contact-form'
            }].map((card, i) => (
              <div key={i} className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 flex flex-col">
                <div className="text-4xl mb-3">{card.icon}</div>
                <div className="font-semibold text-lg mb-2">{card.title}</div>
                <div className="text-gray-600 mb-4 flex-1">{card.desc}</div>
                {card.href.startsWith('#') ? (
                  <a href={card.href} className="btn btn-outline">{card.cta}</a>
                ) : (
                  <Link to={card.href} className="btn btn-outline">{card.cta}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion
            items={[
              { q: 'How do I register as a seller?', a: 'Click on "Register" in the top menu, select "Register as Seller", fill in your business details, and you\'re ready to start selling!' },
              { q: 'Is there any fee to sell on SheLeads?', a: "No, we don't charge any commission for sellers from backward classes. Our platform is completely free to use." },
              { q: 'How do I track my order?', a: 'Login to your buyer account, go to "My Orders" section to view order status and tracking details.' },
              { q: 'How long does shipping take?', a: 'Shipping time depends on the seller\'s location and your delivery address. Typically, orders are delivered within 5-7 business days.' },
              { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (where available).' },
              { q: 'How can I return a product?', a: 'Check our Returns Policy page for detailed information. You can initiate returns within 7 days of delivery for most products.' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="divide-y rounded-lg border bg-white">
      {items.map((it, i) => {
        const open = openIdx === i;
        return (
          <div key={i}>
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between"
              onClick={() => setOpenIdx(open ? null : i)}
            >
              <span className="font-medium">{it.q}</span>
              <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            <div className={`px-4 overflow-hidden transition-all ${open ? 'max-h-40 py-2' : 'max-h-0'}`}>
              <p className="text-gray-700">{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

