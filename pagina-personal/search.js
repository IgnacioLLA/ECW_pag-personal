/**
 * search.js - Buscador interno del sitio web personal.
 *
 * Busca sobre los textos reales del sitio, que están centralizados en translations.json
 * (y en su copia translations.js, que permite abrir el sitio en local sin servidor).
 * El formulario <search> de la cabecera de todas las páginas envía la consulta a buscar.html
 * con el parámetro «q»; este script la lee, busca en el índice ENTIDADES y escribe los
 * resultados en la lista de buscar.html.
 *
 * No genera ningún elemento div, atributo id ni clase: los resultados son <li> con un <h3>
 * enlazado, la sección y un fragmento de texto con los términos resaltados en <mark>.
 */
(function () {
    'use strict';

    /**
     * Índice del buscador. Cada entidad es un apartado del sitio al que puede llevar un resultado:
     *  - id: identificador interno de la entidad (no se usa en el HTML).
     *  - url: página y ancla existente a la que enlaza el resultado.
     *  - navKey: clave del texto de la sección del menú a la que pertenece («Sección: ...»).
     *  - tituloKey: clave del título principal del apartado, que se usa como título del resultado.
     *  - tituloDirecto: título fijo para apartados cuyo nombre no está en el diccionario (opcional).
     *  - claves: claves de translations.json con los textos del apartado, en orden de aparición.
     *  - keywords: palabras clave adicionales con las que también debe encontrarse (opcional).
     */
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
            claves: ['profile_exp_h3', 'profile_exp_intro', 'profile_item_master_h4', 'profile_item_master_fecha', 'profile_item_tragsa_h4', 'profile_item_tragsa_fecha', 'profile_item_tragsa_desc', 'profile_item_tfg_h4', 'profile_item_tfg_fecha', 'profile_item_tfg_desc', 'profile_item_grado_h4', 'profile_item_grado_fecha', 'profile_item_grado_desc'],
            keywords: ['TRAGSATEC', 'prácticas', '2 meses', 'full-stack', 'Spring Boot', 'React', 'TFG', 'TFE', 'MatchTFE', 'Trabajo de Fin de Grado', 'GitHub', 'Máster', 'Ingeniería Web', 'Grado', 'Software', 'Formación', 'Experiencia']
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
     * Normaliza una cadena para compararla: pasa a minúsculas y elimina los diacríticos
     * (tildes, diéresis), de modo que «Música» y «musica» se consideran iguales.
     * @param {string} str Texto original.
     * @returns {string} Texto normalizado.
     */
    function normalizar(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '');
    }

    /**
     * Elimina las etiquetas HTML de un texto del diccionario (algunos textos incluyen enlaces).
     * @param {string} str Texto con posibles etiquetas.
     * @returns {string} Texto plano.
     */
    function limpiarHTML(str) {
        if (!str) return '';
        return str.replace(/<[^>]+>/g, '').trim();
    }

    /**
     * Escapa los caracteres especiales de HTML para insertar texto de forma segura con innerHTML.
     * @param {string} str Texto plano.
     * @returns {string} Texto escapado.
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
     * Construye la expresión regular que se usa para resaltar los términos buscados.
     * Incluye la frase completa (si tiene varias palabras) y cada palabra por separado,
     * ordenadas de más larga a más corta para que la frase completa se resalte entera.
     * Cada vocal admite sus variantes acentuadas, ya que los términos llegan normalizados.
     * @param {string} query Consulta tal y como la escribió el usuario.
     * @param {string[]} terminos Palabras de la consulta ya normalizadas.
     * @returns {RegExp|null} Expresión global e insensible a mayúsculas, o null si no hay términos.
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
        // Las palabras de una sola letra solo se resaltan si son la única palabra de la consulta
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
     * Indica si una clave del diccionario corresponde a un título (h2 a h6).
     * Las claves siguen la convención de incluir el nivel del encabezado,
     * por ejemplo «profile_item_tfg_h4» o «ayuda_h2_guia».
     * @param {string} clave Clave del diccionario de textos.
     * @returns {boolean} true si la clave es un título.
     */
    function esTitulo(clave) {
        return /(^|_)h[2-6](_|$)/.test(clave);
    }

    /**
     * Elige el texto de la entidad que se mostrará como fragmento, con dos reglas:
     *  1. Si algún texto contiene la consulta completa, se elige uno de ellos: primero un título
     *     (si el usuario escribe un título quiere llegar a ese apartado), después un párrafo largo
     *     (más de 60 caracteres) y, si no, el primero.
     *  2. Si ninguno la contiene, se hace como en la versión 2: el primer párrafo largo que contenga
     *     alguna palabra de la consulta o, si no hay, el primer texto que la contenga.
     * @param {{clave: string, texto: string}[]} entradas Textos de la entidad con su clave.
     * @param {string} query Consulta original.
     * @param {string[]} terminos Palabras de la consulta ya normalizadas.
     * @returns {number} Posición del texto elegido dentro de entradas, o -1 si ninguno coincide.
     */
    function elegirMejorTexto(entradas, query, terminos) {
        const frase = normalizar(query.trim());
        const contiene = (e, txt) => normalizar(e.texto).includes(txt);

        // 1. Un texto con la frase completa, prefiriendo un título
        const conFrase = entradas.filter((e) => contiene(e, frase));
        const elegido = conFrase.find((e) => esTitulo(e.clave))
            || conFrase.find((e) => e.texto.length > 60)
            || conFrase[0];
        if (elegido) return entradas.indexOf(elegido);

        // 2. Si no, el primer párrafo largo con alguna palabra de la consulta
        const conPalabra = entradas.filter((e) => terminos.some((p) => contiene(e, p)));
        const largo = conPalabra.find((e) => e.texto.length > 60) || conPalabra[0];
        return largo ? entradas.indexOf(largo) : -1;
    }

    /**
     * Cuando la mejor coincidencia es un título, busca el párrafo que le da contenido:
     * el primer texto largo que no sea un título y que vaya después de él en la lista de claves.
     * Si no lo hay, usa el primer texto largo de la entidad.
     * @param {{clave: string, texto: string}[]} entradas Textos de la entidad con su clave.
     * @param {number} indiceTitulo Posición del título dentro de entradas.
     * @returns {string} Texto del párrafo asociado, o el propio título si no hay ninguno.
     */
    function parrafoTrasTitulo(entradas, indiceTitulo) {
        const esParrafo = (e) => !esTitulo(e.clave) && e.texto.length > 60;
        const siguiente = entradas.slice(indiceTitulo + 1).find(esParrafo) || entradas.find(esParrafo);
        return siguiente ? siguiente.texto : entradas[indiceTitulo].texto;
    }

    /**
     * Recorta un texto a un máximo de caracteres, sin cortar palabras, y resalta los términos con <mark>.
     * Si se pide, el recorte se centra en la coincidencia más larga (la frase completa, si aparece,
     * o la palabra más larga); si no, el fragmento empieza al principio del texto.
     * @param {string} texto Texto plano elegido para el fragmento.
     * @param {RegExp|null} regex Expresión de resaltado de crearRegexTerminos.
     * @param {number} maxLen Longitud máxima aproximada del fragmento.
     * @param {boolean} centrar true para centrar el recorte en la coincidencia, false para empezar por el principio.
     * @returns {string} Fragmento en HTML seguro.
     */
    function recortarYResaltar(texto, regex, maxLen, centrar) {
        let mejorMatch = null;
        if (regex && centrar) {
            regex.lastIndex = 0;
            let m;
            while ((m = regex.exec(texto)) !== null) {
                if (!mejorMatch || m[0].length > mejorMatch[0].length) mejorMatch = m;
            }
        }

        let snippetPlano = '';
        if (mejorMatch) {
            const matchIdx = mejorMatch.index;
            const matchLen = mejorMatch[0].length;
            const leadLen = 50; // caracteres de contexto que se dejan antes de la coincidencia

            let inicio = Math.max(0, matchIdx - leadLen);
            let fin = Math.min(texto.length, matchIdx + matchLen + (maxLen - leadLen - matchLen));

            // Ajustar los cortes a los espacios para no partir palabras
            if (inicio > 0) {
                const nextSpace = texto.indexOf(' ', inicio);
                if (nextSpace !== -1 && nextSpace < matchIdx) {
                    inicio = nextSpace + 1;
                }
            }
            if (fin < texto.length) {
                const prevSpace = texto.lastIndexOf(' ', fin);
                if (prevSpace !== -1 && prevSpace > matchIdx + matchLen) {
                    fin = prevSpace;
                }
            }

            snippetPlano = texto.substring(inicio, fin).trim();
            if (inicio > 0) snippetPlano = '... ' + snippetPlano;
            if (fin < texto.length) snippetPlano = snippetPlano + ' ...';
        } else {
            snippetPlano = texto.length > maxLen
                ? texto.substring(0, maxLen).trim() + ' ...'
                : texto;
        }

        const snippetEscapado = escapeHTML(snippetPlano);
        if (!regex) return snippetEscapado;
        regex.lastIndex = 0;
        return snippetEscapado.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Construye el resultado de una entidad: el fragmento que se muestra y, si la coincidencia
     * está en un subtítulo, ese subtítulo como título del resultado.
     *  - Si el texto elegido es un párrafo, el fragmento se recorta alrededor de la coincidencia.
     *  - Si es un subtítulo dentro de la entidad (por ejemplo, la entrada del TFG dentro de
     *    «Formación y Experiencia»), ese subtítulo pasa a ser el título del resultado y el fragmento
     *    es el comienzo del párrafo que lo sigue, para dar contexto en lugar de repetir el título.
     *  - Si es el título principal de la entidad, que ya se muestra como título del resultado,
     *    el fragmento es el párrafo (texto de más de 60 caracteres) que contiene la consulta completa,
     *    si lo hay; si no, el comienzo del párrafo que sigue al título.
     * @param {{clave: string, texto: string}[]} entradas Textos de la entidad con su clave.
     * @param {string} tituloKey Clave del título principal de la entidad.
     * @param {string} query Consulta original.
     * @param {string[]} terminos Palabras de la consulta ya normalizadas.
     * @param {number} [maxLen=175] Longitud máxima aproximada del fragmento.
     * @returns {{snippetHtml: string, titulo: string|null}} Fragmento en HTML y título alternativo (o null).
     */
    function extraerSnippetConResaltado(entradas, tituloKey, query, terminos, maxLen = 175) {
        const regex = crearRegexTerminos(query, terminos);
        const indice = elegirMejorTexto(entradas, query, terminos);

        // Sin coincidencias en los textos (la entidad coincidió por sus palabras clave):
        // se muestra el comienzo del primer párrafo.
        if (indice === -1) {
            const lead = entradas.find((e) => e.texto.length > 50) || entradas[0];
            return { snippetHtml: recortarYResaltar(lead ? lead.texto : '', regex, maxLen, true), titulo: null };
        }

        const elegida = entradas[indice];
        if (!esTitulo(elegida.clave)) {
            return { snippetHtml: recortarYResaltar(elegida.texto, regex, maxLen, true), titulo: null };
        }

        if (elegida.clave === tituloKey) {
            const fraseNormalizada = normalizar(query.trim());
            const conFrase = entradas.find((e) => !esTitulo(e.clave) && e.texto.length > 60 && normalizar(e.texto).includes(fraseNormalizada));
            if (conFrase) {
                return { snippetHtml: recortarYResaltar(conFrase.texto, regex, maxLen, true), titulo: null };
            }
            return { snippetHtml: recortarYResaltar(parrafoTrasTitulo(entradas, indice), regex, maxLen, false), titulo: null };
        }

        return {
            snippetHtml: recortarYResaltar(parrafoTrasTitulo(entradas, indice), regex, maxLen, false),
            titulo: elegida.texto
        };
    }

    /**
     * Obtiene el idioma activo: primero el guardado en localStorage, después el selector
     * de idioma de la cabecera y, por último, el atributo lang del documento.
     * @returns {'es'|'en'} Código del idioma activo.
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
     * Carga el diccionario de textos del sitio. Usa la variable global TRADUCCIONES_DATOS
     * de translations.js si está disponible (funciona también abriendo los ficheros en local)
     * y, si no, descarga translations.json.
     * @returns {Promise<Object|null>} Diccionario {es: {...}, en: {...}} o null si no se pudo cargar.
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
     * Ejecuta la búsqueda con el parámetro «q» de la URL y pinta los resultados en buscar.html.
     * 1. Lee la consulta y la divide en palabras normalizadas.
     * 2. Una entidad coincide si todas las palabras aparecen en sus textos en español o en inglés,
     *    en sus palabras clave o en su título directo.
     * 3. Para cada entidad que coincide se elige el fragmento (y, si procede, el título) en el
     *    idioma activo.
     * 4. Se escribe el resumen en la región aria-live y la lista de resultados.
     */
    async function ejecutarBusqueda() {
        const resumenEl = document.getElementById('resumen-busqueda');
        const listaEl = document.getElementById('lista-resultados');
        const inputHeader = document.getElementById('campo-busqueda');

        // Solo se ejecuta en buscar.html, que es la página que contiene la lista de resultados
        if (!resumenEl || !listaEl) return;

        const params = new URLSearchParams(window.location.search);
        const qRaw = params.get('q');
        const query = qRaw ? qRaw.trim() : '';

        // Mantener la consulta en el campo de la cabecera para poder refinarla
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

        // Caso: sin término de búsqueda
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
            // Se busca en los dos idiomas a la vez, de modo que «guitar» encuentra la sección en español
            const textosEs = ent.claves.map((k) => limpiarHTML(dictEs[k] || '')).filter(Boolean);
            const textosEn = ent.claves.map((k) => limpiarHTML(dictEn[k] || '')).filter(Boolean);
            const extraKeywords = (ent.keywords || []).join(' ');

            const corpus = normalizar(
                textosEs.join(' ') + ' ' +
                textosEn.join(' ') + ' ' +
                extraKeywords + ' ' +
                (ent.tituloDirecto || '')
            );

            // La entidad coincide si contiene todas las palabras de la consulta
            const coincide = palabras.every((p) => corpus.includes(p));

            if (coincide) {
                const seccion = dictActivo[ent.navKey] || '';

                // Textos del idioma activo junto con su clave, para saber cuáles son títulos
                const entradasActivas = ent.claves
                    .map((k) => ({ clave: k, texto: limpiarHTML(dictActivo[k] || '') }))
                    .filter((e) => e.texto);

                const extracto = extraerSnippetConResaltado(entradasActivas, ent.tituloKey, query, palabras);
                const titulo = extracto.titulo || dictActivo[ent.tituloKey] || ent.tituloDirecto || dictActivo[ent.navKey] || '';

                resultados.push({
                    url: ent.url,
                    titulo: titulo,
                    seccion: seccion,
                    snippetHtml: extracto.snippetHtml
                });
            }
        });

        // Caso: sin resultados
        if (resultados.length === 0) {
            const plantillaSin = dictActivo.buscar_sin_resultados ||
                (lang === 'en' ? 'No results found for "{q}". Try different words.' : 'No se encontraron resultados para "{q}". Prueba con otros términos.');
            resumenEl.textContent = plantillaSin.replace('{q}', query);
            listaEl.innerHTML = '';
            return;
        }

        // Caso: con resultados
        const plantillaCon = dictActivo.buscar_con_resultados ||
            (lang === 'en' ? 'Found {n} result(s) for "{q}":' : 'Se han encontrado {n} resultado(s) para "{q}":');
        resumenEl.textContent = plantillaCon.replace('{n}', resultados.length).replace('{q}', query);

        listaEl.innerHTML = '';

        const seccionLabel = dictActivo.buscar_seccion_label || (lang === 'en' ? 'Section: ' : 'Sección: ');
        const regexTerminos = crearRegexTerminos(query, palabras);

        // Cada resultado es un <li> con el título enlazado (h3), la sección y el fragmento
        resultados.forEach((item) => {
            const li = document.createElement('li');

            const h3 = document.createElement('h3');
            const a = document.createElement('a');
            a.href = item.url;

            // Resaltar en el título los términos buscados
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

    // Búsqueda inicial al cargar la página y repetición al cambiar de idioma
    document.addEventListener('DOMContentLoaded', () => {
        ejecutarBusqueda();

        const selectorIdioma = document.getElementById('selector-idioma');
        if (selectorIdioma) {
            selectorIdioma.addEventListener('change', () => {
                // Pequeño retardo para que i18n.js guarde antes el idioma elegido
                setTimeout(ejecutarBusqueda, 30);
            });
        }

        // Evento que lanza i18n.js al aplicar un idioma
        window.addEventListener('idiomaCambiado', () => {
            ejecutarBusqueda();
        });
    });
})();
