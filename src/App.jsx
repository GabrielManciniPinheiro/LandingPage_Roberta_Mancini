import { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";
import { supabase } from "./lib/supabase";

const REGIONS = [
  "Todos",
  "Zona Sul",
  "Zona Norte",
  "Zona Leste",
  "Centro",
  "Zona Oeste",
  "Osasco",
  "São Caetano",
];

const TIMELINE = [
  {
    year: "2002",
    text: "Início da carreira no mercado imobiliário, com foco em atendimento personalizado e dedicação total aos clientes.",
  },
  {
    year: "2004",
    text: "Conquista do CRECI e especialização em imóveis residenciais de médio e alto padrão em São Paulo.",
  },
  {
    year: "2010",
    text: "Expansão da atuação para todas as regiões da cidade, consolidando uma carteira de mais de 500 clientes satisfeitos.",
  },
  {
    year: "2018",
    text: "Adoção de tecnologia e marketing digital, ampliando o alcance e a experiência dos clientes na busca pelo imóvel ideal.",
  },
  {
    year: "2020",
    text: "Referência no mercado paulistano, com mais de 100 imóveis vendidos e um compromisso inabalável com a excelência.",
  },
];

const STATS = [
  { number: "100+", label: "Imóveis Vendidos" },
  { number: "+20", label: "Anos de Experiência" },
  { number: "500+", label: "Clientes Atendidos" },
  { number: "+7", label: "Regiões de Atuação" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimatedSection({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id: "inicio", label: "Início" },
    { id: "sobre", label: "Sobre" },
    { id: "imoveis", label: "Empreendimentos" },
    { id: "contato", label: "Contato" },
  ];

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background:
          scrolled || mobileMenuOpen ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled || mobileMenuOpen ? "blur(20px)" : "none",
        borderBottom:
          scrolled || mobileMenuOpen ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s ease",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            height: "100%",
          }}
          onClick={() => scrollTo("inicio")}
        >
          <img
            src={logo}
            alt="Roberta Mancini"
            style={{
              height: scrolled || mobileMenuOpen ? "140px" : "180px",
              maxHeight: "50px",
              width: "auto",
              display: "block",
              objectFit: "contain",
              transition: "all 0.4s",
            }}
          />
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "none",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={scrolled || mobileMenuOpen ? "#1a1a1a" : "#fff"}
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        <div
          className="desktop-menu"
          style={{ display: "flex", gap: 36, alignItems: "center" }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 500,
                color:
                  activeSection === l.id
                    ? "#C8102E"
                    : scrolled
                      ? "#555"
                      : "rgba(255,255,255,0.85)",
                borderBottom:
                  activeSection === l.id
                    ? "2px solid #C8102E"
                    : "2px solid transparent",
                transition: "all 0.3s",
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.98)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          maxHeight: mobileMenuOpen ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: mobileMenuOpen ? "0 10px 20px rgba(0,0,0,0.05)" : "none",
        }}
      >
        <div
          style={{
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
                color: activeSection === l.id ? "#C8102E" : "#555",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section
      id="inicio"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
          filter: "grayscale(30%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(200,16,46,0.08))",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background:
            "linear-gradient(to top, rgba(26,26,26,0.9), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 32px 80px",
        }}
      >
        <div style={{ overflow: "hidden", marginBottom: 16 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
            }}
          >
            <div style={{ width: 48, height: 1, background: "#C8102E" }} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "#C8102E",
                fontWeight: 600,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              CRECI 074546-F
            </span>
          </div>
        </div>

        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(42px, 7vw, 82px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: -2,
              margin: 0,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
            }}
          >
            Roberta Mancini
          </h1>
        </div>

        <div style={{ overflow: "hidden", marginBottom: 32 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: 520,
              margin: 0,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s",
            }}
          >
            Transformando sonhos em endereços há mais de 20 anos. Expertise,
            confiança e dedicação em cada negociação.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
          }}
        >
          <button
            onClick={() =>
              document
                .getElementById("imoveis")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "#C8102E",
              color: "#fff",
              border: "none",
              padding: "16px 40px",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
            }}
          >
            Ver Empreendimentos
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contato")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "16px 40px",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
            }}
          >
            Fale Comigo
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "32px 0",
            marginTop: 60,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 40,
            opacity: loaded ? 1 : 0,
            transition: "all 1s ease 1.2s",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                paddingLeft: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#C8102E",
                  lineHeight: 1,
                }}
              >
                {s.number}
              </div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 8,
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="sobre"
      style={{
        background: "#fff",
        padding: "120px 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 80,
          width: 1,
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(200,16,46,0.08), transparent)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 32, height: 2, background: "#C8102E" }} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "#C8102E",
                fontWeight: 600,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Trajetória
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.1,
              margin: "0 0 20px",
              letterSpacing: -1,
            }}
          >
            Dedicação que
            <br />
            <span style={{ color: "#C8102E" }}>transforma vidas</span>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: "#777",
              lineHeight: 1.8,
              maxWidth: 600,
              margin: "0 0 64px",
            }}
          >
            Com mais de 20 anos no mercado imobiliário paulistano, construí
            minha carreira sobre pilares de confiança, transparência e um
            profundo conhecimento de cada região da cidade. Cada cliente é
            único, e cada imóvel conta uma história.
          </p>
        </AnimatedSection>

        <div
          style={{
            display: "grid",
            gap: 0,
            position: "relative",
            paddingLeft: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 0,
              bottom: 0,
              width: 1,
              background:
                "linear-gradient(to bottom, #e8e8e8, #C8102E, #e8e8e8)",
            }}
          />

          {TIMELINE.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  paddingBottom: 48,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -33,
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid #C8102E",
                    zIndex: 2,
                    boxShadow: "0 0 0 4px rgba(200,16,46,0.08)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#C8102E",
                      marginBottom: 8,
                    }}
                  >
                    {item.year}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: "#666",
                      lineHeight: 1.7,
                      margin: 0,
                      maxWidth: 500,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        cursor: "pointer",
        position: "relative",
        background: "#fff",
        border: "1px solid #eee",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.1)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        <img
          src={property.imagem_url}
          alt={property.titulo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />

        {property.destaque && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "#C8102E",
              color: "#fff",
              padding: "5px 14px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Destaque
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            padding: "6px 14px",
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#555",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {property.regiao}
        </div>
      </div>

      <div style={{ padding: "24px 24px 28px" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#aaa",
            marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          {property.tipo}
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 600,
            color: "#1a1a1a",
            margin: "0 0 16px",
            lineHeight: 1.3,
          }}
        >
          {property.titulo}
        </h3>

        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span
              style={{
                fontSize: 13,
                color: "#777",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {property.area}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="1.5"
            >
              <path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7" />
              <path d="M21 7H3l2-4h14l2 4z" />
            </svg>
            <span
              style={{
                fontSize: 13,
                color: "#777",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {property.quartos}{" "}
              {String(property.quartos).trim() === "1" ||
              String(property.quartos).trim() === "Studio"
                ? "dormitório" || String(property.quartos).trim() === "Studio"
                  ? ""
                  : ""
                : "dormitórios"}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#C8102E",
            }}
          >
            {property.preco}
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#C8102E",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-10px)",
            }}
          >
            Fale comigo! →
          </span>
        </div>
      </div>
    </div>
  );
}

