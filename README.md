# La Copita Común web

Sitio informativo estático para explicar el proyecto y dirigir a las personas a los canales de consulta existentes. El primer alcance no incorpora carrito, pagos, inventario ni cuentas de usuario.

## Vista local

Desde esta carpeta, inicia un servidor estático:

    py -m http.server 4173 --directory site

Abre http://localhost:4173.

## Publicación con GitHub Pages

El workflow .github/workflows/pages.yml publica únicamente site/ cuando hay cambios en la rama main o cuando se ejecuta manualmente. En el repositorio de GitHub:

1. Abre Settings → Pages.
2. En Build and deployment, selecciona GitHub Actions.
3. Sube esta carpeta a un repositorio y publica la rama main.
4. Revisa el resultado en Actions y confirma la URL que reporta el despliegue.

El sitio usa rutas relativas (./assets/...) para funcionar tanto en un dominio propio como en la URL de proyecto de GitHub Pages.

## Contenido y activos

Las imágenes locales, animaciones GIF y documentos históricos se derivan de los materiales de Behance y WhatsApp compartidos para este proyecto; el sitio también integra videos de YouTube del proyecto. Antes de publicar, confirmar autorías y permisos de reproducción, vigencia de los canales, disponibilidad de productos y toda afirmación económica o de salud. El archivo docs/content-validation.md reúne los pendientes conocidos.

## Estructura

- site/index.html: contenido, estructura y enlaces.
- site/styles.css: sistema visual y diseño adaptable.
- site/script.js: navegación móvil y control de sonido del video.
- site/assets/: imágenes y marca en formato local.
- .github/workflows/pages.yml: publicación estática con GitHub Pages.
