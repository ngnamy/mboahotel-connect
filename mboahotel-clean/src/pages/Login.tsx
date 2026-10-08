import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const user = await login(email, password);
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(requestedPath ?? (user.role === 'admin' || user.role === 'hotelier' || user.partnerApplicationStatus ? '/dashboard' : '/reservations'));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'La connexion a échoué. Vérifiez vos identifiants et réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Connexion | MboaHotel Connect</title></Helmet>
      <div className="page-shell flex items-center">
        <div className="page-container max-w-5xl">
          <div className="grid overflow-hidden rounded-3xl border border-[#e8e7e0] bg-white shadow-[0_20px_65px_rgba(23,37,31,0.09)] lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between bg-[#174c3a] p-7 text-white sm:p-10">
              <div>
                <Link to="/" className="inline-flex items-center gap-3 font-semibold text-white">
                  <img src="/hotel-icon.svg" alt="" className="h-10 w-10 rounded-xl bg-white p-1" />
                  MboaHotel
                </Link>
                <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d8a9]">Votre espace</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Heureux de vous retrouver.</h1>
                <p className="mt-4 max-w-sm leading-7 text-white/75">
                  Connectez-vous pour gérer vos informations et retrouver les réservations liées à votre compte.
                </p>
              </div>
              <p className="mt-12 text-sm text-white/60">Une expérience pensée pour les séjours au Cameroun.</p>
            </aside>

            <section className="p-6 sm:p-10" aria-labelledby="login-title">
              <div className="mx-auto max-w-md">
                <p className="page-eyebrow">Connexion</p>
                <h2 id="login-title" className="page-title">Accéder à mon compte</h2>
                <p className="page-description text-base">Saisissez vos identifiants pour continuer.</p>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {authError && <p role="status" className="rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] px-4 py-3 text-sm text-[#5c4324]">{authError}</p>}
                  {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#37443c]">Adresse e-mail</label>
                    <div className="relative">
                      <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b847d]" />
                      <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} className="input pl-11" placeholder="vous@exemple.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#37443c]">Mot de passe</label>
                    <div className="relative">
                      <Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b847d]" />
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="input pl-11 pr-12" />
                      <button type="button" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-[#68736b] hover:text-[#174c3a]">
                        {showPassword ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#68736b]">Besoin d’aide ? <Link to="/contact" className="font-semibold text-[#174c3a] hover:underline">Contactez-nous</Link>.</p>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                    {isSubmitting ? 'Connexion…' : 'Se connecter'} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-[#68736b]">
                  Pas encore de compte ? <Link to="/register" className="font-semibold text-[#174c3a] hover:underline">Créer un compte</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
