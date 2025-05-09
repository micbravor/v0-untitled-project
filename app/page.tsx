"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

// Inicializar el cliente de Supabase
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Supabase
const supabase = createClient("https://ukydamvjknebkkufqtub.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreWRhbXZqa25lYmtrdWZxdHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDUyODEsImV4cCI6MjA2MjA4MTI4MX0.g6OZQy5Lo4j9YSjTKqkBdx4bUvlCDuGA5SxSnuoV4Sk")

export default function RegistroPage() {
  const [open, setOpen] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [archivos, setArchivos] = useState<File[]>([])
  const [registrando, setRegistrando] = useState(false)
  const [verificacionPendiente, setVerificacionPendiente] = useState(false)
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!aceptaTerminos) {
      toast({
        title: "Error",
        description: "Debe aceptar los términos y condiciones para continuar",
        variant: "destructive",
      })
      return
    }

    setRegistrando(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Extraer datos del formulario
      const nombre = formData.get("nombre") as string
      const apellidoPaterno = formData.get("apellido-paterno") as string
      const apellidoMaterno = formData.get("apellido-materno") as string
      const telefono = formData.get("telefono") as string
      const email = formData.get("correo") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirm-password") as string

      // Verificar que las contraseñas coincidan
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          variant: "destructive",
        })
        setRegistrando(false)
        return
      }

      // Registrar usuario en Supabase Auth (siguiendo el ejemplo proporcionado)
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) {
        toast({
          title: "Error al registrar usuario",
          description: error.message,
          variant: "destructive",
        })
        setRegistrando(false)
        return
      }

      // Si el registro fue exitoso, guardar información adicional en la tabla 'usuarios'
          if (data.user) {
            const { error: usuarioError } = await supabase.from("usuario").insert({
              nombre: nombre,
              primer_apellido: apellidoPaterno,
              segundo_apellido: apellidoMaterno,
              telefono: telefono,
            })

            const { error: postorError } = await supabase.from("postor").insert({
              telefono: telefono,
            })

            if (usuarioError || postorError) {
              console.error("Error al guardar información adicional:", usuarioError?.message || postorError?.message)
            }
          }


      setVerificacionPendiente(true)
      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de verificación a su dirección de correo electrónico",
      })
    } catch (error) {
      console.error("Error en el registro:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, intente nuevamente",
        variant: "destructive",
      })
    } finally {
      setRegistrando(false)
    }
  }

  if (verificacionPendiente) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Verificación Pendiente</CardTitle>
            <CardDescription>
              Hemos enviado un correo de verificación a su dirección de correo electrónico.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Por favor, revise su bandeja de entrada y haga clic en el enlace de verificación para activar su cuenta.
            </p>
            <p className="text-sm text-muted-foreground">
              Si no recibe el correo en unos minutos, revise su carpeta de spam o solicite un nuevo correo de
              verificación.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => setVerificacionPendiente(false)} className="mr-2">
              Volver al registro
            </Button>
            <Button
              onClick={async () => {
                try {
                  const email = document.querySelector<HTMLInputElement>('input[name="correo"]')?.value
                  if (email) {
                    await supabase.auth.resend({
                      type: "signup",
                      email,
                    })
                    toast({
                      title: "Correo reenviado",
                      description: "Se ha enviado un nuevo correo de verificación",
                    })
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "No se pudo reenviar el correo de verificación",
                    variant: "destructive",
                  })
                }
              }}
            >
              Reenviar correo
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Registro de Usuario</CardTitle>
          <CardDescription>Complete todos los campos para crear su cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="registro-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" placeholder="Ingrese su nombre" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido-paterno">Apellido Paterno</Label>
              <Input id="apellido-paterno" name="apellido-paterno" placeholder="Ingrese su apellido paterno" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido-materno">Apellido Materno</Label>
              <Input id="apellido-materno" name="apellido-materno" placeholder="Ingrese su apellido materno" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" type="tel" placeholder="Ingrese su número telefónico" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input id="correo" name="correo" type="email" placeholder="correo@ejemplo.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Documentación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Subir Documentos</DialogTitle>
                  <DialogDescription>Suba los documentos requeridos para completar su registro</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="documentos">Documentos</Label>
                    <Input id="documentos" type="file" multiple onChange={handleFileChange} />
                  </div>
                  {archivos.length > 0 && (
                    <div className="rounded-md bg-gray-50 p-4">
                      <h4 className="mb-2 text-sm font-medium">Archivos seleccionados:</h4>
                      <ul className="text-sm text-gray-500">
                        {archivos.map((archivo, index) => (
                          <li key={index}>{archivo.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => setOpen(false)}>
                    Guardar Documentos
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terminos"
                checked={aceptaTerminos}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setAceptaTerminos(checked)
                  }
                }}
              />
              <label
                htmlFor="terminos"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los{" "}
                <Link href="/terminos-y-condiciones" className="text-primary hover:underline" target="_blank">
                  términos y condiciones
                </Link>
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="registro-form" className="w-full" disabled={!aceptaTerminos || registrando}>
            {registrando ? "Procesando..." : "Registrarse"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
