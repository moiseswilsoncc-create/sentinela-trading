import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

4. Click en **"Commit changes"** → **"Commit changes"**

---

### **PASO 3: Eliminar el archivo main.jsx.txt (está mal)**

1. En GitHub, click en el archivo **"main.jsx.txt"**
2. Click en el ícono de **basura** (Delete) arriba a la derecha
3. Click en **"Commit changes"** → **"Commit changes"**

---

✅ **Después de estos 3 pasos, tu repositorio debe verse así:**
```
sentinela-trading/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
└── src/
    ├── App.jsx      ✅
    ├── main.jsx     ✅
    └── index.css    ✅
