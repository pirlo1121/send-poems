require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const cron = require('node-cron'); // Requiere la librería node-cron
const fs = require('fs');
const path = require('path');
const { poemas } = require('./poems.js')


// exports.module = poemas

const app = express();
const PORT = process.env.PORT || 3000;
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');


async function sendPoemEmail() {
  

  const date = new Date();
  const poemIndex = date.getDate() % poemas.length; // Se elige el poema según el día del mes


  const poemaDelDia = poemas[poemIndex];
  console.log(poemaDelDia)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });

  // HTML
  // const htmlConten7t = htmlTemplate
  // .replace('<div class="poema" id="poema-texto"></div>', `<div class="poema">${poemaDelDia.texto.split('\n').join('<br>')}</div>`)


  const htmlContent = htmlTemplate
  .replace('<div class="poema" id="poema-texto"></div>', `<div class="poema" id="poema.texto">${poemaDelDia.texto.split('\n').join('<br>')}</div>`)
  .replace('<div class="author" id="poema-autor"></div>', `<div class="author" id="poema-autor">- ${poemaDelDia.autor}</div>`);

  
  const message = {
    from: process.env.EMAIL,
    to: process.env.POEMAS_EMAIL,
    subject: 'Poema del Día',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    console.log('Poema enviado a los correos');
  } catch (error) {
    console.error('Error al enviar el poema:', error);
  }
}
// COL = 8 AM - USA 13 PM (0 13 * * *)= 8 am
// cron.schedule('0 13 * * *', async () => { 
//   try { 
//     await sendPoemEmail();
//     console.log('Poema enviado.');
//   } catch (error) {
//     console.error('Error al enviar las noticias y el poema:', error);
//   }
// });
async function name(params) {
  try { 
    await sendPoemEmail();
    console.log('Poema enviado.');
  } catch (error) {
    console.error('Error al enviar las noticias y el poema:', error);
  }
}
name();

// Ruta para confirmar que la API está funcionando
app.get('/', (req, res) => {
  res.send('El poema se enviará cada 24 horas');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
