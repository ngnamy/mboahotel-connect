import React from 'react';
import { Link } from 'react-router-dom';
import { DEVELOPER_INFO, getDeveloperSignature } from '../config/developer';
import { Building2, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">MboaHotel Connect</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La première plateforme de réservation hôtelière 100% camerounaise. 
              Découvrez et réservez les meilleurs établissements du Cameroun en toute simplicité.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/mboahotelconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/company/mboahotelconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white transition-colors">
                  Nos Hôtels
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">contact@mboahotel.cm</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+237 655 498 183</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  Yaoundé, Cameroun<br />
                  Quartier Bastos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Conditions d'utilisation
              </Link>
              <Link
                to="/register?role=hotelier"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Partenaires hôteliers
              </Link>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MboaHotel Connect. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Footer Créateur */}
      <div className="text-center py-2 mt-8">
        <p className="text-gray-400 text-sm">
          Créé et designé par <span className="font-semibold text-blue-700">Ngnamy Fotie Raumuald</span> (webmaster de profession)
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;