
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Expertos a Domicilio</h3>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Conectamos a personas con expertos calificados para reparaciones y mejoras del hogar. 
              Profesional, confiable y seguro.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Enlaces para clientes */}
          <div>
            <h4 className="font-semibold mb-4">Para Clientes</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/buscar" className="text-gray-300 hover:text-white transition-colors">
                  Buscar Expertos
                </Link>
              </li>
              <li>
                <Link to="/publicar" className="text-gray-300 hover:text-white transition-colors">
                  Publicar Trabajo
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-300 hover:text-white transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/preguntas" className="text-gray-300 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces para expertos */}
          <div>
            <h4 className="font-semibold mb-4">Para Expertos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/unirse" className="text-gray-300 hover:text-white transition-colors">
                  Únete como Experto
                </Link>
              </li>
              <li>
                <Link to="/trabajos" className="text-gray-300 hover:text-white transition-colors">
                  Ver Trabajos
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-gray-300 hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/soporte" className="text-gray-300 hover:text-white transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            © 2024 Expertos a Domicilio. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacidad" className="text-sm text-gray-300 hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terminos" className="text-sm text-gray-300 hover:text-white transition-colors">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
