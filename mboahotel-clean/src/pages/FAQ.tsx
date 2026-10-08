import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';

const questions = [
  {
    question: 'Puis-je réserver un hôtel sur le site ?',
    answer: 'Pas encore. Cette version présente une démonstration de l’interface. Les hôtels, tarifs et disponibilités affichés sont indicatifs ; aucune réservation réelle ne peut être effectuée.',
  },
  {
    question: 'Les prix et les disponibilités sont-ils confirmés ?',
    answer: 'Non. Les informations visibles dans le catalogue sont des exemples et doivent être vérifiées auprès des établissements avant tout séjour.',
  },
  {
    question: 'Puis-je payer par Mobile Money ou carte bancaire ?',
    answer: 'Aucun paiement n’est actuellement traité sur la plateforme. Les moyens de paiement seront communiqués lorsque le service de réservation sera opérationnel.',
  },
  {
    question: 'Comment proposer mon établissement ?',
    answer: 'Vous pouvez contacter l’équipe via le formulaire de contact. L’espace hôtelier et la gestion des établissements sont encore en développement.',
  },
  {
    question: 'Comment demander de l’aide ?',
    answer: 'Écrivez-nous depuis la page Contact. Le formulaire prépare un e-mail dans votre application de messagerie.',
  },
];

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(questions[0].question);
  const filteredQuestions = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('fr');
    return term
      ? questions.filter(item => `${item.question} ${item.answer}`.toLocaleLowerCase('fr').includes(term))
      : questions;
  }, [searchTerm]);

  return (
    <>
      <Helmet>
        <title>Questions fréquentes | MboaHotel Connect</title>
        <meta name="description" content="Réponses aux questions sur la démonstration MboaHotel Connect et ses fonctionnalités." />
      </Helmet>
      <div className="page-shell">
        <div className="page-container max-w-4xl">
          <PageIntro
            eyebrow="Centre d’aide"
            title="Questions fréquentes"
            description="Les informations essentielles sur le fonctionnement actuel de la plateforme."
          />

          <label className="relative mb-6 block">
            <span className="sr-only">Rechercher une question</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b847d]" />
            <input
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Rechercher une question"
              className="input pl-12"
            />
          </label>

          <div className="space-y-3">
            {filteredQuestions.map(({ question, answer }) => {
              const isOpen = openQuestion === question;
              const panelId = `faq-${questions.findIndex(item => item.question === question)}`;
              return (
                <section key={question} className="page-card overflow-hidden">
                  <h2>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenQuestion(isOpen ? null : question)}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#17251f] hover:bg-[#f5f1e8] sm:px-6"
                    >
                      <span>{question}</span>
                      <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-[#174c3a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </h2>
                  {isOpen && <div id={panelId} className="border-t border-[#e8e7e0] px-5 py-5 text-sm leading-7 text-[#59645d] sm:px-6">{answer}</div>}
                </section>
              );
            })}
            {filteredQuestions.length === 0 && (
              <div className="page-card p-8 text-center">
                <h2 className="section-title">Aucun résultat</h2>
                <p className="mt-2 text-sm text-[#68736b]">Essayez une autre recherche ou écrivez-nous.</p>
                <Link to="/contact" className="btn-primary mt-5">Contacter l’équipe</Link>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-[#174c3a] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-xl font-semibold">Vous avez encore une question ?</h2>
              <p className="mt-1 text-sm leading-6 text-white/75">Notre équipe peut vous renseigner sur le projet.</p>
            </div>
            <Link to="/contact" className="btn-secondary mt-4 border-white bg-white text-[#174c3a] hover:bg-[#f5f1e8] sm:mt-0">Nous contacter</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
