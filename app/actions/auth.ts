"use server"
import crypto from "crypto"

// Simulación de base de datos para usuarios
type Usuario = {
  id: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  telefono: string
  correo: string
  password: string
  verificado: boolean
  tokenVerificacion: string
  documentos: string[]
}

// En un entorno real, esto sería una base de datos
const usuarios: Usuario[] = []

// Función para enviar correo (simulada)
async function enviarCorreoVerificacion(correo: string, token: string) {
  console.log(`Enviando correo de verificación a ${correo}`)
  console.log(`Token de verificación: ${token}`)
  console.log(`URL de verificación: http://localhost:3000/verificar?token=${token}`)

  // En un entorno real, aquí se usaría un servicio de correo como SendGrid, Mailgun, etc.
  return true
}

export async function registrarUsuario(formData: FormData) {
  try {
    // Extraer datos del formulario
    const nombre = formData.get("nombre") as string
    const apellidoPaterno = formData.get("apellido-paterno") as string
    const apellidoMaterno = formData.get("apellido-materno") as string
    const telefono = formData.get("telefono") as string
    const correo = formData.get("correo") as string
    const password = formData.get("password") as string

    // Verificar si el correo ya está registrado
    const usuarioExistente = usuarios.find((u) => u.correo === correo)
    if (usuarioExistente) {
      return { success: false, error: "El correo electrónico ya está registrado" }
    }

    // Extraer documentos (en un entorno real, se subirían a un servicio de almacenamiento)
    const documentos: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("documento-") && value instanceof File) {
        // En un entorno real, aquí se subiría el archivo y se guardaría la URL
        documentos.push(value.name)
      }
    }

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(32).toString("hex")

    // Crear nuevo usuario (en un entorno real, se encriptaría la contraseña)
    const nuevoUsuario: Usuario = {
      id: crypto.randomUUID(),
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      correo,
      password, // En un entorno real, NUNCA guardar contraseñas en texto plano
      verificado: false,
      tokenVerificacion,
      documentos,
    }

    // Guardar usuario en la "base de datos"
    usuarios.push(nuevoUsuario)

    // Enviar correo de verificación
    await enviarCorreoVerificacion(correo, tokenVerificacion)

    return { success: true }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { success: false, error: "Error al procesar el registro" }
  }
}

export async function verificarCorreo(token: string) {
  try {
    // Buscar usuario con el token de verificación
    const usuario = usuarios.find((u) => u.tokenVerificacion === token)

    if (!usuario) {
      return { success: false, error: "Token de verificación inválido" }
    }

    // Marcar usuario como verificado
    usuario.verificado = true
    usuario.tokenVerificacion = "" // Invalidar token después de usarlo

    return { success: true }
  } catch (error) {
    console.error("Error al verificar correo:", error)
    return { success: false, error: "Error al procesar la verificación" }
  }
}
