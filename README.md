Este es un script con Playwright para automatizar el envio de un mensaje a una lista de contactos.
Tiene verificaciones opcionales de que el contacto esté en linea, y/o que el ultimo mensaje haya sido enviado por mi.

## Uso
1. Copiar `config.example.json` a `config.json` y completar los contactos y mensajes (`config.json` está en `.gitignore`).
2. Ejecutar `node spamWhatsapp.js`, iniciar sesión en WhatsApp Web, cerrar la ventana y volver a ejecutarlo para que use la sesión guardada.
