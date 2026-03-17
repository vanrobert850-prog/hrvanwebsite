'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'es'

interface LangContextType {
    lang: Lang
    setLang: (l: Lang) => void
    t: (key: string) => string
}

const translations = {
    en: {
        // Banner
        'banner.text': 'Make your space more beautiful',
        'banner.link': 'Shop original art',
        // Nav
        'nav.paintings': 'Paintings',
        'nav.prints': 'Prints',
        'nav.artists': 'Artists',
        'nav.all': 'All works',
        'nav.search': 'Search for anything',
        // Hero
        'hero.title1': 'Discover',
        'hero.title2': 'original art',
        'hero.sub': 'Paintings and fine art prints from independent artists worldwide. Every piece is one of a kind.',
        'hero.cta': 'Shop the collection',
        // Filters
        'filter.all': 'Shop all',
        'filter.paintings': 'Paintings',
        'filter.prints': 'Prints & fine art prints',
        // Sections
        'section.featured': 'Experience the joy of living with original art',
        'section.viewAll': 'View all',
        'section.newArrivals': 'New arrivals',
        'section.browseAll': 'Browse all',
        'section.shopCat': 'Shop by category',
        'section.catPaintings': 'Paintings',
        'section.catPrints': 'Fine art prints',
        'section.whyShop': 'Why shop on HR FineArt?',
        'section.whyShopSub': 'The best place to buy original art online, with confidence.',
        'section.shopPrice': 'Shop by price',
        'section.featuredArtists': 'Featured artists',
        'section.viewAllArtists': 'View all artists',
        'section.loved': 'Loved by collectors worldwide',
        // Why buy
        'why.title1': 'Why buy',
        'why.title2': 'original art?',
        'why.desc': 'More than décor, original art enriches your life. A daily source of joy, inspiration, and personal expression — each piece exists nowhere else in the world.',
        'why.label1': 'Uniquely yours',
        'why.desc1': 'There is only one — your artwork exists nowhere else. Made by a human hand with intention and care.',
        'why.label2': 'Transform your space',
        'why.desc2': 'Original art creates an atmosphere in a way nothing else can. It anchors a room and tells your story.',
        'why.label3': 'Smart investment',
        'why.desc3': 'Support an emerging artist before they are discovered. Original works appreciate in ways prints never can.',
        'why.label4': 'Connect with artists',
        'why.desc4': 'Every piece is created by hand. Browse artist profiles and learn the story behind each work.',
        // Trust
        'trust.global': 'Global selection',
        'trust.global.desc': 'Original artwork from hundreds of independent artists worldwide.',
        'trust.secure': 'Secure checkout',
        'trust.secure.desc': 'All transactions protected by Stripe. Your data is always safe.',
        'trust.shipping': 'Worldwide shipping',
        'trust.shipping.desc': 'Carefully packaged artwork delivered to collectors in 100+ countries.',
        'trust.support': 'Support artists',
        'trust.support.desc': 'We pay artists more per sale than any other gallery or marketplace.',
        // CTA
        'cta.title': 'Personalized, curated experience',
        'cta.desc': 'Discovering art you love should be easy and enjoyable. Our expert curators create weekly collections to simplify browsing.',
        'cta.btn': 'Connect with an advisor',
        // Footer
        'footer.cats': 'Top categories',
        'footer.tagline': 'A curated marketplace connecting art collectors with independent artists worldwide.',
        'footer.email': 'Enter your email address',
        'footer.shop': 'Shop',
        'footer.artists': 'Artists',
        'footer.info': 'Info',
        'footer.allArtists': 'All artists',
        'footer.featuredArtists': 'Featured artists',
        'footer.about': 'About us',
        'footer.shipping': 'Shipping',
        'footer.returns': 'Returns',
        'footer.contact': 'Contact',
        'footer.under500': 'Under $500',
        'footer.allWorks': 'All works',
        'footer.bottom': '© 2026 HR FineArt. All rights reserved.',
        'footer.stripe': 'Payments secured by Stripe',
        // Cookies
        'cookie.msg': 'We use cookies to improve your experience, save preferences, and analyze traffic.',
        'cookie.accept': 'Accept all',
        'cookie.decline': 'Decline',
        'cookie.learn': 'Learn more',
        // Artists page
        'artists.community': 'Our Community',
        'artists.title': 'Meet the Artists',
        'artists.desc': 'Discover independent artists from around the world. Each artist brings a unique perspective, technique, and story to their work.',
        'artists.viewProfile': 'View Profile',
        'artists.works': 'Works',
        'artists.memberSince': 'Member since',
        // Artist profile
        'artist.about': 'About the artist',
        'artist.memberSince': 'Member since',
        'artist.follow': 'Follow',
        'artist.following': 'Following',
        'artist.works': 'Works',
        'artist.specialty': 'Specialty',
        'artist.aboutTab': 'About',
        'artist.education': 'Education',
        'artist.exhibitions': 'Exhibitions',
        'artist.recognition': 'Recognition',
        'artist.allArtworks': 'All Artworks',
        'artist.viewAll': 'View all',
        'artist.commission': 'Commission',
        'artist.commissionDesc': 'Interested in a custom artwork? Inquire here and our curators will connect you directly with the artist.',
        'artist.contactCurators': 'Contact our curators',
        'artist.similar': 'Similar Artists You May Like',
        'artist.viewAllArtists': 'View all artists',
        // Gallery
        'gallery.allArtworks': 'All Artworks',
        'gallery.hideFilters': 'Hide Filters',
        'gallery.showFilters': 'Show Filters',
        'gallery.clearAll': 'Clear all',
        'gallery.results': 'results',
        'gallery.sortBy': 'Sort by:',
        'gallery.noResults': 'No artworks match your filters',
        'gallery.clearFilters': 'Clear all filters',
        'gallery.allTitle': 'All Original Artworks',
        'gallery.paintingsTitle': 'Original Paintings For Sale',
        'gallery.printsTitle': 'Fine Art Prints For Sale',
        'gallery.allDesc': 'Discover original artworks — paintings and fine art prints — from independent artists around the world.',
        'gallery.paintingsDesc': 'Discover a global selection of original paintings from emerging and independent artists worldwide.',
        'gallery.printsDesc': 'Browse fine art prints from independent artists worldwide. Each print is produced to archival standards.',
        'gallery.category': 'Category',
        'gallery.style': 'Style',
        'gallery.subject': 'Subject',
        'gallery.medium': 'Medium',
        'gallery.price': 'Price',
        'gallery.showMore': 'Show more',
        'gallery.showLess': 'Show less',
        'gallery.all': 'All',
        // Sort options
        'sort.featured': 'Featured',
        'sort.lowHigh': 'Price: Low to High',
        'sort.highLow': 'Price: High to Low',
        'sort.newest': 'Newest',
        // Meta
        'meta.home.title': 'HR FineArt — Buy Original Art Online | Paintings & Fine Art Prints',
        'meta.home.desc': 'Discover and buy original paintings and fine art prints from independent artists worldwide.',
        'meta.artists.title': 'Artists — HR FineArt | Independent Artists Worldwide',
        'meta.artists.desc': 'Discover independent artists from around the world. Buy original paintings and fine art prints directly from the artists.',
        'meta.gallery.title': 'Gallery — HR FineArt | Original Artworks For Sale',
        'meta.gallery.desc': 'Browse and buy original artworks — paintings and prints — from independent artists worldwide.',
    },
    es: {
        // Banner
        'banner.text': 'Embellece tu espacio',
        'banner.link': 'Compra arte original',
        // Nav
        'nav.paintings': 'Pinturas',
        'nav.prints': 'Grabados',
        'nav.artists': 'Artistas',
        'nav.all': 'Todas las obras',
        'nav.search': 'Buscar cualquier cosa',
        // Hero
        'hero.title1': 'Descubre',
        'hero.title2': 'arte original',
        'hero.sub': 'Pinturas y grabados de artistas independientes en todo el mundo. Cada pieza es única.',
        'hero.cta': 'Ver la colección',
        // Filters
        'filter.all': 'Ver todo',
        'filter.paintings': 'Pinturas',
        'filter.prints': 'Grabados y arte',
        // Sections
        'section.featured': 'Experimenta la alegría de vivir con arte original',
        'section.viewAll': 'Ver todo',
        'section.newArrivals': 'Nuevas obras',
        'section.browseAll': 'Ver todas',
        'section.shopCat': 'Comprar por categoría',
        'section.catPaintings': 'Pinturas',
        'section.catPrints': 'Grabados de arte',
        'section.whyShop': '¿Por qué comprar en HR FineArt?',
        'section.whyShopSub': 'El mejor lugar para comprar arte original en línea, con confianza.',
        'section.shopPrice': 'Comprar por precio',
        'section.featuredArtists': 'Artistas destacados',
        'section.viewAllArtists': 'Ver todos los artistas',
        'section.loved': 'Amado por coleccionistas de todo el mundo',
        // Why buy
        'why.title1': '¿Por qué comprar',
        'why.title2': 'arte original?',
        'why.desc': 'Más que decoración, el arte original enriquece tu vida. Una fuente diaria de alegría, inspiración y expresión personal.',
        'why.label1': 'Únicamente tuyo',
        'why.desc1': 'Solo existe uno — tu obra de arte no existe en ningún otro lugar. Hecha a mano con intención y cuidado.',
        'why.label2': 'Transforma tu espacio',
        'why.desc2': 'El arte original crea una atmósfera como nada más puede hacerlo. Ancla una habitación y cuenta tu historia.',
        'why.label3': 'Inversión inteligente',
        'why.desc3': 'Apoya a un artista emergente antes de que sea descubierto. Las obras originales se revalorizan.',
        'why.label4': 'Conecta con artistas',
        'why.desc4': 'Cada pieza es creada a mano. Explora los perfiles de los artistas y aprende la historia detrás de cada obra.',
        // Trust
        'trust.global': 'Selección global',
        'trust.global.desc': 'Arte original de cientos de artistas independientes en todo el mundo.',
        'trust.secure': 'Pago seguro',
        'trust.secure.desc': 'Todas las transacciones protegidas por Stripe. Tus datos siempre seguros.',
        'trust.shipping': 'Envío mundial',
        'trust.shipping.desc': 'Obras empacadas con cuidado entregadas a coleccionistas en más de 100 países.',
        'trust.support': 'Apoya artistas',
        'trust.support.desc': 'Pagamos a los artistas más por venta que cualquier otra galería.',
        // CTA
        'cta.title': 'Experiencia personalizada y curada',
        'cta.desc': 'Descubrir el arte que amas debe ser fácil y agradable. Nuestros curadores crean colecciones semanales.',
        'cta.btn': 'Conectar con un asesor',
        // Footer
        'footer.cats': 'Categorías principales',
        'footer.tagline': 'Un mercado curado que conecta coleccionistas con artistas independientes de todo el mundo.',
        'footer.email': 'Ingresa tu correo electrónico',
        'footer.shop': 'Comprar',
        'footer.artists': 'Artistas',
        'footer.info': 'Información',
        'footer.allArtists': 'Todos los artistas',
        'footer.featuredArtists': 'Artistas destacados',
        'footer.about': 'Sobre nosotros',
        'footer.shipping': 'Envío',
        'footer.returns': 'Devoluciones',
        'footer.contact': 'Contacto',
        'footer.under500': 'Menos de $500',
        'footer.allWorks': 'Todas las obras',
        'footer.bottom': '© 2026 HR FineArt. Todos los derechos reservados.',
        'footer.stripe': 'Pagos asegurados por Stripe',
        // Cookies
        'cookie.msg': 'Usamos cookies para mejorar tu experiencia, guardar preferencias y analizar el tráfico.',
        'cookie.accept': 'Aceptar todo',
        'cookie.decline': 'Rechazar',
        'cookie.learn': 'Más información',
        // Artists page
        'artists.community': 'Nuestra Comunidad',
        'artists.title': 'Conoce a los Artistas',
        'artists.desc': 'Descubre artistas independientes de todo el mundo. Cada artista aporta una perspectiva, técnica e historia únicas.',
        'artists.viewProfile': 'Ver Perfil',
        'artists.works': 'Obras',
        'artists.memberSince': 'Miembro desde',
        // Artist profile
        'artist.about': 'Sobre el artista',
        'artist.memberSince': 'Miembro desde',
        'artist.follow': 'Seguir',
        'artist.following': 'Siguiendo',
        'artist.works': 'Obras',
        'artist.specialty': 'Especialidad',
        'artist.aboutTab': 'Acerca de',
        'artist.education': 'Educación',
        'artist.exhibitions': 'Exposiciones',
        'artist.recognition': 'Reconocimientos',
        'artist.allArtworks': 'Todas las Obras',
        'artist.viewAll': 'Ver todo',
        'artist.commission': 'Encargar obra a',
        'artist.commissionDesc': '¿Interesado en una obra personalizada? Consúltanos y nuestros curadores te conectarán directamente con el artista.',
        'artist.contactCurators': 'Contactar a nuestros curadores',
        'artist.similar': 'Artistas Similares que Podrían Gustarte',
        'artist.viewAllArtists': 'Ver todos los artistas',
        // Gallery
        'gallery.allArtworks': 'Todas las Obras',
        'gallery.hideFilters': 'Ocultar Filtros',
        'gallery.showFilters': 'Mostrar Filtros',
        'gallery.clearAll': 'Limpiar todo',
        'gallery.results': 'resultados',
        'gallery.sortBy': 'Ordenar por:',
        'gallery.noResults': 'Ninguna obra coincide con tus filtros',
        'gallery.clearFilters': 'Limpiar todos los filtros',
        'gallery.allTitle': 'Todas las Obras Originales',
        'gallery.paintingsTitle': 'Pinturas Originales en Venta',
        'gallery.printsTitle': 'Grabados de Arte en Venta',
        'gallery.allDesc': 'Descubre obras originales — pinturas y grabados — de artistas independientes de todo el mundo.',
        'gallery.paintingsDesc': 'Descubre una selección global de pinturas originales de artistas emergentes e independientes de todo el mundo.',
        'gallery.printsDesc': 'Explora grabados de arte de artistas independientes. Cada grabado se produce con estándares de archivo.',
        'gallery.category': 'Categoría',
        'gallery.style': 'Estilo',
        'gallery.subject': 'Tema',
        'gallery.medium': 'Técnica',
        'gallery.price': 'Precio',
        'gallery.showMore': 'Ver más',
        'gallery.showLess': 'Ver menos',
        'gallery.all': 'Todos',
        // Sort options
        'sort.featured': 'Destacados',
        'sort.lowHigh': 'Precio: Menor a Mayor',
        'sort.highLow': 'Precio: Mayor a Menor',
        'sort.newest': 'Más recientes',
        // Meta
        'meta.home.title': 'HR FineArt — Compra Arte Original | Pinturas y Grabados',
        'meta.home.desc': 'Descubre y compra pinturas originales y grabados de artistas independientes de todo el mundo.',
        'meta.artists.title': 'Artistas — HR FineArt | Artistas Independientes Mundiales',
        'meta.artists.desc': 'Descubre artistas independientes de todo el mundo. Compra arte original directamente de los artistas.',
        'meta.gallery.title': 'Galería — HR FineArt | Obras Originales en Venta',
        'meta.gallery.desc': 'Explora y compra obras originales — pinturas y grabados — de artistas independientes de todo el mundo.',
    }
}

const LanguageContext = createContext<LangContextType>({
    lang: 'en',
    setLang: () => {},
    t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>('en')

    useEffect(() => {
        const saved = localStorage.getItem('hr_lang') as Lang | null
        if (saved === 'en' || saved === 'es') setLangState(saved)
    }, [])

    const setLang = (l: Lang) => {
        setLangState(l)
        localStorage.setItem('hr_lang', l)
        // Update html lang attribute for SEO
        document.documentElement.lang = l === 'es' ? 'es' : 'en'
    }

    const t = (key: string): string => {
        return (translations[lang] as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLang() {
    return useContext(LanguageContext)
}