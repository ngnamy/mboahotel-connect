import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'hotelier' ? 'hotelier' : 'client';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    const [firstName, ...lastName] = fullName.trim().split(/\s+/);
    setIsSubmitting(true);
    setError('');
    try {
      await register({ email, password, firstName, lastName: lastName.join(' '), role });
      navigate(role === 'hotelier' ? '/dashboard' : '/reservations');
    } catch {
      setError('La création de compte est indisponible pour le moment. Réessayez lorsque le service sera configuré.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Créer un compte | MboaHotel Connect</title></Helmet>
      <div className="page-shell flex items-center">
        <div className="page-container max-w-5xl">
          <div className="grid overflow-hidden rounded-3xl border border-[#e8e7e0] bg-white shadow-[0_20px_65px_rgba(23,37,31,0.09)] lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between bg-[#174c3a] p-7 text-white sm:p-10">
              <div>
                <Link to="/" className="inline-flex items-center gap-3 font-semibold text-white">
                  <img src="/hotel-icon.svg" alt="" className="h-10 w-10 rounded-xl bg-white p-1" />
                  MboaHotel
                </Link>
                <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d8a9]">
                  {role === 'hotelier' ? 'Espace partenaire' : 'Bienvenue'}
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Préparez votre prochain séjour.</h1>
                <p className="mt-4 max-w-sm leading-7 text-white/75">
                  {role === 'hotelier'
                    ? 'Manifestez votre intérêt pour rejoindre la plateforme dédiée aux hébergements du Cameroun.'
                    : 'Créez votre espace pour retrouver plus facilement vos découvertes.'}
                </p>
              </div>
              <p className="mt-12 text-sm text-white/60">La création de compte dépend encore de la mise en service de l’API.</p>
            </aside>

            <section className="p-6 sm:p-10" aria-labelledby="register-title">
              <div className="mx-auto max-w-md">
                <p className="page-eyebrow">{role === 'hotelier' ? 'Partenaires' : 'Inscription'}</p>
                <h2 id="register-title" className="page-title">Créer mon compte</h2>
                <p className="page-description text-base">Renseignez vos coordonnées pour commencer.</p>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#37443c]">Nom complet</label>
                    <div className="relative">
                      <User aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b847d]" />
                      <input id="fullName" name="fullName" type="text" autoComplete="name" required minLength={2} className="input pl-11" placeholder="Prénom et nom" value={fullName} onChange={event => setFullName(event.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#37443c]">Adresse e-mail</label>
                    <div className="relative">
                      <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b847d]" />
                      <input id="email" name="email" type="email" autoComplete="email" required className="input pl-11" placeholder="vous@exemple.com" value={email} onChange={event => setEmail(event.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#37443c]">Mot de passe</label>
                    <div className="relative">
                      <Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b847d]" />
                      <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className="input pl-11" value={password} onChange={event => setPassword(event.target.value)} />
                    </div>
                    <p className="mt-1 text-xs text-[#68736b]">8 caractères minimum.</p>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-[#37443c]">Confirmer le mot de passe</label>
                    <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required minLength={8} className="input" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                    {isSubmitting ? 'Création…' : 'Créer mon compte'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-[#68736b]">
                  Déjà inscrit ? <Link to="/login" className="font-semibold text-[#174c3a] hover:underline">Se connecter</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
