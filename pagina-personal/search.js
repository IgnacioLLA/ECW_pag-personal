// search.js - Motor de búsqueda contextual sobre los textos reales del sitio (translations.json / translations.js)
(function () {
    'use strict';

    // Catálogo de entidades de contenido del sitio mapeadas a sus páginas, anclas y claves de traducción
    const ENTIDADES = [
        {
            id: 'index_sobre_mi',
            url: 'index.html#sobre-mi',
            navKey: 'nav_inicio',
            tituloKey: 'index_sobre_mi_h3',
            claves: ['index_info_personal_h2', 'index_sobre_mi_h3', 'index_sobre_mi_p1', 'index_sobre_mi_p2'],
            keywords: ['Nacho', 'Ignacio Llaneza Aller', 'Universidad de Oviedo', 'Ingeniería Informática', 'Máster']
        },
        {
            id: 'profile_quien_soy',
            url: 'profile.html#quien-soy',
            navKey: 'nav_perfil',
            tituloKey: 'profile_quien_soy_h3',
            claves: ['profile_foto_alt', 'profile_foto_cap', 'profile_quien_soy_h3', 'profile_quien_soy_p'],
            keywords: ['Nacho', '22 años', 'Ingeniería Informática', 'Universidad de Oviedo', 'Máster', 'Estándares y Computación Web']
        },
        {
            id: 'profile_intereses',
            url: 'profile.html#intereses',
            navKey: 'nav_perfil',
            tituloKey: 'profile_intereses_h3',
            claves: ['profile_intereses_h3', 'profile_intereses_p'],
            keywords: ['animales', 'gatas', 'Hestia', 'Xana', 'perro', 'Seiba', 'música', 'videojuegos', 'libros', 'balonmano', 'guitarra', 'cartas', 'mesa']
        },
        {
            id: 'profile_exp',
            url: 'profile.html#experiencia',
            navKey: 'nav_perfil',
            tituloKey: 'profile_exp_h3',
            claves: ['profile_exp_h3', 'profile_exp_p'],
            keywords: ['TRAGSATEC', 'prácticas', '2 meses', 'full-stack', 'Spring Boot', 'React', 'TFG', 'TFE', 'MatchTFE', 'Trabajo de Fin de Grado', 'GitHub']
        },
        {
            id: 'profile_ref',
            url: 'profile.html#referencias-avales',
            navKey: 'nav_perfil',
            tituloKey: 'profile_ref_h3',
            claves: ['profile_ref_h3', 'profile_ref_p', 'profile_tutor1_rel', 'profile_tutor2_rel'],
            keywords: ['TFG', 'tutores', 'cotutor', 'Trabajo de Fin de Grado', 'Miguel García Rodríguez', 'Luis Antonio Vinuesa Martínez', 'Universidad de Oviedo']
        },
        {
            id: 'audio_epic',
            url: 'audio.html#epic',
            navKey: 'nav_musica',
            tituloKey: 'audio_epic_cancion_h4',
            tituloDirecto: 'EPIC: The Musical',
            claves: ['audio_epic_fig', 'audio_epic_p', 'audio_epic_cancion_h4', 'audio_epic_cancion_p', 'audio_epic_desc_p', 'audio_epic_alt'],
            keywords: ['EPIC', 'The Musical', 'Jorge Rivera-Herranz', 'Odisea', 'Odyssey', 'Troya', 'Ítaca', 'Ithaca', 'Odiseo', 'Odysseus', 'The Horse and the Infant']
        },
        {
            id: 'audio_saurom',
            url: 'audio.html#saurom',
            navKey: 'nav_musica',
            tituloKey: 'audio_saurom_cancion_h4',
            tituloDirecto: 'Saurom',
            claves: ['audio_saurom_fig', 'audio_saurom_p', 'audio_saurom_cancion_h4', 'audio_saurom_cancion_p', 'audio_saurom_desc_p', 'audio_saurom_alt'],
            keywords: ['Saurom', 'Folk Metal', 'Juglar metal', 'Tolkien', 'Lazarillo de Tormes', 'Cádiz', 'España']
        },
        {
            id: 'audio_hadadanza',
            url: 'audio.html#hadadanza',
            navKey: 'nav_musica',
            tituloKey: 'audio_hadadanza_cancion_h4',
            tituloDirecto: 'Hadadanza',
            claves: ['audio_hadadanza_fig', 'audio_hadadanza_p', 'audio_hadadanza_cancion_h4', 'audio_hadadanza_cancion_p', 'audio_hadadanza_desc_p', 'audio_hadadanza_alt'],
            keywords: ['Hadadanza', 'Folk Metal', 'Tolkien', 'El Circo de los muertos', 'Mia', 'Luis Posada', 'La contorsionista']
        },
        {
            id: 'multi_majoras',
            url: 'multimedia.html#majoras',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_majoras_h4',
            claves: ['multi_majoras_fig', 'multi_majoras_p', 'multi_majoras_h4', 'multi_majoras_alt'],
            keywords: ['Zelda', 'Majoras Mask', 'Majora', 'Termina', 'Nintendo', '3DS', 'máscaras', 'masks']
        },
        {
            id: 'multi_ds3',
            url: 'multimedia.html#dark-souls',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_ds3_h4',
            claves: ['multi_ds3_p', 'multi_ds3_fig', 'multi_ds3_desc', 'multi_ds3_h4'],
            keywords: ['Dark Souls', 'Dark Souls III', 'Souls', 'FromSoftware', 'Miyazaki', 'gameplay', 'combate']
        },
        {
            id: 'multi_forhonor',
            url: 'multimedia.html#for-honor',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_forhonor_h4',
            claves: ['multi_forhonor_fig', 'multi_forhonor_p', 'multi_forhonor_h4', 'multi_forhonor_alt'],
            keywords: ['For Honor', 'Ubisoft', 'Caballeros', 'Knights', 'Vikingos', 'Vikings', 'Samuráis', 'Samurai']
        },
        {
            id: 'multi_piratas',
            url: 'multimedia.html#piratas-caribe',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_piratas_h4',
            claves: ['multi_piratas_p', 'multi_piratas_fig', 'multi_piratas_desc', 'multi_piratas_h4'],
            keywords: ['Piratas del Caribe', 'Pirates of the Caribbean', 'Capitán Jack Sparrow', 'Captain Jack Sparrow', 'Hans Zimmer', 'banda sonora', 'soundtrack']
        },
        {
            id: 'multi_castle',
            url: 'multimedia.html#castle',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_castle_h4',
            claves: ['multi_castle_fig', 'multi_castle_p', 'multi_castle_h4', 'multi_castle_alt'],
            keywords: ['Castle', 'Richard Castle', 'Kate Beckett', 'policíaca', 'detective', 'serie']
        },
        {
            id: 'multi_house',
            url: 'multimedia.html#dr-house',
            navKey: 'nav_multimedia',
            tituloKey: 'multi_house_h4',
            claves: ['multi_house_fig', 'multi_house_p', 'multi_house_h4', 'multi_house_alt'],
            keywords: ['House', 'Dr. House', 'House M.D.', 'Gregory House', 'médica', 'medical', 'diagnóstico']
        },
        {
            id: 'libros_jura',
            url: 'books.html#juramentada',
            navKey: 'nav_libros',
            tituloKey: 'libros_jura_h3',
            claves: ['libros_jura_fig', 'libros_jura_p1', 'libros_sanderson_fig', 'libros_sanderson_p', 'libros_jura_h3', 'libros_jura_alt', 'libros_sanderson_alt'],
            keywords: ['Juramentada', 'Oathbringer', 'Brandon Sanderson', 'Sanderson', 'El Archivo de las Tormentas', 'The Stormlight Archive', 'Cosmere', 'Roshar', 'Dalinar', 'Sanderlancha', 'Sanderlanche', 'El camino de los reyes', 'The Way of Kings']
        },
        {
            id: 'libros_viento',
            url: 'books.html#nombre-viento',
            navKey: 'nav_libros',
            tituloKey: 'libros_viento_h3',
            claves: ['libros_viento_fig', 'libros_viento_p1', 'libros_rothfuss_fig', 'libros_rothfuss_p', 'libros_viento_p2', 'libros_viento_h3', 'libros_viento_alt', 'libros_rothfuss_alt'],
            keywords: ['El Nombre del Viento', 'The Name of the Wind', 'Patrick Rothfuss', 'Rothfuss', 'Kvothe', 'Crónica del Asesino de Reyes', 'The Kingkiller Chronicle', 'Universidad', 'Raúl Llorens', 'audiolibro', 'audiobook']
        },
        {
            id: 'libros_espada',
            url: 'books.html#espada-destino',
            navKey: 'nav_libros',
            tituloKey: 'libros_espada_h3',
            claves: ['libros_espada_fig', 'libros_espada_p1', 'libros_sapkowski_fig', 'libros_sapkowski_p', 'libros_espada_h3', 'libros_espada_alt', 'libros_sapkowski_alt'],
            keywords: ['La Espada del Destino', 'Sword of Destiny', 'Andrzej Sapkowski', 'Sapkowski', 'Geralt de Rivia', 'Geralt of Rivia', 'The Witcher', 'Yennefer', 'Ciri', 'brujo', 'witcher', 'mal menor']
        },
        {
            id: 'libros_eisenhorn',
            url: 'books.html#eisenhorn',
            navKey: 'nav_libros',
            tituloKey: 'libros_eisenhorn_h3',
            claves: ['libros_eisenhorn_fig', 'libros_eisenhorn_p1', 'libros_abnett_fig', 'libros_abnett_p', 'libros_eisenhorn_h3', 'libros_eisenhorn_alt', 'libros_abnett_alt'],
            keywords: ['El Ómnibus de Eisenhorn', 'The Eisenhorn Omnibus', 'Eisenhorn', 'Dan Abnett', 'Abnett', 'Warhammer 40K', 'Inquisidor', 'Inquisitor', 'Gregor Eisenhorn', 'Ordo Xenos', 'Imperio', 'Imperium']
        },
        {
            id: 'ayuda_guia',
            url: 'ayuda.html#guia-secciones',
            navKey: 'footer_ayuda',
            tituloKey: 'ayuda_h2_guia',
            claves: ['ayuda_h2_guia', 'ayuda_p_intro', 'ayuda_inicio_p', 'ayuda_perfil_p', 'ayuda_musica_p', 'ayuda_multi_p', 'ayuda_libros_p', 'ayuda_buscador_p'],
            keywords: ['Ayuda', 'Help', 'Guía', 'Guide', 'Secciones', 'Orientación', 'Mapa', 'Navegación', 'Contenidos']
        },
        {
            id: 'ayuda_retro',
            url: 'ayuda.html#retroalimentacion',
            navKey: 'footer_ayuda',
            tituloKey: 'ayuda_h2_contacto',
            claves: ['ayuda_h2_contacto', 'ayuda_p_contacto1', 'ayuda_p_correo', 'ayuda_p_github', 'ayuda_p_contacto2'],
            keywords: ['Retroalimentación', 'Feedback', 'Contacto', 'Contact', 'Asistencia', 'Soporte', 'Support', 'Dudas', 'Correo', 'Email', 'UO294914@uniovi.es']
        }
    ];

    /**
     * Normaliza una cadena eliminando diacríticos y pasando a minúsculas
     */
    function normalizar(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Limpia etiquetas HTML para procesar texto plano
     */
    function limpiarHTML(str) {
        if (!str) return '';
        return str.replace(/<[^>]+>/g, '').trim();
    }

    /**
     * Escapa caracteres HTML para inserción segura en el DOM
     */
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Construye una expresión regular insensible a mayúsculas y acentos a partir de la frase y palabras clave
     */
    function crearRegexTerminos(query, terminos) {
        const mapa = {
            'a': '[aáàäâ]', 'á': '[aáàäâ]', 'à': '[aáàäâ]',
            'e': '[eéèëê]', 'é': '[eéèëê]',
            'i': '[iíìïî]', 'í': '[iíìïî]',
            'o': '[oóòöô]', 'ó': '[oóòöô]',
            'u': '[uúùüû]', 'ú': '[uúùüû]', 'ü': '[uúùüû]',
            'n': '[nñ]', 'ñ': '[nñ]',
            'c': '[cç]'
        };

        const lista = [];
        const qTrim = (query || '').trim();
        if (qTrim.includes(' ') && qTrim.length > 2) {
            lista.push(qTrim);
        }
        (terminos || []).forEach((t) => {
            if (t.length > 1 || terminos.length === 1) {
                lista.push(t);
            }
        });

        const unicos = Array.from(new Set(lista)).sort((a, b) => b.length - a.length);
        if (unicos.length === 0) return null;

        const patrones = unicos.map((term) => {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let p = '';
            for (const ch of escaped.toLowerCase()) {
                p += mapa[ch] || ch;
            }
            return p;
        });

        return new RegExp('(' + patrones.join('|') + ')', 'gi');
    }

    /**
     * Extrae el fragmento exacto donde se encuentra la mención y resalta las coincidencias con <mark>
     */
    function extraerSnippetConResaltado(textos, query, terminos, maxLen = 175) {
        const regex = crearRegexTerminos(query, terminos);

        if (!regex) {
            const lead = textos.find((t) => t.length > 50) || textos[0] || '';
            const plain = lead.length > maxLen ? lead.substring(0, maxLen).trim() + ' ...' : lead;
            return escapeHTML(plain);
        }

        // Priorizar textos con mayor desarrollo narrativo (párrafos frente a pies de foto breves)
        const textosOrdenados = [...textos].sort((a, b) => {
            const aLargo = a.length > 60;
            const bLargo = b.length > 60;
            if (aLargo && !bLargo) return -1;
            if (!aLargo && bLargo) return 1;
            return 0;
        });

        let textoElegido = '';
        let mejorMatch = null;

        for (const t of textosOrdenados) {
            regex.lastIndex = 0;
            const m = regex.exec(t);
            if (m) {
                textoElegido = t;
                mejorMatch = m;
                break;
            }
        }

        if (!textoElegido) {
            textoElegido = textos.find((t) => t.length > 50) || textos[0] || '';
        }

        let snippetPlano = '';
        if (mejorMatch) {
            const matchIdx = mejorMatch.index;
            const matchLen = mejorMatch[0].length;
            const leadLen = 50;

            let inicio = Math.max(0, matchIdx - leadLen);
            let fin = Math.min(textoElegido.length, matchIdx + matchLen + (maxLen - leadLen - matchLen));

            // Ajustar cortes para no truncar palabras a la mitad
            if (inicio > 0) {
                const nextSpace = textoElegido.indexOf(' ', inicio);
                if (nextSpace !== -1 && nextSpace < matchIdx) {
                    inicio = nextSpace + 1;
                }
            }
            if (fin < textoElegido.length) {
                const prevSpace = textoElegido.lastIndexOf(' ', fin);
                if (prevSpace !== -1 && prevSpace > matchIdx + matchLen) {
                    fin = prevSpace;
                }
            }

            snippetPlano = textoElegido.substring(inicio, fin).trim();
            if (inicio > 0) snippetPlano = '... ' + snippetPlano;
            if (fin < textoElegido.length) snippetPlano = snippetPlano + ' ...';
        } else {
            snippetPlano = textoElegido.length > maxLen
                ? textoElegido.substring(0, maxLen).trim() + ' ...'
                : textoElegido;
        }

        const snippetEscapado = escapeHTML(snippetPlano);
        regex.lastIndex = 0;
        return snippetEscapado.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Obtiene el idioma activo comprobando localStorage, selector nativo y etiqueta <html>
     */
    function obtenerIdiomaActivo() {
        try {
            const guardado = localStorage.getItem('idioma_preferido');
            if (guardado === 'en' || guardado === 'es') return guardado;
        } catch (e) {}

        const selector = document.getElementById('selector-idioma');
        if (selector && (selector.value === 'en' || selector.value === 'es')) {
            return selector.value;
        }

        return document.documentElement.lang === 'en' ? 'en' : 'es';
    }

    /**
     * Carga el diccionario unificado de textos reales (translations.json / translations.js)
     */
    async function cargarTraducciones() {
        if (typeof window !== 'undefined' && window.TRADUCCIONES_DATOS) {
            return window.TRADUCCIONES_DATOS;
        }
        if (typeof TRADUCCIONES_DATOS !== 'undefined') {
            return TRADUCCIONES_DATOS;
        }
        try {
            const res = await fetch('translations.json');
            if (res.ok) return await res.json();
        } catch (e) {}
        return null;
    }

    /**
     * Ejecuta la búsqueda basada en claves y textos reales con fragmento contextual y resaltado
     */
    async function ejecutarBusqueda() {
        const resumenEl = document.getElementById('resumen-busqueda');
        const listaEl = document.getElementById('lista-resultados');
        const inputHeader = document.getElementById('campo-busqueda');

        if (!resumenEl || !listaEl) return;

        const params = new URLSearchParams(window.location.search);
        const qRaw = params.get('q');
        const query = qRaw ? qRaw.trim() : '';

        if (inputHeader && query) {
            inputHeader.value = query;
        }

        const lang = obtenerIdiomaActivo();
        const datos = await cargarTraducciones();

        if (!datos || !datos.es) {
            resumenEl.textContent = lang === 'en'
                ? 'Could not load site content.'
                : 'No se pudieron cargar los contenidos del sitio.';
            return;
        }

        const dictActivo = datos[lang] || datos.es;
        const dictEs = datos.es;
        const dictEn = datos.en || datos.es;

        // Caso: Sin término de búsqueda
        if (!query) {
            const msgSinTermino = dictActivo.buscar_sin_termino ||
                (lang === 'en' ? 'Please enter a search term in the form above to search the site.' : 'Introduce un término en el formulario superior para buscar contenidos en el sitio.');
            resumenEl.textContent = msgSinTermino;
            listaEl.innerHTML = '';
            return;
        }

        const palabras = normalizar(query).split(/\s+/).filter(Boolean);
        const resultados = [];

        ENTIDADES.forEach((ent) => {
            // Textos reales en español e inglés para búsqueda bilingüe instantánea
            const textosEs = ent.claves.map((k) => limpiarHTML(dictEs[k] || '')).filter(Boolean);
            const textosEn = ent.claves.map((k) => limpiarHTML(dictEn[k] || '')).filter(Boolean);
            const extraKeywords = (ent.keywords || []).join(' ');

            const corpus = normalizar(
                textosEs.join(' ') + ' ' +
                textosEn.join(' ') + ' ' +
                extraKeywords + ' ' +
                (ent.tituloDirecto || '')
            );

            // Comprobar que todas las palabras de la consulta están en el corpus
            const coincide = palabras.every((p) => corpus.includes(p));

            if (coincide) {
                const titulo = dictActivo[ent.tituloKey] || ent.tituloDirecto || dictActivo[ent.navKey] || '';
                const seccion = dictActivo[ent.navKey] || '';

                // Extraer textos en el idioma activo
                const textosActivos = ent.claves
                    .map((k) => limpiarHTML(dictActivo[k] || ''))
                    .filter(Boolean);

                // Obtener fragmento contextual recortado y resaltado con <mark>
                const snippetHtml = extraerSnippetConResaltado(textosActivos, query, palabras);

                resultados.push({
                    url: ent.url,
                    titulo: titulo,
                    seccion: seccion,
                    snippetHtml: snippetHtml
                });
            }
        });

        // Caso: Sin resultados
        if (resultados.length === 0) {
            const plantillaSin = dictActivo.buscar_sin_resultados ||
                (lang === 'en' ? 'No results found for "{q}". Try different words.' : 'No se encontraron resultados para "{q}". Prueba con otros términos.');
            resumenEl.textContent = plantillaSin.replace('{q}', query);
            listaEl.innerHTML = '';
            return;
        }

        // Caso: Con resultados
        const plantillaCon = dictActivo.buscar_con_resultados ||
            (lang === 'en' ? 'Found {n} result(s) for "{q}":' : 'Se han encontrado {n} resultado(s) para "{q}":');
        resumenEl.textContent = plantillaCon.replace('{n}', resultados.length).replace('{q}', query);

        listaEl.innerHTML = '';

        const seccionLabel = dictActivo.buscar_seccion_label || (lang === 'en' ? 'Section: ' : 'Sección: ');
        const regexTerminos = crearRegexTerminos(query, palabras);

        resultados.forEach((item) => {
            const li = document.createElement('li');

            const h3 = document.createElement('h3');
            const a = document.createElement('a');
            a.href = item.url;

            // Resaltar en el título si contiene el término buscado
            if (regexTerminos) {
                regexTerminos.lastIndex = 0;
                a.innerHTML = escapeHTML(item.titulo).replace(regexTerminos, '<mark>$1</mark>');
            } else {
                a.textContent = item.titulo;
            }
            h3.appendChild(a);

            const pCat = document.createElement('p');
            pCat.textContent = seccionLabel + item.seccion;

            const pTexto = document.createElement('p');
            pTexto.innerHTML = item.snippetHtml;

            li.appendChild(h3);
            li.appendChild(pCat);
            li.appendChild(pTexto);
            listaEl.appendChild(li);
        });
    }

    // Inicializar búsqueda y registrar escuchadores reactivos
    document.addEventListener('DOMContentLoaded', () => {
        ejecutarBusqueda();

        // Reaccionar al cambio de idioma del selector de cabecera
        const selectorIdioma = document.getElementById('selector-idioma');
        if (selectorIdioma) {
            selectorIdioma.addEventListener('change', () => {
                setTimeout(ejecutarBusqueda, 30);
            });
        }

        // Reaccionar al evento personalizado de sincronización de i18n.js
        window.addEventListener('idiomaCambiado', () => {
            ejecutarBusqueda();
        });
    });
})();
