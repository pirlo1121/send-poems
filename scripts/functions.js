import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { poemas } from './poems.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlTemplatePath = path.join(__dirname, '../index.html');

if (!fs.existsSync(htmlTemplatePath)) {
  console.error(`Error: El archivo ${htmlTemplatePath} no existe.`);
  process.exit(1);
}

const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

function generateHtmlContent(template, poema) {
  return template
    .replace('<div class="poema" id="poema-texto"></div>', `<div class="poema" id="poema-texto">${poema.texto.split('\n').join('<br>')}</div>`)
    .replace('<div class="author" id="poema-autor"></div>', `<div class="author" id="poema-autor">- ${poema.autor}</div>`);
}

export async function sendPoemEmail() {
  // Validar variables de entorno necesarias
  if (!process.env.EMAIL || !process.env.PASSWORD || !process.env.POEMAS_EMAIL) {
    console.error('Error: Las variables de entorno EMAIL, PASSWORD o POEMAS_EMAIL no están definidas.');
    process.exit(1);
  }

  const date = new Date();
  const poemIndex = date.getDate() % poemas.length; // Se elige el poema según el día del mes
  const poemaDelDia = poemas[poemIndex];

  console.log('Enviando poema del día:', poemaDelDia);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const htmlContent = generateHtmlContent(htmlTemplate, poemaDelDia);

  const message = {
    from: process.env.EMAIL,
    to: process.env.POEMAS_EMAIL,
    subject: 'Poema del Día',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    console.log('Poema enviado a los correos exitosamente.');
  } catch (error) {
    console.error('Error al enviar el poema:', error.message);
  }
}
