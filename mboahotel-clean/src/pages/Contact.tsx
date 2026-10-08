import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle, Send } from 'lucide-react';
import PageIntro from '../components/PageIntro';

const CONTACT_EMAIL = 'contact@mboahotelconnect.com';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [`Nom : ${name}`, `E-mail : ${email}`, '', message].join('\n');
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <>
      <Helmet>
        <title>Contact | MboaHotel Connect</title>
        <meta name="description" content="Contactez MboaHotel Connect pour une question sur le projet ou un partenariat hôtelier." />
      </Helmet>
      <div className="page-shell">
        <div className="page-container">
          <PageIntro
            eyebrow="Parlons de votre projet"
            title="Comment pouvons-nous vous aider ?"
            description="Une question sur MboaHotel Connect ou l’envie de proposer un hébergement ? Écrivez-nous."
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
            <section className="page-card p-6 sm:p-8" aria-labelledby="contact-form-title">
              <div className="mb-6 flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]">
                  <MessageCircle aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="contact-form-title" className="section-title">Envoyer un message</h2>
                  <p className="mt-1 text-sm leading-6 text-[#68736b]">
                    Le formulaire prépare un e-mail dans votre application de messagerie ; il n’envoie pas de données à un serveur.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#37443c]">Nom complet</label>
                    <input id="contact-name" name="name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} className="input" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[#37443c]">Adresse e-mail</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} className="input" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-[#37443c]">Sujet</label>
                  <select id="contact-subject" name="subject" required value={subject} onChange={event => setSubject(event.target.value)} className="input">
                    <option value="">Choisissez un sujet</option>
                    <option value="Question sur MboaHotel Connect">Question sur le projet</option>
                    <option value="Proposer un hébergement">Proposer un hébergement</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#37443c]">Votre message</label>
                  <textarea id="contact-message" name="message" required rows={6} value={message} onChange={event => setMessage(event.target.value)} className="input min-h-36 resize-y" />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send aria-hidden="true" className="h-4 w-4" /> Préparer l’e-mail
                </button>
              </form>
            </section>

            <aside className="space-y-4">
              <section className="page-card p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f0eb] text-[#a95636]">
                  <Mail aria-hidden="true" className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-[#17251f]">Par e-mail</h2>
                <p className="mt-2 text-sm leading-6 text-[#68736b]">Vous pouvez aussi écrire directement à notre équipe.</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-flex break-all font-semibold text-[#174c3a] hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </section>
              <section className="rounded-2xl border border-[#e4d0a2] bg-[#f8f3e9] p-6">
                <h2 className="font-semibold text-[#5c4324]">À propos des réservations</h2>
                <p className="mt-2 text-sm leading-6 text-[#76552b]">
                  Les réservations et les paiements ne sont pas encore disponibles sur cette version de démonstration.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
