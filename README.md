# Performance Lab – Front Example

Proyecto deliberadamente cargado de malos olores de performance para usar en talleres. Está basado en React + Vite + TypeScript y cada vista encapsula un tipo de cuello de botella distinto.

## Scripts

- `pnpm install` / `npm install`: prepara dependencias.
- `npm run dev`: levanta el entorno de desarrollo con Vite.
- `npm run build`: compila para producción.

## Escenarios incluidos

1. **Home** – Hero con imagen pesada, sin optimizaciones de asset ni lazy loading (baseline para medir mejoras de carga inicial).
2. **Catalog** – Dataset en memoria de 5k productos, filtro sin memo y efecto costoso sin dependencias que recalcula en cada render.
3. **Dashboard** – Tarjeta de “chart” que recalcula arreglos grandes y reduce datos sin cacheo.
4. **Reports** – Tabla realista de órdenes con filtros encadenados, KPIs derivados y `slowCompute` para simular trabajo O(n) en cada interacción.
5. **Support** – Buzón de tickets: filtros dependientes, formulario con vista previa que invierte/parsea texto sin memo y lista que rederiva tags en caliente.
6. **Profile** – Contexto global (`CartContext`) que comparte todo el estado y dispara renders en cualquier mutación.

Cada vista busca tener material suficiente para:

- medir en Performance/React DevTools
- aplicar memoización, virtualización, splitting o separación de contextos
- crear ejercicios de profiling paso a paso

## Ideas de ejercicios

- Implementar virtual scroll en `ProductList`.
- Separar selectores del `CartContext` y usar `useMemo`/`useCallback` en rutas que leen el contexto.
- Mover los cálculos de KPIs en Reports y Support a hooks específicos con memo/cache.
- Hacer code-splitting de rutas y assets para reducir First Contentful Paint.
- Añadir tests de regresión que validen que los filtros siguen funcionando tras optimizar.

Puedes modificar o agregar flags para activar/desactivar optimizaciones dependiendo del módulo del curso. ¡Felices micro-benchmarks!
