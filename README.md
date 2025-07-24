# 🍹 Buscador de Bebidas - Modernizado

Una aplicación moderna de React para buscar recetas de cócteles y bebidas, completamente refactorizada con las tecnologías más actuales.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático
- **Material-UI v6** - Componentes de interfaz modernos
- **Emotion** - Biblioteca de estilos CSS-in-JS

### Herramientas de Desarrollo
- **Vite 6** - Herramienta de construcción ultrarrápida
- **ESLint 9** - Linter de código con configuración moderna
- **Vitest** - Framework de testing
- **pnpm** - Gestor de paquetes rápido

### Gestión de Estado
- **React Context API** - Estado global de la aplicación
- **Custom Hooks** - Hooks personalizados para acceso a contextos

## 📦 Instalación

### Prerrequisitos
- Node.js 20+ (gestionado con Volta)
- pnpm 9+ (gestionado con Volta)

### Comandos
```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Ejecutar linter
pnpm lint

# Verificar tipos de TypeScript
pnpm type-check

# Ejecutar tests
pnpm test
```

## 🏗️ Arquitectura

### Estructura de Carpetas
```
src/
├── components/          # Componentes de React
│   ├── Header.tsx      # Cabecera de la aplicación
│   ├── Formulario.tsx  # Formulario de búsqueda
│   ├── ListaRecetas.tsx# Lista de resultados
│   └── Receta.tsx      # Componente individual de receta
├── context/            # Contextos de React
│   ├── CategoriasContext.tsx
│   ├── RecetasContext.tsx
│   └── ModalContext.tsx
├── hooks/              # Hooks personalizados
│   └── useContexts.ts  # Hooks para acceso a contextos
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts        # Tipos globales
└── main.tsx           # Punto de entrada de la aplicación
```

### Patrones Implementados
- **Context + Custom Hooks**: Para gestión de estado global
- **TypeScript Estricto**: Sin tipos `any`, tipado completo
- **Component Composition**: Componentes reutilizables y modulares
- **Error Boundaries**: Manejo robusto de errores
- **Responsive Design**: Diseño adaptativo con Material-UI

## 🎨 Características

### Funcionalidades
- ✅ Búsqueda de bebidas por ingrediente
- ✅ Filtrado por categorías
- ✅ Visualización de recetas completas en modal
- ✅ Diseño responsive y moderno
- ✅ Manejo de errores y estados de carga
- ✅ Tipado completo con TypeScript

### Mejoras Implementadas
- 🔄 Migración de Create React App a Vite
- 📦 Actualización a React 18
- 🎯 TypeScript con configuración estricta
- 🎨 Migración de Material-UI v4 a v6
- 🚀 Configuración moderna de ESLint
- 🧪 Setup de testing con Vitest
- 📱 Diseño mejorado y responsive

## 🔧 Configuración de Desarrollo

### Volta.sh
Las versiones de Node.js y pnpm están fijadas usando Volta:
```json
{
  "volta": {
    "node": "20.19.4",
    "pnpm": "9.15.9"
  }
}
```

### TypeScript
Configuración estricta que evita el uso de `any`:
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`

### ESLint
Configuración moderna con:
- Detección de errores de TypeScript
- Reglas de React Hooks
- Configuración de React Refresh

## 🌐 API

La aplicación consume la API pública de [TheCocktailDB](https://www.thecocktaildb.com/):
- Endpoint de categorías: `/api/json/v1/1/list.php?c=list`
- Endpoint de búsqueda: `/api/json/v1/1/filter.php?i={ingrediente}&c={categoria}`
- Endpoint de detalles: `/api/json/v1/1/lookup.php?i={id}`

## 🎯 Scripts Disponibles

- `pnpm dev` - Ejecuta la aplicación en modo desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm preview` - Previsualiza la construcción de producción
- `pnpm lint` - Ejecuta el linter de código
- `pnpm type-check` - Verifica los tipos de TypeScript
- `pnpm test` - Ejecuta las pruebas unitarias

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Refactorizado completamente en 2025** - De Create React App a Vite + TypeScript + Material-UI v6
