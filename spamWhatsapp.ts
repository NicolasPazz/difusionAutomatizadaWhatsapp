const { chromium } = require('playwright');

(async () => {
  const context = await chromium.launchPersistentContext('./whatsapp-session', {
    headless: false,
  });

  const contactos = [""];
  const mensaje = "?";

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

      if (esVisible) { // Verificar si el ultimo mensaje en el chat es mio, poner true como condicion del if para desactivar esta opcion

        await elementoContacto.click();

        // Esperar que el contacto esté en linea, comentar para desactivar esta opcion
        const header = await page.waitForSelector('#main > header > div.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli');
        const enLineaSpan = await header.waitForSelector('div.x78zum5.x1cy8zhl.xisnujt.x1nxh6w3.xcgms0a.x16cd2qt > span[title="en línea"]', { timeout: 0 });
        // Esperar que el contacto esté en linea, comentar para desactivar esta opcion

        await page.locator('div[contenteditable="true"][aria-label="Escribe un mensaje"]').click();

        await page.keyboard.press('Control+A'); // (Cmd+A en Mac)

        await page.keyboard.press('Backspace'); 

        await page.keyboard.type(mensaje);

        await page.keyboard.press('Enter');

        await page.waitForTimeout(2000);

        console.log(`Mensaje enviado a ${contacto}`);
      }

    }

    await page.waitForTimeout(5*60*1000);

  }

})();

//  para ejecutar: node --loader ts-node/esm spamWhatsapp.ts
//  ejecutar una vez e iniciar sesion en whatsapp, luego cerrar la ventana y volver a ejecutar el script para que use la sesion guardada