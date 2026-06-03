# Hackathon Adaptate CDMX 2026 — Landing Page

Landing page interactiva para promocionar un evento digital ficticio.

## URLs

- **Frontend:** https://prueba-lovat-psi.vercel.app/
- **Ver registros en BD:** https://prueba-production-5619.up.railway.app/api/registros

##  Stack

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Node.js + Express
- **Base de datos:** MySQL (Railway)
- **Hosting frontend:** Vercel
- **Hosting backend:** Railway

##  Funcionalidades

- Animación de entrada en sección Hero
- Temporizador de 5 minutos para registro
- Scroll reveal en tarjetas de información
- Galería con carrusel de imágenes
- Formulario con validaciones frontend y backend
- Datos guardados en MySQL
- Endpoint público para verificar registros

##  Arquitectura

Frontend (Vercel)
└── fetch POST /api/registro
│
▼
Backend Node.js (Railway)
└── MySQL (Railway)

##  Estructura del proyecto
/
├── index.html
├── style.css
├── main.js
├── src/              ← imágenes del carrusel
└── backend/
├── server.js     ← Express + endpoints
├── db.js         ← conexión MySQL
└── package.json

## ⚙️ Correr localmente


cd backend
npm install
# Crear .env con credenciales MySQL
node server.js
