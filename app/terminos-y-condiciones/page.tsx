import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TerminosYCondicionesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Términos y Condiciones</CardTitle>
          <CardDescription>
            Por favor lea cuidadosamente los siguientes términos y condiciones antes de registrarse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">1. Aceptación de los Términos</h2>
          <p>
            Al registrarse en nuestra plataforma, usted acepta estar sujeto a estos Términos y Condiciones, así como a
            todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, está
            prohibido usar o acceder a este sitio.
          </p>

          <h2 className="text-xl font-semibold">2. Uso de la Cuenta</h2>
          <p>
            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, así como de restringir el
            acceso a su computadora. Acepta asumir la responsabilidad de todas las actividades que ocurran bajo su
            cuenta o contraseña.
          </p>

          <h2 className="text-xl font-semibold">3. Privacidad</h2>
          <p>
            Nos comprometemos a proteger su privacidad. La información personal que proporcione se utilizará únicamente
            para los fines específicos para los que fue recopilada. No compartiremos su información con terceros sin su
            consentimiento explícito, excepto cuando sea requerido por la ley.
          </p>

          <h2 className="text-xl font-semibold">4. Documentación</h2>
          <p>
            Los documentos que suba a nuestra plataforma serán tratados con confidencialidad y utilizados únicamente
            para los fines de verificación y registro. Nos reservamos el derecho de solicitar documentación adicional si
            es necesario para completar el proceso de verificación.
          </p>

          <h2 className="text-xl font-semibold">5. Verificación de Correo Electrónico</h2>
          <p>
            Para garantizar la seguridad de su cuenta, requerimos la verificación de su dirección de correo electrónico.
            Esto se realiza mediante el envío de un enlace de verificación a la dirección proporcionada durante el
            registro. Su cuenta no estará completamente activada hasta que complete este proceso de verificación.
          </p>

          <h2 className="text-xl font-semibold">6. Modificaciones a los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor
            inmediatamente después de su publicación en el sitio. Es su responsabilidad revisar periódicamente estos
            términos para estar al tanto de las modificaciones.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/" className="ml-auto">
            <Button>Volver al Registro</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