function Properties() {
  const [active, setActive] = useState("Todos");
  const [imoveisReal, setImoveisReal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImoveis() {
      setLoading(true);
      const { data, error } = await supabase
        .from("imoveis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar imóveis:", error);
      } else {
        setImoveisReal(data || []);
      }
      setLoading(false);
    }

    fetchImoveis();
  }, []);

  const filtered =
    active === "Todos"
      ? imoveisReal
      : imoveisReal.filter((p) => p.regiao?.trim() === active);

  return (
    <section
      id="imoveis"
      style={{
        background: "#f8f8f8",
        padding: "120px 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 32, height: 2, background: "#C8102E" }} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "#C8102E",
                fontWeight: 600,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Portfólio
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.1,
              margin: "0 0 48px",
              letterSpacing: -1,
            }}
          >
            Empreendimentos{" "}
            <span style={{ color: "#C8102E" }}>selecionados</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActive(r)}
                style={{
                  padding: "10px 24px",
                  border: active === r ? "1px solid #C8102E" : "1px solid #ddd",
                  background: active === r ? "#C8102E" : "#fff",
                  color: active === r ? "#fff" : "#666",
                  fontSize: 12,
                  letterSpacing: 1,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.3s ease",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#aaa",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Carregando catálogo...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            }}
          >
            {filtered.map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.05}>
                <PropertyCard
                  property={p}
                  onClick={() =>
                    document
                      .getElementById("contato")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                />
              </AnimatedSection>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "#aaa",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
            }}
          >
            Nenhum imóvel encontrado nesta região.
          </div>
        )}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xeenlenw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", region: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 5000);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "16px 0",
    border: "none",
    borderBottom: focused === field ? "2px solid #C8102E" : "1px solid #ddd",
    background: "transparent",
    fontSize: 15,
    color: "#1a1a1a",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#999",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    display: "block",
    marginBottom: 4,
  };

  return (
    <section
      id="contato"
      style={{
        background: "#fff",
        padding: "120px 32px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: 60,
            alignItems: "start",
          }}
        >
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ width: 32, height: 2, background: "#C8102E" }} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: 4,
                  color: "#C8102E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Contato
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: "0 0 24px",
                letterSpacing: -1,
              }}
            >
              Encontre o <br />
              <span style={{ color: "#C8102E" }}>imóvel ideal</span>
              <br />
              para o seu cliente!
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: "#888",
                lineHeight: 1.8,
                margin: "0 0 48px",
                maxWidth: 420,
              }}
            >
              Preencha o formulário ao lado ou chame pelo Whatsapp, entrarei em
              contato o mais breve possível para entender suas necessidades e
              apresentar as melhores opções.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  text: "robertamancini1@hotmail.com",
                },
                {
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  text: "(11) 98520-2715",
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  text: "São Paulo, SP",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "#f8f8f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C8102E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: "#555",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div
              style={{
                background: "#fafafa",
                padding: 48,
                border: "1px solid #eee",
              }}
            >
              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "#C8102E",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 24,
                      color: "#1a1a1a",
                      marginBottom: 8,
                    }}
                  >
                    Mensagem Enviada!
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#888",
                    }}
                  >
                    Entrarei em contato em breve.
                  </p>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                      gap: 24,
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nome</label>
                      <input
                        style={inputStyle("name")}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>E-mail</label>
                      <input
                        style={inputStyle("email")}
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                      gap: 24,
                      marginBottom: 24,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Telefone</label>
                      <input
                        style={inputStyle("phone")}
                        value={form.phone}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");

                          if (v.length <= 11) {
                            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                            v = v.replace(/(\d)(\d{4})$/, "$1-$2");
                          }

                          setForm({ ...form, phone: v });
                        }}
                        maxLength={15}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused(null)}
                        placeholder="(11) 99999-0000"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Região de Interesse</label>
                      <select
                        style={{
                          ...inputStyle("region"),
                          cursor: "pointer",
                          appearance: "none",
                        }}
                        value={form.region}
                        onChange={(e) =>
                          setForm({ ...form, region: e.target.value })
                        }
                        onFocus={() => setFocused("region")}
                        onBlur={() => setFocused(null)}
                      >
                        <option value="">Selecione a região</option>
                        {REGIONS.filter((r) => r !== "Todos").map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <label style={labelStyle}>Mensagem</label>
                    <textarea
                      style={{
                        ...inputStyle("message"),
                        resize: "vertical",
                        minHeight: 100,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder="Conte-me sobre o imóvel que você procura..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                    style={{
                      width: "100%",
                      padding: "18px",
                      background: "#C8102E",
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.3s",
                      opacity: status === "sending" ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (status !== "sending")
                        e.target.style.background = "#a00d25";
                    }}
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#C8102E")
                    }
                  >
                    {status === "sending"
                      ? "Enviando..."
                      : "Quero ser um Parceiro!"}
                  </button>

                  {status === "error" && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#C8102E",
                        fontSize: 13,
                        marginTop: 16,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Erro ao enviar. Tente novamente.
                    </p>
                  )}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function Footer({ scrollTo }) {
  return (
    <footer
      style={{
        background: "#1a1a1a",
        padding: "64px 32px 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "#C8102E",
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <img
                src={logo}
                alt="Roberta Mancini"
                style={{
                  height: 240,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: 1,
                  }}
                >
                  Roberta Mancini
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 3,
                    color: "#666",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Gerente de Parcerias
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#555",
                lineHeight: 1.7,
                maxWidth: 300,
              }}
            >
              Transformando sonhos em endereços com dedicação, transparência e
              expertise no mercado imobiliário.
            </p>
          </div>

          <div style={{ display: "flex", gap: 48 }}>
            <div>
              <h4
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "#C8102E",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Regiões
              </h4>
              {REGIONS.filter((r) => r !== "Todos").map((r) => (
                <div
                  key={r}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#666",
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
            <div>
              <h4
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "#C8102E",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Links
              </h4>
              {[
                { label: "Início", id: "inicio" },
                { label: "Sobre", id: "sobre" },
                { label: "Empreendimentos", id: "imoveis" },
                { label: "Contato", id: "contato" },
              ].map((link) => (
                <div
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#666",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                  onMouseLeave={(e) => (e.target.style.color = "#666")}
                >
                  {link.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              {
                name: "Instagram",
                url: "https://www.instagram.com/roberta_manciniparcerias/",
                icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
              },
              {
                name: "WhatsApp",
                url: "https://wa.me/5511985202715",
                icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(200,16,46,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#888">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#555",
            }}
          >
            © 2026 Roberta Mancini. Todos os direitos reservados.
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "#444",
              letterSpacing: 1,
            }}
          >
            CRECI 074546-F
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { overflow-x: hidden; }
      ::selection { background: rgba(200,16,46,0.2); color: #1a1a1a; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #f0f0f0; }
      ::-webkit-scrollbar-thumb { background: #C8102E; }
      @keyframes float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
      input::placeholder, textarea::placeholder { color: #ccc; font-weight: 300; }
      select option { font-family: 'DM Sans', sans-serif; }
      
      /* Novas regras para o menu Mobile */
      @media (max-width: 850px) {
        .desktop-menu { display: none !important; }
        .mobile-menu-btn { display: block !important; }
      }
      @media (min-width: 851px) {
        .mobile-menu-btn { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    const handleScroll = () => {
      const sections = ["inicio", "sobre", "imoveis", "contato"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#fff",
        minWidth: 0,
      }}
    >
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Properties />
      <Contact />
      <Footer
        scrollTo={(id) =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
        }
      />
    </div>
  );
}
