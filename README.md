# WhatsApp Message Automation

Node.js script that uses Playwright to send a message to a list of WhatsApp Web contacts on a schedule.

Before sending, it can optionally check that:

- the contact is currently online, and
- the last message in the chat was not sent by you (to avoid sending twice in a row).

## Setup

```bash
npm install
npx playwright install chromium
cp config.example.json config.json
```

Edit `config.json` (ignored by git) with the contacts and messages:

```json
{
  "contactos": ["Contact name"],
  "mensajes": ["Main message", "?"]
}
```

## Run

```bash
node spamWhatsapp.js
```

On the first run, scan the WhatsApp Web QR code and close the window. The session is saved in `whatsapp-session/` and reused on later runs.
