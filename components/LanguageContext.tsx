"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

type Lang = "ko" | "en" | "es" | "pt";

type Dictionary = Record<string, Record<Lang, string>>;

const translations: Dictionary = {
  "nav.home": {
    en: "Home",
    ko: "홈",
    es: "Inicio",
    pt: "Início"
  },
  "nav.products": {
    en: "Collection",
    ko: "컬렉션",
    es: "Colección",
    pt: "Coleção"
  },
  "nav.wholesale": {
    en: "Wholesale",
    ko: "도매 문의",
    es: "Mayoristas",
    pt: "Atacado"
  },
  "nav.admin": {
    en: "Admin",
    ko: "관리자",
    es: "Admin",
    pt: "Admin"
  },
  "home.heroSubtitle": {
    en: "Quiet luxury jewelry for global retailers.",
    ko: "글로벌 리테일러를 위한 조용한 럭셔리 주얼리.",
    es: "Joyería de lujo silenciosa para minoristas globales.",
    pt: "Joias de luxo discreto para varejistas globais."
  },
  "home.viewCollection": {
    en: "View Collection",
    ko: "컬렉션 보기",
    es: "Ver colección",
    pt: "Ver coleção"
  },
  "home.wholesaleInquiry": {
    en: "Wholesale Inquiry",
    ko: "도매 문의",
    es: "Consulta mayorista",
    pt: "Contato atacado"
  },
  "home.previewRowLabel": {
    en: "Highlighted products",
    ko: "하이라이트 제품",
    es: "Productos destacados",
    pt: "Produtos em destaque"
  },
  "home.defaultProductSubtitle": {
    en: "Signature piece from the YOURS line.",
    ko: "YOURS 라인의 시그니처 피스.",
    es: "Pieza insignia de la línea YOURS.",
    pt: "Peça assinatura da linha YOURS."
  },
  "home.priceOnRequest": {
    en: "Price on Request",
    ko: "문의 시 공개",
    es: "Precio a consultar",
    pt: "Preço sob consulta"
  },
  "home.accessoriesTitle": {
    en: "Accessories Collection",
    ko: "액세서리 컬렉션",
    es: "Colección de accesorios",
    pt: "Coleção de acessórios"
  },
  "home.accessoriesBody": {
    en: "Refined earrings, rings and bracelets curated for modern boutiques.",
    ko: "모던 부티크를 위한 정제된 이어링, 링, 브레이슬릿.",
    es: "Pendientes, anillos y pulseras refinados para boutiques modernas.",
    pt: "Brincos, anéis e pulseiras refinados para boutiques modernas."
  },
  "home.accessoriesBullet1": {
    en: "Champagne gold and soft beige tones",
    ko: "샴페인 골드와 소프트 베이지 톤",
    es: "Oro champán y tonos beige suaves",
    pt: "Ouro champanhe e tons bege suaves"
  },
  "home.accessoriesBullet2": {
    en: "Consistent quality for repeat orders",
    ko: "재주문에 안정적인 품질",
    es: "Calidad constante para pedidos recurrentes",
    pt: "Qualidade consistente para pedidos recorrentes"
  },
  "home.accessoriesBullet3": {
    en: "Flexible MOQ for new markets",
    ko: "신규 시장을 위한 유연한 MOQ",
    es: "MOQ flexible para nuevos mercados",
    pt: "MOQ flexível para novos mercados"
  },
  "home.accessoriesCta": {
    en: "View full accessories line",
    ko: "전체 액세서리 라인 보기",
    es: "Ver línea completa de accesorios",
    pt: "Ver linha completa de acessórios"
  },
  "home.globalTitle": {
    en: "Global Wholesale Partnership",
    ko: "글로벌 도매 파트너십",
    es: "Alianza mayorista global",
    pt: "Parceria de atacado global"
  },
  "home.globalBody": {
    en: "Supplying concept stores, department stores and online platforms across regions.",
    ko: "컨셉 스토어, 백화점, 온라인 플랫폼까지 다양한 채널에 공급합니다.",
    es: "Suministramos a concept stores, grandes almacenes y plataformas online en varias regiones.",
    pt: "Fornecemos para concept stores, lojas de departamento e plataformas online em diversas regiões."
  },
  "home.globalCta": {
    en: "Send wholesale inquiry",
    ko: "도매 문의 보내기",
    es: "Enviar consulta mayorista",
    pt: "Enviar consulta de atacado"
  },
  "products.title": {
    en: "YOURS Collection",
    ko: "YOURS 컬렉션",
    es: "Colección YOURS",
    pt: "Coleção YOURS"
  },
  "products.subtitle": {
    en: "Curated pieces ready for global retail.",
    ko: "글로벌 리테일에 적합한 큐레이션 컬렉션.",
    es: "Piezas seleccionadas listas para el retail global.",
    pt: "Peças selecionadas prontas para o varejo global."
  },
  "products.viewDetail": {
    en: "View detail",
    ko: "상세 보기",
    es: "Ver detalle",
    pt: "Ver detalhes"
  },
  "products.empty": {
    en: "No products registered yet.",
    ko: "등록된 제품이 아직 없습니다.",
    es: "Aún no hay productos registrados.",
    pt: "Ainda não há produtos cadastrados."
  },
  "products.loadingOrMissing": {
    en: "Loading product or not available.",
    ko: "제품을 불러오거나 존재하지 않습니다.",
    es: "Cargando producto o no disponible.",
    pt: "Carregando produto ou não disponível."
  },
  "wholesale.title": {
    en: "Wholesale Inquiry",
    ko: "도매 문의",
    es: "Consulta mayorista",
    pt: "Contato atacado"
  },
  "wholesale.subtitle": {
    en: "Partner with YOURS for refined jewelry supply.",
    ko: "YOURS와 함께 세련된 주얼리 공급 파트너십을 시작하세요.",
    es: "Asóciese con YOURS para un suministro refinado de joyería.",
    pt: "Seja parceiro da YOURS para fornecimento refinado de joias."
  },
  "wholesale.contactTitle": {
    en: "Direct contact",
    ko: "직접 문의",
    es: "Contacto directo",
    pt: "Contato direto"
  },
  "wholesale.contactText": {
    en: "For line sheets, pricing and MOQ, contact us by phone.",
    ko: "라인 시트, 가격, MOQ는 전화로 문의해 주세요.",
    es: "Para catálogos, precios y MOQ, contáctenos por teléfono.",
    pt: "Para catálogos, preços e MOQ, entre em contato por telefone."
  },
  "wholesale.callNow": {
    en: "Call 010-4556-3123",
    ko: "010-4556-3123 전화하기",
    es: "Llamar 010-4556-3123",
    pt: "Ligar 010-4556-3123"
  },
  "wholesale.emailHeading": {
    en: "Email inquiry",
    ko: "이메일 문의",
    es: "Consulta por email",
    pt: "Consulta por e-mail"
  },
  "wholesale.emailPlaceholder": {
    en: "Structured email form coming soon.",
    ko: "구조화된 이메일 폼이 곧 제공됩니다.",
    es: "Formulario estructurado por email próximamente.",
    pt: "Formulário de e-mail estruturado em breve."
  },
  "footer.rights": {
    en: "© YOURS. All rights reserved.",
    ko: "© YOURS. All rights reserved.",
    es: "© YOURS. Todos los derechos reservados.",
    pt: "© YOURS. Todos os direitos reservados."
  },
  "footer.wholesale": {
    en: "Wholesale",
    ko: "도매",
    es: "Mayoristas",
    pt: "Atacado"
  },
  "footer.call": {
    en: "Call",
    ko: "전화",
    es: "Llamar",
    pt: "Ligar"
  },
  "admin.loginTitle": {
    en: "Admin Login",
    ko: "관리자 로그인",
    es: "Acceso admin",
    pt: "Login admin"
  },
  "admin.loginSubtitle": {
    en: "Protected access for managing the YOURS catalog.",
    ko: "YOURS 카탈로그 관리를 위한 보호된 접근입니다.",
    es: "Acceso protegido para gestionar el catálogo YOURS.",
    pt: "Acesso protegido para gerenciar o catálogo YOURS."
  },
  "admin.passwordLabel": {
    en: "Password",
    ko: "비밀번호",
    es: "Contraseña",
    pt: "Senha"
  },
  "admin.loginButton": {
    en: "Sign in",
    ko: "로그인",
    es: "Iniciar sesión",
    pt: "Entrar"
  },
  "admin.loggingIn": {
    en: "Signing in…",
    ko: "로그인 중…",
    es: "Iniciando…",
    pt: "Entrando…"
  },
  "admin.invalidPassword": {
    en: "Incorrect password.",
    ko: "비밀번호가 올바르지 않습니다.",
    es: "Contraseña incorrecta.",
    pt: "Senha incorreta."
  },
  "admin.genericError": {
    en: "Unexpected error. Try again.",
    ko: "알 수 없는 오류입니다. 다시 시도하세요.",
    es: "Error inesperado. Intente de nuevo.",
    pt: "Erro inesperado. Tente novamente."
  },
  "admin.productsTitle": {
    en: "Product Management",
    ko: "제품 관리",
    es: "Gestión de productos",
    pt: "Gestão de produtos"
  },
  "admin.productsSubtitle": {
    en: "Create, update and organize YOURS pieces.",
    ko: "YOURS 피스를 생성, 수정 및 정리합니다.",
    es: "Cree, actualice y organice las piezas YOURS.",
    pt: "Crie, atualize e organize as peças YOURS."
  },
  "admin.fieldTitle": {
    en: "Title",
    ko: "제목",
    es: "Título",
    pt: "Título"
  },
  "admin.fieldSlug": {
    en: "Slug",
    ko: "슬러그",
    es: "Slug",
    pt: "Slug"
  },
  "admin.fieldDescription": {
    en: "Short description",
    ko: "짧은 소개",
    es: "Descripción corta",
    pt: "Descrição curta"
  },
  "admin.fieldPrice": {
    en: "Price text",
    ko: "가격 텍스트",
    es: "Texto de precio",
    pt: "Texto de preço"
  },
  "admin.fieldSortOrder": {
    en: "Sort order",
    ko: "정렬 순서",
    es: "Orden",
    pt: "Ordem"
  },
  "admin.fieldHeroImageUrl": {
    en: "Main image URL",
    ko: "메인 이미지 URL",
    es: "URL de imagen principal",
    pt: "URL da imagem principal"
  },
  "admin.fieldVisible": {
    en: "Visible on site",
    ko: "사이트에 표시",
    es: "Visible en el sitio",
    pt: "Visível no site"
  },
  "admin.saveSuccess": {
    en: "Saved successfully.",
    ko: "성공적으로 저장되었습니다.",
    es: "Guardado correctamente.",
    pt: "Salvo com sucesso."
  },
  "admin.saveError": {
    en: "Could not save product.",
    ko: "제품을 저장할 수 없습니다.",
    es: "No se pudo guardar el producto.",
    pt: "Não foi possível salvar o produto."
  },
  "admin.deleteConfirm": {
    en: "Delete this product?",
    ko: "이 제품을 삭제하시겠습니까?",
    es: "¿Eliminar este producto?",
    pt: "Excluir este produto?"
  },
  "admin.deleteSuccess": {
    en: "Deleted.",
    ko: "삭제되었습니다.",
    es: "Eliminado.",
    pt: "Excluído."
  },
  "admin.deleteError": {
    en: "Could not delete product.",
    ko: "제품을 삭제할 수 없습니다.",
    es: "No se pudo eliminar el producto.",
    pt: "Não foi possível excluir o produto."
  },
  "admin.updateProductButton": {
    en: "Update product",
    ko: "제품 수정",
    es: "Actualizar producto",
    pt: "Atualizar produto"
  },
  "admin.createProductButton": {
    en: "Create product",
    ko: "제품 생성",
    es: "Crear producto",
    pt: "Criar produto"
  },
  "admin.cancelEdit": {
    en: "Cancel edit",
    ko: "수정 취소",
    es: "Cancelar edición",
    pt: "Cancelar edição"
  },
  "admin.existingProducts": {
    en: "Existing products",
    ko: "기존 제품",
    es: "Productos existentes",
    pt: "Produtos existentes"
  },
  "admin.visibleLabel": {
    en: "Visible",
    ko: "표시",
    es: "Visible",
    pt: "Visível"
  },
  "admin.visibleYes": {
    en: "Yes",
    ko: "예",
    es: "Sí",
    pt: "Sim"
  },
  "admin.visibleNo": {
    en: "No",
    ko: "아니오",
    es: "No",
    pt: "Não"
  },
  "admin.sortOrderLabel": {
    en: "Sort",
    ko: "정렬",
    es: "Orden",
    pt: "Ordem"
  },
  "admin.edit": {
    en: "Edit",
    ko: "수정",
    es: "Editar",
    pt: "Editar"
  },
  "admin.delete": {
    en: "Delete",
    ko: "삭제",
    es: "Eliminar",
    pt: "Excluir"
  },
  "admin.noProducts": {
    en: "No products yet.",
    ko: "아직 제품이 없습니다.",
    es: "Aún no hay productos.",
    pt: "Ainda não há produtos."
  }
};

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "yours_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as Lang | null)
        : null;
    if (stored && ["ko", "en", "es", "pt"].includes(stored)) {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  }

  function t(key: keyof typeof translations): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return ctx;
}

