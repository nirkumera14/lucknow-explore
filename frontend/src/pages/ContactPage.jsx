import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: FiMapPin, label: 'Address', value: 'Hazratganj, Lucknow, Uttar Pradesh 226001, India' },
  { icon: FiMail, label: 'Email', value: 'hello@lucknowexplore.com' },
  { icon: FiPhone, label: 'Phone', value: '+91 9999999999' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title mb-3">📬 Contact Us</h1>
          <p className="text-white/50 text-lg">Have a question or suggestion? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-5 gold-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="glass rounded-2xl p-5 gold-border">
              <h3 className="font-semibold text-white mb-2">Office Hours</h3>
              <p className="text-white/50 text-sm">Monday – Saturday</p>
              <p className="text-white/50 text-sm">10:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-3">
            {submitted ? (
              <div className="glass rounded-3xl p-12 gold-border text-center">
                <FiCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/55">We'll respond within 24-48 hours.</p>
              </div>
            ) : (
              <div className="glass rounded-3xl p-8 gold-border">
                <h2 className="font-display text-2xl font-bold text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Your Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe" required className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com" required className="input-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?" required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Message</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message here..." rows={5} required
                      className="input-dark resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? 'Sending...' : (<><FiSend /> Send Message</>)}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
