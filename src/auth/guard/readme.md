## Acerca de

Los guardias tienen una única responsabilidad . Determinan si una solicitud determinada será manejada por el controlador de ruta o no, dependiendo de ciertas condiciones (como permisos, roles, ACL, etc.) presentes en el tiempo de ejecución. A esto se le suele denominar autorización . La autorización (y su prima, la autenticación , con la que suele colaborar) normalmente ha sido manejada por middleware en las aplicaciones Express tradicionales. El middleware es una buena opción para la autenticación, ya que cosas como la validación de tokens y adjuntar propiedades al requestobjeto no están fuertemente conectadas con un contexto de ruta particular (y sus metadatos).


> Tomado de: https://docs.nestjs.com/guards#binding-guards