import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import api from '../utils/api';

const initialForm = { name: '', email: '', subject: '', message: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.subject.trim()) errors.subject = 'Subject is required';
  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-xl mx-auto">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something"
          description="Open to freelance work, collaborations, or just a good technical conversation."
        />

        <Reveal>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1.5">Subject</label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-secondary outline-none transition-colors"
                aria-invalid={!!errors.subject}
              />
              {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-secondary outline-none transition-colors resize-none"
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : (<><FiSend size={16} /> Send Message</>)}
            </motion.button>

            {status === 'success' && (
              <p className="flex items-center gap-2 text-sm text-green-400">
                <FiCheckCircle size={16} /> Message sent — I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <FiAlertCircle size={16} /> Something went wrong. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
