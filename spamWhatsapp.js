const { chromium } = require('playwright');
const robot = require('robotjs');

(async () => {
  const context = await chromium.launchPersistentContext('./whatsapp-session', {
    headless: false,
  });

  // Contactos y mensajes se leen de config.json (ignorado por git). Ver config.example.json
  const { contactos, mensajes } = require('./config.json');
  
  const screenSize = robot.getScreenSize();
  const screenWidth = screenSize.width;
  const screenHeight = screenSize.height;

  const page = await context.newPage();
  await page.goto('https://web.whatsapp.com');
 
  while(true) {   // Sacar este while para que no se repita infinitamente

    for (const contacto of contactos) {

      await page.locator('[aria-label="Cuadro de texto para ingresar la búsqueda"]').click();

      await page.keyboard.press('Control+A'); // (Cmd+A en Mac)

      await page.keyboard.press('Backspace'); 

      await page.keyboard.type(contacto);

      await page.waitForSelector('div[aria-label="Resultados de la búsqueda."] [role="listitem"]');

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const elementoContacto = await page.locator('div[aria-label="Resultados de la búsqueda."] [role="listitem"]').nth(1);
      const tilde = elementoContacto.locator('div.x78zum5.x1okw0bk.x1ozewix.x16dsc37.x1xp8n7a.xl56j7k.xfs2ol5');
      const esVisible = await tilde.isVisible();

      let mousePosInicial;

      if (esVisible) { // Verificar si el ultimo mensaje en el chat es mio, poner true como condicion del if para desactivar esta opcion

        await elementoContacto.click();

        while (true) {

          try {

            console.log('Volviendo a intentar');

            mousePosInicial = robot.getMousePos();

            console.log('Posición inicial del mouse:', mousePosInicial);

            const header = await page.waitForSelector('#main > header > div.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli');

            await header.waitForSelector('div.x78zum5.x1cy8zhl.xisnujt.x1nxh6w3.xcgms0a.x16cd2qt > span[title="en línea"]', { timeout: 9.5 * 60 * 1000 });

            break;

          } catch (err) {
           
            const mousePosActual = robot.getMousePos();

            console.log('Posición actual del mouse:', mousePosActual);

            if (mousePosActual.x === mousePosInicial.x && mousePosActual.y === mousePosInicial.y) {

              const nuevaX = Math.floor(Math.random() * (screenWidth - 50));
              
              const nuevaY = Math.floor(Math.random() * (screenHeight - 50)); 

              robot.moveMouse(nuevaX, nuevaY);

              console.log('Posición del mouse luego de mover:', robot.getMousePos());
            }

            await page.locator('[aria-label="Cuadro de texto para ingresar la búsqueda"]').click();

            await page.waitForTimeout(3000);

            await page.locator('div[contenteditable="true"][aria-label="Escribe un mensaje"]').click();
          }
        }

        await page.waitForTimeout(1000);

        await page.locator('div[contenteditable="true"][aria-label="Escribe un mensaje"]').click();

        await page.keyboard.press('Control+A'); // (Cmd+A en Mac)

        await page.keyboard.press('Backspace'); 

        const usarMensajeLargo = Math.random() < 0.75;

        let mensaje;

        if (usarMensajeLargo) {
          mensaje = mensajes[0];
        } else {
          mensaje = mensajes[1].repeat(Math.floor(Math.random() * 25) + 1);
        }

        await page.keyboard.type(mensaje);

        await page.keyboard.press('Enter');

        await page.waitForTimeout(1000);

        console.log(`Mensaje enviado a ${contacto}`);
      }

    }

    await page.waitForTimeout(60*60*1000);

  }

})();

//  para ejecutar: copiar config.example.json a config.json, completarlo y correr: node spamWhatsapp.js
//  ejecutar una vez e iniciar sesion en whatsapp, luego cerrar la ventana y volver a ejecutar el script para que use la sesion guardada