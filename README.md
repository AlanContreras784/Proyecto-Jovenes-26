# 🙌 Proyecto Jóvenes 26

Sistema de Gestión de Evangelismo desarrollado con React y Firebase. Esta aplicación permite registrar, visualizar y administrar campañas de evangelismo, incluyendo la gestión de personas contactadas, pedidos de oración y exportación de registros en formato PDF.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React JS** – Framework principal para la interfaz.
- 🔥 **Firebase** – Autenticación, Firestore y Storage.
- 📦 **Vite** – Bundler para desarrollo rápido.
- 📄 **jsPDF** – Generación de archivos PDF desde los datos.
- 💅 **Bootstrap** – Estilos y componentes UI.
- 🧪 **SweetAlert2** – Modales y alertas amigables.

---

## 🧩 Funcionalidades principales

- ✅ Autenticación de usuarios (Firebase Auth)
- ✅ Registro y gestión de eventos de evangelismo
- ✅ Registro de personas por cada evento
- ✅ Subcolecciones para estructurar mejor los datos
- ✅ Exportación a PDF personalizada de los registros
- ✅ Validaciones y alertas interactivas
- ✅ Interfaz moderna y responsive

---

## 📁 Estructura del proyecto

```
src/
│
├── auth/                  # Lógica de autenticación
├── components/            # Componentes reutilizables
├── firebase/              # Configuración de Firebase
├── pages/                 # Vistas principales (CRUDs, login, home)
├── utils/                 # Funciones auxiliares (PDF, fecha, etc.)
├── App.jsx                # Enrutamiento principal
├── main.jsx               # Punto de entrada
└── index.css              # Estilos generales
```

---

## 🛠️ Instalación y ejecución local

1. Clona este repositorio:

```bash
git clone https://github.com/AlanContreras784/Proyecto-Jovenes-26
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:

```env
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

---

## 🧪 Scripts disponibles

- `npm run dev` – Inicia el servidor en desarrollo
- `npm run build` – Compila el proyecto para producción
- `npm run preview` – Vista previa del build

---

## 📦 Deploy

Este proyecto está listo para ser desplegado en **Firebase Hosting** o **Vercel**. Para Firebase:

```bash
firebase login
firebase init
firebase deploy
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente.

---

## 👤 Autor

Desarrollado por **Alan Contreras Flores**  
🔗 [GitHub](https://github.com/AlanContreras784)

---

## 💡 Notas

- Se recomienda usar Google Chrome para una mejor experiencia.
- Para cualquier sugerencia o mejora, ¡abrí un issue o pull request!