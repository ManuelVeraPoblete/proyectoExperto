
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-300">
          © 2024 Expertos a Domicilio. Todos los derechos reservados.
        </p>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <Link to="/privacidad" className="text-sm text-gray-300 hover:text-white transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/terminos" className="text-sm text-gray-300 hover:text-white transition-colors">
            Términos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
