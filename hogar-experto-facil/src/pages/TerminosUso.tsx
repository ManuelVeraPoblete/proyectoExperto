import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const TerminosUso = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Términos de Uso</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: 27 de abril de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceptación de los términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al acceder o utilizar Hogar Experto Fácil (en adelante "la Plataforma"), usted acepta quedar
              vinculado por estos Términos de Uso. Si no está de acuerdo con alguno de ellos, debe abstenerse
              de usar la Plataforma. El uso continuado del servicio constituye aceptación de cualquier
              modificación futura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Descripción del servicio</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hogar Experto Fácil es una plataforma digital de intermediación que conecta a personas que
              requieren servicios del hogar ("Clientes") con profesionales independientes que ofrecen dichos
              servicios ("Expertos"). La Plataforma no presta los servicios del hogar directamente ni emplea
              a los Expertos; actúa exclusivamente como intermediario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Registro y cuenta</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Para utilizar las funcionalidades de la Plataforma usted debe:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Tener al menos 18 años de edad.</li>
              <li>Proporcionar información veraz, completa y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Notificarnos de inmediato ante cualquier uso no autorizado de su cuenta.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Usted es responsable de toda actividad que ocurra bajo su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Uso aceptable</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">Al usar la Plataforma, usted se compromete a no:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Publicar información falsa, engañosa o fraudulenta.</li>
              <li>Usar la Plataforma para actividades ilegales o contrarias a la moral.</li>
              <li>Acosar, amenazar o discriminar a otros usuarios.</li>
              <li>Intentar acceder sin autorización a sistemas o cuentas ajenas.</li>
              <li>Reproducir, distribuir o explotar comercialmente el contenido de la Plataforma sin permiso.</li>
              <li>Publicar publicidad o spam no solicitado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Responsabilidad de los Expertos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los Expertos son profesionales independientes y no empleados de la Plataforma. Son responsables
              de contar con las habilitaciones, licencias y seguros necesarios para prestar sus servicios de
              acuerdo con la legislación vigente. La Plataforma no garantiza la calidad, seguridad o legalidad
              de los servicios ofrecidos por los Expertos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Responsabilidad de los Clientes</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los Clientes son responsables de describir con precisión el trabajo requerido, de acordar
              condiciones claras con el Experto antes de iniciar cualquier trabajo y de realizar los pagos
              acordados directamente con el Experto. La Plataforma no intermedia en los pagos salvo que se
              indique expresamente lo contrario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contenido generado por usuarios</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al publicar contenido en la Plataforma (reseñas, fotos, mensajes, etc.), usted nos otorga una
              licencia no exclusiva, gratuita y transferible para usar, reproducir y mostrar dicho contenido
              en el contexto del servicio. Usted garantiza que el contenido no infringe derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Evaluaciones y calificaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Las evaluaciones deben reflejar experiencias reales y honestas. Está prohibido manipular el
              sistema de calificaciones, publicar reseñas falsas o incentivadas, o presionar a otros usuarios
              para que modifiquen sus evaluaciones. Nos reservamos el derecho de eliminar reseñas que violen
              estas normas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              La Plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio
              sea ininterrumpido, libre de errores o que los resultados sean exactos. En la máxima medida
              permitida por la ley, no seremos responsables por daños indirectos, incidentales o consecuentes
              derivados del uso de la Plataforma o de los servicios contratados entre usuarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Suspensión y cancelación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de suspender o cancelar cuentas que violen estos Términos, sin previo
              aviso y sin responsabilidad alguna hacia el usuario. Usted puede cancelar su cuenta en cualquier
              momento desde la configuración de su perfil o contactando a nuestro soporte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Propiedad intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los derechos de propiedad intelectual sobre la Plataforma (diseño, código, logotipos,
              marcas) pertenecen a Hogar Experto Fácil o a sus licenciantes. Ninguna disposición de estos
              Términos le otorga derechos sobre dicha propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Modificaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos modificar estos Términos en cualquier momento. Los cambios serán notificados mediante
              correo electrónico o aviso en la Plataforma con al menos 15 días de anticipación, salvo que
              sean requeridos urgentemente por razones legales. El uso continuado del servicio tras la
              notificación implica aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Ley aplicable y jurisdicción</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos Términos se rigen por las leyes de la República de Chile. Cualquier disputa que no
              pueda resolverse amistosamente será sometida a la jurisdicción de los tribunales ordinarios
              de justicia de la ciudad de Santiago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para consultas sobre estos Términos, puede contactarnos en:{" "}
              <a href="mailto:soporte@hogarexpertofacil.cl" className="text-primary hover:underline">
                soporte@hogarexpertofacil.cl
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Volver al inicio
          </Link>
          <span className="mx-4 text-muted-foreground">|</span>
          <Link to="/privacidad" className="text-primary hover:underline text-sm">
            Ver Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TerminosUso;
