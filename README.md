# 📘 README — Angular Template-Driven Forms & Debug de Directivas

Guía práctica, concisa y bonita para:
1) Dominar `ngModelOptions` en formularios **template-driven** (Angular v20).
2) Depurar directivas con `window.ng.getDirectives($0)` desde la consola del navegador.

> **Requisitos**
> - Angular 16+ (recomendado 20)
> - `FormsModule` importado en el componente donde uses `[(ngModel)]`

---

## 🧭 Parte 1 · `ngModelOptions` en Angular (v20)

`ngModelOptions` es un **objeto de configuración** que le dice a `ngModel`:
- **`name`**: cómo se llama el control en el formulario.
- **`updateOn`**: cuándo se actualizan valor y validación.
- **`standalone`**: si el control pertenece o no al formulario padre.

### ✅ Uso básico

```html
<input
  [(ngModel)]="user.firstName"
  [ngModelOptions]="{ name: 'first-name', updateOn: 'change', standalone: false }"
/>
⚙️ Propiedades
Propiedad	Tipo / Valores	Por defecto	¿Qué hace?
name	string	—	Clave del control dentro del ngForm / ngModelGroup. Obligatorio si no es standalone.
updateOn	'change' | 'blur' | 'submit'	'change'	Define cuándo se actualiza el valor/validación.
standalone	boolean	false	Si true, el control no se registra en el formulario padre.

Notas clave

Con standalone: false (por defecto), si usas [(ngModel)] dentro de un <form>, debes proporcionar name (o verás un warning).

Con standalone: true, name se ignora.

Con updateOn: 'submit', recuerda tener (ngSubmit) en el <form>.

🧪 Ejemplos rápidos

Validación inmediata (por cambio)


🧪 Parte 2 · Depurar directivas con window.ng.getDirectives($0)

Herramienta de debug para inspeccionar directivas en tiempo de ejecución desde la consola del navegador.

TL;DR
Selecciona un nodo en Elements → abre Console → ejecuta:
ng.getDirectives($0) → verás instancias de directivas aplicadas a ese elemento.

💡 ¿Qué es $0?

$0 es la referencia del último elemento DOM seleccionado en la pestaña Elements de DevTools (Chrome/Edge/Firefox).

🚀 Pasos

Inicia la app en modo desarrollo:
🚀 Pasos

Inicia la app en modo desarrollo:

ng serve


Abre DevTools → Elements → selecciona un nodo (será $0).

En Console ejecuta:

ng.getDirectives($0)


Nota: window.ng suele estar disponible solo en desarrollo.

🔍 Snippets útiles

Listar nombres de directivas

ng.getDirectives($0).map(d => d.constructor.name)


Obtener una directiva por nombre

const ngIf = ng.getDirectives($0).find(d => d.constructor.name === 'NgIf');
ngIf?.ngIf; // condición actual


Inspeccionar NgModel

const ngModel = ng.getDirectives($0).find(d => d.constructor?.name === 'NgModel');

ngModel?.name;            // nombre del control
ngModel?.value;           // valor actual
ngModel?.control.status;  // 'VALID' | 'INVALID' | etc.
ngModel?.control.errors;  // errores de validación

// Cambiar valor desde consola (dispara validación y CD)
ngModel?.control.setValue('Nuevo valor');


Ver listeners asociados

ng.getListeners($0) // eventos DOM/host registrados (click, input, etc.)


Obtener el componente del elemento

const cmp = ng.getComponent($0);
cmp // instancia del componente


Recorrer todas las directivas

ng.getDirectives($0).forEach(d => {
  console.log(d.constructor.name, d);
});

🧠 Casos típicos

Formularios template-driven: inspecciona estados/errores vía NgModel.control.

Directivas estructurales (*ngIf, *ngFor): a veces el host es un comentario o un nodo contenedor. Selecciona el nodo correcto para que aparezca en getDirectives.

Elementos con múltiples directivas: validadores (RequiredValidator, MinLengthValidator) + NgModel + directivas propias.

🧯 Solución de problemas

ng is not defined → Estás en producción o no es una app Angular. Ejecuta en dev (ng serve).

Devuelve [] → El elemento no tiene directivas o no pertenece a una vista Angular. Prueba con otro nodo (padre/hijo).

No veo NgIf → Selecciona el host real (a veces un comentario) o un nodo hijo dentro del bloque.

⚠️ Buenas prácticas

Úsalo solo en desarrollo.

Evita cambios destructivos desde consola si no conoces el impacto.

Documenta lo que inspeccionas/modificas para reproducibilidad.

🧾 Chuleta final

ngModelOptions

name: clave del control (requerido si no es standalone).

updateOn: 'change' | 'blur' | 'submit'.

standalone: true para no registrar el control en el formulario.

Consola window.ng

ng.getDirectives($0) → instancias de directivas en el elemento.

ng.getComponent($0) → instancia del componente del elemento.

ng.getListeners($0) → listeners DOM/host.

ng.getInjector($0) → inyector asociado (avanzado).
