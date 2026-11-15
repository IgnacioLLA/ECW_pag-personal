(function () {
    'use strict';

    let traducciones = null;

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

    async function aplicarIdioma(lang) {
        const datos = await cargarTraducciones();
        if (!datos || !datos[lang]) return;

        const textos = datos[lang];

        document.documentElement.lang = lang;

        const pagina = document.body.getAttribute('data-pagina');
        if (pagina && textos[pagina + '_title']) {
            document.title = textos[pagina + '_title'];
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (pagina && metaDesc && textos[pagina + '_meta_desc']) {
            metaDesc.setAttribute('content', textos[pagina + '_meta_desc']);
        }

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

        document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-alt');
            if (textos[clave] !== undefined) {
                el.alt = textos[clave];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-placeholder');
            if (textos[clave] !== undefined) {
                el.placeholder = textos[clave];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-aria');
            if (textos[clave] !== undefined) {
                el.setAttribute('aria-label', textos[clave]);
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const clave = el.getAttribute('data-i18n-title');
            if (textos[clave] !== undefined) {
                el.setAttribute('title', textos[clave]);
            }
        });

        const selector = document.getElementById('selector-idioma');
        if (selector && selector.value !== lang) {
            selector.value = lang;
        }

        try {
            localStorage.setItem('idioma_preferido', lang);
        } catch (e) {}

        try {
            window.dispatchEvent(new CustomEvent('idiomaCambiado', { detail: { lang: lang } }));
        } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
        const selector = document.getElementById('selector-idioma');
        const formIdioma = document.querySelector('header form[data-i18n-aria="aria_selector_idioma"]') ||
                           document.querySelector('header form[aria-label="Selector de idioma"]') ||
                           (selector ? selector.closest('form') : null);

        if (formIdioma) {
            formIdioma.addEventListener('submit', (e) => {
                e.preventDefault();
                if (selector) {
                    aplicarIdioma(selector.value);
                }
            });
        }

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

        if (idiomaInicial === 'en') {
            aplicarIdioma('en');
        }
    });
})();
