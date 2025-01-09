import 'dotenv/config';
import express from 'express';
// import puppeteer from 'puppeteer';
import cron from 'node-cron';
import { sendPoemEmail } from './functions.js';

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.EMAIL || !process.env.PASSWORD) {
  console.error('Error: Las variables de entorno EMAIL y PASSWORD no están definidas.');
  process.exit(1);
}

// COL = 8 AM - USA 13 PM (0 13 * * *)= 8 am
cron.schedule('0 13 * * *', async () => { 
  try { 
    await sendPoemEmail();
    console.log('Poema enviado.');
  } catch (error) {
    console.error('Error al enviar el poema:', error);
  }
});

async function name() {
  try { 
    await sendPoemEmail();
    console.log('Poema enviado.');
  } catch (error) {
    console.error('Error al enviar las noticias y el poema:', error);
  }
}
name();

app.get('/', (req, res) => {
  res.send('El poema se enviará cada 24 horas');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
