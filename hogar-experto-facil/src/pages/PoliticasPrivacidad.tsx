import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const PoliticasPrivacidad = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Política de Privacidad</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: 27 de abril de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Quiénes somos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hogar Experto Fácil es una plataforma digital que conecta a usuarios del hogar con profesionales y
              expertos en servicios del hogar. Operamos como intermediario y facilitamos el contacto, la contratación
              y la comunicación entre ambas partes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Datos que recopilamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Recopilamos los siguientes tipos de información personal:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Datos de registro:</strong> nombre, apellido, correo electrónico, número de teléfono y contraseña cifrada.</li>
              <li><strong>Datos de perfil:</strong> fotografía, descripción profesional, categorías de servicio, portafolio y evaluaciones.</li>
              <li><strong>Datos de uso:</strong> historial de búsquedas, publicaciones de trabajos, mensajes y actividad dentro de la plataforma.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y registros de acceso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Finalidad del tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Utilizamos sus datos para:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Crear y gestionar su cuenta de usuario.</li>
              <li>Facilitar la conexión entre clientes y expertos.</li>
              <li>Procesar solicitudes, mensajes y notificaciones.</li>
              <li>Mejorar la experiencia de la plataforma mediante análisis de uso.</li>
              <li>Enviar comunicaciones relacionadas con el servicio (confirmaciones, alertas de seguridad).</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Base legal del tratamiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              El tratamiento de sus datos se basa en: (a) la ejecución del contrato de servicio que acepta al
              registrarse, (b) su consentimiento explícito cuando así se le solicite, y (c) nuestros intereses
              legítimos en operar y mejorar la plataforma, siempre que no prevalezcan sobre sus derechos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Compartición de datos</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              No vendemos sus datos personales. Podemos compartirlos en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Entre usuarios:</strong> el perfil público del experto (nombre, foto, calificaciones) es visible para los clientes que lo contraten.</li>
              <li><strong>Proveedores de servicios:</strong> empresas que nos apoyan en hosting, correo y análisis, bajo acuerdos de confidencialidad.</li>
              <li><strong>Autoridades:</strong> cuando sea requerido por ley o resolución judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Retención de datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conservamos sus datos mientras su cuenta esté activa o sea necesario para prestar el servicio.
              Al eliminar su cuenta, sus datos serán suprimidos o anonimizados en un plazo máximo de 30 días,
              salvo aquellos que debamos conservar por obligación legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Sus derechos</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Usted tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Acceso:</strong> solicitar una copia de los datos que tenemos sobre usted.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de sus datos personales.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Para ejercer estos derechos, contáctenos en{" "}
              <a href="mailto:privacidad@hogarexpertofacil.cl" className="text-primary hover:underline">
                privacidad@hogarexpertofacil.cl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Seguridad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos contra acceso no
              autorizado, alteración, divulgación o destrucción. Las contraseñas se almacenan cifradas y las
              comunicaciones se transmiten mediante protocolos seguros (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento de la plataforma (sesión, autenticación) y
              cookies analíticas para entender cómo se usa el sitio. Puede configurar su navegador para rechazar
              cookies no esenciales, aunque esto puede afectar algunas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Cambios a esta política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos actualizar esta política ocasionalmente. Le notificaremos cambios significativos mediante
              correo electrónico o un aviso destacado en la plataforma. El uso continuado del servicio tras la
              notificación implica aceptación de los cambios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tiene preguntas sobre esta política o sobre el tratamiento de sus datos, puede contactarnos en:{" "}
              <a href="mailto:privacidad@hogarexpertofacil.cl" className="text-primary hover:underline">
                privacidad@hogarexpertofacil.cl
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Volver al inicio
          </Link>
          <span className="mx-4 text-muted-foreground">|</span>
          <Link to="/terminos" className="text-primary hover:underline text-sm">
            Ver Términos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoliticasPrivacidad;
