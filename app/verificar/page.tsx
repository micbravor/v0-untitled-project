"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { verificarCorreo } from "@/app/actions/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerificarPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [estado, setEstado] = useState<"verificando" | "exito" | "error">("verificando")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    async function verificar() {
      if (!token) {
        setEstado("error")
        setMensaje("Token de verificación no proporcionado")
        return
      }

      const resultado = await verificarCorreo(token)

      if (resultado.success) {
        setEstado("exito")
      } else {
        setEstado("error")
        setMensaje(resultado.error || "Error al verificar el correo electrónico")
      }
    }

    verificar()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verificación de Correo</CardTitle>
          <CardDescription>{estado === "verificando" ? "Verificando su correo electrónico..." : ""}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {estado === "verificando" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Verificando su correo electrónico...</p>
            </div>
          )}

          {estado === "exito" && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">¡Verificación Exitosa!</h3>
              <p className="mt-2">Su correo electrónico ha sido verificado correctamente.</p>
              <p className="mt-4">Ahora puede iniciar sesión en su cuenta.</p>
            </div>
          )}

          {estado === "error" && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold">Error de Verificación</h3>
              <p className="mt-2">{mensaje || "Ocurrió un error al verificar su correo electrónico."}</p>
              <p className="mt-4">Por favor, intente nuevamente o contacte a soporte.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
