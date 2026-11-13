// i18n.js - Sistema nativo y estándar de internacionalización con translations.json
(function () {
    'use strict';

    let traducciones = null;

    /**
     * Carga el diccionario de traducciones desde translations.json.
     * Si se ejecuta localmente bajo protocolo file:// (donde fetch falla por CORS),
     * utiliza automáticamente el objeto fallback TRADUCCIONES_DATOS si está disponible.
     */
    async function cargarTraducciones() {
        if (traducciones) return traducciones;
        try {
            const respuesta = await fetch('translations.json');
            if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
            traducciones = await respuesta.json();
            return traducciones;
        } catch (error) {
            if (typeof TRADUCCIONES_DATOS !== 'undefined') {
                traducciones = TRADUCCIONES_DATOS;
                return traducciones;
            }
            console.warn('No se pudo cargar translations.json vía fetch ni fallback:', error);
            return null;
        }
    }

    /**
     * Aplica el idioma especificado ('es' o 'en') actualizando el DOM de forma semántica y nativa.
     * @param {string} lang 
     */
    async function aplicarIdioma(lang) {
        const datos = await cargarTraducciones();
        if (!datos || !datos[lang]) return;

        const textos = datos[lang];

        // 1. Estándar W3C: Actualizar el atributo lang del elemento raíz <html>
        document.documentElement.lang = lang;

        // 2. Título del documento y meta descripción según la página actual
        const pagina = document.body.getAttribute('data-pagina');
        if (pagina && textos[pagina + '_title']) {
            document.title = textos[pagina + '_title'];
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (pagina && metaDesc && textos[pagina + '_meta_desc']) {
            metaDesc.setAttribute('content', textos[pagina + '_meta_desc']);
        }

        // 3. Traducir contenido de elementos con atributo nativo data-i18n
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const clave = el.getAttribute('data-i18n');
            if (textos[clave] !== undefined) {
                const val = textos[clave];
                if (val.includes('<')) {
                    el.innerHTML = val;
                } else {
                    el.textContent = val;
                }
            }
        });

        // 4. Traducir atributos de imágenes (alt)
        document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-alt');
            if (textos[clave] !== undefined) {
                el.alt = textos[clave];
            }
        });

        // 4b. Traducir atributos placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-placeholder');
            if (textos[clave] !== undefined) {
                el.placeholder = textos[clave];
            }
        });

        // 5. Sincronizar el valor del selector nativo
        const selector = document.getElementById('selector-idioma');
        if (selector && selector.value !== lang) {
            selector.value = lang;
        }

        // 6. Guardar la preferencia en localStorage para persistencia entre páginas
        try {
            localStorage.setItem('idioma_preferido', lang);
        } catch (e) {
            // Manejo silencioso en caso de navegación privada restrictiva
        }

        // 7. Notificar a otros módulos (como el buscador) del cambio de idioma
        try {
            window.dispatchEvent(new CustomEvent('idiomaCambiado', { detail: { lang: lang } }));
        } catch (e) {}
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        const selector = document.getElementById('selector-idioma');
        const formIdioma = document.querySelector('header form[aria-label="Selector de idioma"]');

        // Evitar recarga accidental si se pulsa Enter en el formulario del selector
        if (formIdioma) {
            formIdioma.addEventListener('submit', (e) => e.preventDefault());
        }

        // Determinar idioma inicial: preferencia guardada > preferencia del navegador > español
        let idiomaInicial = 'es';
        try {
            const guardado = localStorage.getItem('idioma_preferido');
            if (guardado === 'es' || guardado === 'en') {
                idiomaInicial = guardado;
            } else if (navigator.language && navigator.language.toLowerCase().startsWith('en')) {
                idiomaInicial = 'en';
            }
        } catch (e) {
            idiomaInicial = 'es';
        }

        if (selector) {
            selector.value = idiomaInicial;
            selector.addEventListener('change', (e) => {
                aplicarIdioma(e.target.value);
            });
        }

        // Si el idioma inicial es inglés, aplicarlo
        if (idiomaInicial === 'en') {
            aplicarIdioma('en');
        }
    });
})();
