import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


/** Kolory / style */
const GOLD = "#d4af37";
const GOLD_HOVER = "#ffcc33"; // teraz jest używany w klasach

const goldButtonClass = `transition-transform active:scale-[.98] border border-[#d4af37] text-[#d4af37] px-4 py-2 text-sm font-semibold shadow-lg rounded-xl hover:bg-[#d4af37] hover:text-black`;
const whiteButtonClass = `transition-transform active:scale-[.98] bg-white hover:bg-neutral-200 text-black px-6 py-3 font-semibold shadow-lg rounded-2xl`;

/** Opinie */
const REVIEWS: [string, string][] = [
  ["Piotr", "Sympatyczny chłopak, któremu przede wszystkim się chce trenować ludzi takich osób potrzeba pełne zaangażowanie z jego strony przyniosło efekty o których nie śniłem."],
  ["Bartosz", "Profesjonalne podejście trenerskie, zero obijania się, kontrola przy ćwiczeniach. Rezultat powyżej oczekiwania."],
  ["Dominik", "Mateusz to świetny trener personalny, profesjonalny, zaangażowany i motywujący. Dzięki niemu osiągnąłem swoje cele szybciej, niż się spodziewałem. Zdecydowanie polecam!!"],
  ["Maciej", "Serdecznie polecam współpracę z Mateuszem! Treningi są zawsze dobrze zaplanowane, dostosowane do moich celów i możliwości."],
  ["Kamil", "Naprawdę sympatyczny trener mega mi pomógł naprawdę da się z nim dogadać."],
  ["Wojciech", "Serdecznie polecam, dzięki trenerowi Mateuszowi wyszedłem ze swojej strefy komfortu i poprawiłem swoje życie."],
  ["Patrycja", "Pełen profesjonalizm, polecam 😀"],
  ["Sara", "Profesjonalista 💪 polecam z czystym sumieniem ☺️"],
  ["Ksawery", "Mateusz to świetny trener, który nie tylko mega motywuje, ale też układa skuteczne plany."],
  ["Seweryn", "Świetna robota! Trener zrobił mi plan treningowy który naprawdę działa."],
  ["Milena", "Jestem bardzo zadowolona ze współpracy, z miłą chęcią polecam!"],
  ["Miłosz", "Rewelacyjna współpraca! Trener stworzył dla mnie plan treningowy, który działa i daje satysfakcję."]
];

/** Pakiety */
const PACKAGES = [
  { title: "Pakiet Essential", features: ["Raporty co 4 tygodnie", "Pełne prowadzenie treningowe", "Monitorowanie diety"] },
  { title: "Pakiet Essential Plus", features: ["Raporty co 2 tygodnie", "Pełne prowadzenie treningowe", "Monitorowanie diety", "20% zniżki na e-booki", "Analiza psychologiczna stylu motywacji", "Kontakt w razie pytań"] },
  { title: "Pakiet PRO", features: ["Raporty co tydzień", "Pełne prowadzenie treningowe", "Monitorowanie diety", "E-book gratis", "Analiza psychologiczna stylu motywacji", "Priorytetowy kontakt"] }
];

/** Produkty (e-booki) */
const PRODUCTS = [
  { 
    id: 1, 
    title: "7 mitów o hipertrofii mięśniowej, które blokują Twój progres", 
    desc: "...", 
    priceCents: 8900, 
    image: "/assets/ebook1.png" 
  },
  { 
    id: 2, 
    title: "Jak jeść smacznie, zdrowo i skutecznie – bez restrykcyjnych diet", 
    desc: "...", 
    priceCents: 8900, 
    image: "/assets/ebook2.png" 
  }
];


/** Utils */
function formatPLN(cents: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(cents / 100);
}

/** Hook: sprawdzanie czy element jest w widoku */
function useInView(ref: React.RefObject<HTMLElement>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Komponent animujący liczby */
function CountUp({ end, duration = 1.6, suffix = "+" }: { end: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null!);
  const start = useRef<number>(null!);
  const [val, setVal] = useState(0);
  const holderRef = useRef<HTMLDivElement>(null!);
  const inView = useInView(holderRef, "-20% 0px");

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const step = (ts: number) => {
      if (start.current == null) start.current = ts;
      const p = Math.min(1, (ts - start.current) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, inView]);

  return (
    <div ref={holderRef}>
      <span ref={ref}>{val}</span>
      <span>{suffix}</span>
    </div>
  );
}

export default function App() {
  const [isHovering, setIsHovering] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null!);

  type CartItem = { id: number; title: string; priceCents: number; qty: number };
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    let raf = 0;
    const speed = 0.35;
    const step = () => {
      const el = marqueeRef.current;
      if (el && !isHovering) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isHovering]);

  const addToCart = (productId: number) => {
    const p = PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === p.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id: p.id, title: p.title, priceCents: p.priceCents, qty: 1 }];
    });
    setCartOpen(true);
  };
  const inc = (id: number) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id: number) =>
    setCart((prev) => prev.flatMap((i) => (i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));
  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));
  const subtotal = cart.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

  const checkout = async () => {
    const payload = {
      items: cart.map((i) => ({ id: i.id, qty: i.qty })),
      amountCents: subtotal,
      method: "przelewy24"
    };
    console.log("Checkout payload (Przelewy24):", payload);
    alert("Symulacja płatności Przelewy24 — payload w konsoli.");
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/70 border-b border-neutral-800">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-semibold text-lg">
  <img src="/assets/favicon.png" alt="Logo" className="h-12 w-12 rounded-full border border-[#d4af37]" />
  Mateusz Garbas
</a>

         <div className="hidden md:flex items-center gap-8 text-lg font-sans tracking-wide font-semibold">
  <a 
    href="#oferta" 
    className="transition-colors duration-200 hover:text-[#d4af37]"
  >
    OFERTA
  </a>
  <a 
    href="#ebooki" 
    className="transition-colors duration-200 hover:text-[#d4af37]"
  >
    E-BOOKI
  </a>
  <a 
    href="#opinie" 
    className="transition-colors duration-200 hover:text-[#d4af37]"
  >
    OPINIE
  </a>
  <a 
    href="#faq" 
    className="transition-colors duration-200 hover:text-[#d4af37]"
  >
    FAQ
  </a>
</div>

          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative rounded-2xl border border-neutral-700 px-4 py-2 text-sm hover:border-[#d4af37]">
              Koszyk
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-white text-black rounded-full px-2 py-0.5">
                  {cart.reduce((n, i) => n + i.qty, 0)}
                </span>
              )}
            </button>
            <a href="#konsultacja" className={goldButtonClass}>Umów konsultację</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold leading-tight text-center md:text-left">
              Schudnij i zbuduj formę życia w 90 dni
            </motion.h1>
            <p className="mt-4 text-neutral-300 max-w-prose text-center md:text-left">
              Prowadzenie treningowe online dopasowane do Ciebie. Plany, analiza postępów i stałe wsparcie.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap justify-center md:justify-start">
  <a 
    href="#konsultacja" 
    className={`${goldButtonClass} text-xl px-8 py-4 font-bold`}
  >
    Umów konsultację
  </a>
  <a 
    href="#ebooki" 
    className="rounded-2xl border border-neutral-700 px-8 py-4 text-xl font-bold hover:border-[#d4af37]"
  >
    Zobacz e-booki
  </a>
</div>

          </div>
          <div className="relative">
           <img 
  src="/assets/trener.jpg" 
  alt="Mateusz Garbas" 
  className="w-full aspect-[4/5] object-cover rounded-3xl border border-neutral-700" 
/>

        </div>
        </div>
      </section>

      {/* DLACZEGO */}
      <section id="dlaczego" className="py-12 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
<div className="text-center">
  <h2
    className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
    style={{
      color: GOLD,
      background: "rgba(255, 255, 255, 0.05)",
      border: `1px solid ${GOLD}`
    }}
  >
    Dlaczego warto mi zaufać
  </h2>
</div>

          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-bold" style={{ color: GOLD }}>
                  <CountUp end={6} suffix="+" />
                </span>
                <span>lat doświadczenia</span>
              </div>
              <div className="text-neutral-300 text-sm mt-1">Setki godzin na sali i w prowadzeniu online.</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-bold" style={{ color: GOLD }}>
                  <CountUp end={43} suffix="+" />
                </span>
                <span>zadowolonych klientów</span>
              </div>
              <div className="text-neutral-300 text-sm mt-1">Realne metamorfozy i utrzymane efekty.</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold">Gwarancja satysfakcji</div>
              <div className="text-neutral-300 text-sm mt-1">Brak postępów według planu = miesiąc gratis.</div>
            </div>
          </div>
        </div>
      </section>
      {/* JAK WYGLĄDA WSPÓŁPRACA */}
      <section id="kroki" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
<div className="text-center">
  <h2
    className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
    style={{
      color: GOLD,
      background: "rgba(255, 255, 255, 0.05)",
      border: `1px solid ${GOLD}`
    }}
  >
Jak wygląda wsółpraca krok po kroku  
</h2>
</div>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              { t: "Konsultacja wstępna", d: "Poznajemy Twoje cele i możliwości." },
              { t: "Audyt i plan", d: "Analiza nawyków, dobór ćwiczeń i strategii." },
              { t: "Realizacja", d: "Wdrażasz plan, uczysz się techniki i nawyków." },
              { t: "Monitoring", d: "Raporty wg pakietu i korekty planu." }
            ].map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: GOLD }}>{idx + 1}</div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-sm text-neutral-300 mt-1">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
<div className="text-center">
  <h2
    className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
    style={{
      color: GOLD,
      background: "rgba(255, 255, 255, 0.05)",
      border: `1px solid ${GOLD}`
    }}
  >
    Oferta
  </h2>
</div>
          <p className="text-neutral-300 mt-2 max-w-prose mx-auto text-center">
            Wszystkie opcje zawierają pełne prowadzenie treningowe online oraz monitorowanie diety. Do każdego pakietu dorzucam gwarancję satysfakcji – jeśli nie zrobisz postępu wg planu i raportów, otrzymasz kolejny miesiąc gratis pod moją opieką.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {PACKAGES.map((p) => (
              <div key={p.title} className="rounded-2xl border border-neutral-800 p-6 pb-12 bg-neutral-900/40">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <a href="#konsultacja" className={whiteButtonClass}>Zacznij teraz</a>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela porównawcza */}
          <div className="mt-12 overflow-x-auto">
            <table className="min-w-full text-sm border border-neutral-800 rounded-2xl overflow-hidden">
              <thead className="bg-neutral-900/60">
                <tr>
                  <th className="p-3 text-left">Funkcja</th>
                  {PACKAGES.map((p) => (
                    <th key={p.title} className="p-3 text-left">{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Raporty", v: ["co 4 tyg.", "co 2 tyg.", "co tydzień"] },
                  { f: "Prowadzenie treningowe", v: ["✓", "✓", "✓"] },
                  { f: "Monitorowanie diety", v: ["✓", "✓", "✓"] },
                  { f: "Zniżka na e-booki / e-book", v: ["—", "20%", "E-book gratis"] },
                  { f: "Analiza stylu motywacji", v: ["—", "✓", "✓"] },
                  { f: "Kontakt priorytetowy", v: ["—", "—", "✓"] }
                ].map((row, i) => (
                  <tr key={i} className="odd:bg-neutral-950">
                    <td className="p-3 border-t border-neutral-800">{row.f}</td>
                    {row.v.map((val, j) => (
                      <td key={j} className="p-3 border-t border-neutral-800">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="#konsultacja" className={goldButtonClass}>Umów konsultację</a>
          </div>
        </div>
      </section>
      {/* WIDEO O MNIE */}
      <section id="o-mnie-wideo" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>Poznaj mnie lepiej</h2>
          <p className="text-neutral-300 mt-2">Kilka słów o mnie, moim podejściu do treningów i jak wygląda współpraca krok po kroku.</p>
          <div className="mt-8 aspect-video w-full rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/40">
            <iframe
            src="https://www.youtube.com/embed/8AwVRlXsxlA?si=1x--g3CMQzubmkEK"              title="O mnie - Mateusz Garbas"
              className="w-full h-full"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4">
            <a href="#konsultacja" className={goldButtonClass}>Umów konsultację</a>
          </div>
        </div>
      </section>

      {/* KONSULTACJA */}
      <section id="konsultacja" className="py-16 border-t border-neutral-800">
  <div className="mx-auto max-w-6xl px-4">
    <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>
      Umów konsultację
    </h2>
    <div className="mt-8 rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/60 shadow-lg p-3 max-w-3xl mx-auto">
  <iframe
    title="Calendly"
    src="https://calendly.com/mateuszgarbas/45min?hide_event_type_details=1&hide_gdpr_banner=1"
    className="w-full h-[500px] rounded-xl"
    style={{ backgroundColor: "white", border: "none" }}
  />
</div>
  </div>
</section>


      {/* E-BOOKI */}
      <section id="ebooki" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
<div className="text-center">
  <h2
    className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
    style={{
      color: GOLD,
      background: "rgba(255, 255, 255, 0.05)",
      border: `1px solid ${GOLD}`
    }}
  >
E-Booki  
</h2>
</div>
          <p className="text-neutral-300 mt-2 max-w-prose mx-auto text-center">Przeczytaj i wdrażaj od razu.</p>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {PRODUCTS.map((e) => (
              <div key={e.id} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 flex flex-col justify-between h-full">
                <div>
<img 
  src={e.image} 
  alt={`Okładka e-booka: ${e.title}`} 
  className="w-40 aspect-[2/3] object-cover rounded-xl border border-neutral-700 mx-auto" 
/>


                  <h3 className="mt-4 text-xl font-semibold">{e.title}</h3>
                  <p className="text-neutral-300 mt-1 text-sm">{e.desc}</p>
                  <ul className="list-disc list-inside mt-3 text-sm text-neutral-400">
                    <li>Szybsze efekty</li>
                    <li>Proste i praktyczne wskazówki</li>
                    <li>Bez zbędnych restrykcji</li>
                  </ul>
                  <div className="mt-3 font-semibold">{formatPLN(e.priceCents)}</div>
                </div>
                <div className="mt-10">
                  <button onClick={() => addToCart(e.id)} className={whiteButtonClass}>Dodaj do koszyka</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* OPINIE */}
      <section id="opinie" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
<div className="text-center">
  <h2
    className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
    style={{
      color: GOLD,
      background: "rgba(255, 255, 255, 0.05)",
      border: `1px solid ${GOLD}`
    }}
  >
OPINIE
  </h2>
</div>
          <div
            ref={marqueeRef}
            className="relative mt-8 overflow-x-hidden overflow-y-visible"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            <div className="flex gap-4 w-max">
              {[...REVIEWS, ...REVIEWS].map(([name, text], idx) => (
                <div key={idx} className="inline-block align-top">
                  <div className="w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 h-full">
                    <p className="text-sm text-neutral-300">“{text}”</p>
                    <div className="mt-3 text-xs text-neutral-400">— {name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>Najczęstsze pytania</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[
              ["Czy współpraca jest dla początkujących?", "Tak. Na starcie robię audyt, a plany dostosowuję do Twojego poziomu i sprzętu."],
              ["Jak wygląda kontakt?", "W zależności od pakietu: raporty co 4/2/1 tydzień + stały kontakt w razie pytań (Essential Plus/PRO)."],
              ["Czy mogę trenować w domu?", "Tak – dostosowuję plan do dostępnego sprzętu i czasu, przygotuję również alternatywy ćwiczeń."],
              ["Jak wygląda pierwszy miesiąc współpracy?", "Start od audytu, plan + edukacja, cotygodniowy/2-tyg./4-tyg. raport wg pakietu, modyfikacje na bieżąco."],
              ["Jak długo trwa współpraca?", "Minimalnie 3 miesiące, by zobaczyć pełne efekty."],
              ["Jak płacę?", "Płatności online przez Przelewy24. Po opłaceniu dostaniesz link do pobrania e-booka."]
            ].map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
                <div className="font-semibold">{q}</div>
                <div className="mt-1 text-neutral-300 text-sm">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STOPKA */}
      <footer className="py-10 border-t border-neutral-800 text-sm">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-neutral-400">© {new Date().getFullYear()} Mateusz Garbas. Wszelkie prawa zastrzeżone.</div>
          <div className="flex gap-4 text-neutral-400">
            <a href="#" className="hover:opacity-80">Regulamin</a>
            <a href="#" className="hover:opacity-80">Polityka prywatności</a>
            <a href="#" className="hover:opacity-80">Wysyłka i płatności</a>
          </div>
        </div>
      </footer>

      {/* CTA (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-neutral-900/80 backdrop-blur border-t border-neutral-800 p-3">
        <div className="max-w-6xl mx-auto px-2">
          <a href="#konsultacja" className={goldButtonClass + " block text-center"}>Umów konsultację</a>
        </div>
      </div>

      {/* STICKY KOSZYK (desktop) */}
      <button onClick={() => setCartOpen(true)} className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 rounded-2xl px-4 py-3 bg-white text-black shadow-lg">
        <span>Koszyk</span>
        {cart.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs rounded-full bg-black text-white">
            {cart.reduce((n, i) => n + i.qty, 0)}
          </span>
        )}
      </button>

      {/* DRAWER KOSZYKA */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-800 p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Twój koszyk</h3>
              <button onClick={() => setCartOpen(false)} className="text-neutral-400 hover:text-white">Zamknij</button>
            </div>
            <div className="mt-4 space-y-4 overflow-auto">
              {cart.length === 0 && <div className="text-neutral-400">Koszyk jest pusty</div>}
              {cart.map((i) => (
                <div key={i.id} className="flex items-start justify-between gap-3 rounded-xl border border-neutral-800 p-4">
                  <div className="text-sm">
                    <div className="font-medium">{i.title}</div>
                    <div className="text-neutral-400 mt-1">{formatPLN(i.priceCents)} × {i.qty}</div>
                    <div className="text-neutral-200 mt-1">Suma: {formatPLN(i.priceCents * i.qty)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => dec(i.id)} className="px-2 py-1 rounded border border-neutral-700">−</button>
                    <button onClick={() => inc(i.id)} className="px-2 py-1 rounded border border-neutral-700">+</button>
                    <button onClick={() => removeItem(i.id)} className="px-2 py-1 rounded border border-red-700 text-red-400">Usuń</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between text-lg font-semibold">
                <div>Razem</div>
                <div>{formatPLN(subtotal)}</div>
              </div>
              <button
                onClick={checkout}
                disabled={cart.length === 0}
                className={`${goldButtonClass} w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Przejdź do płatności (Przelewy24)
              </button>
              <div className="mt-4 flex gap-3 items-center justify-center opacity-80">
                <img src="/assets/przelewy24.png" alt="Przelewy24" className="h-6" />
                <img src="/assets/visa.png" alt="Visa" className="h-6" />
                <img src="/assets/mastercard.png" alt="Mastercard" className="h-6" />
              </div>
            </div>
          </aside>
        </div>
      )}

     {/* Pływające przyciski Messengera i Instagrama */}
{!cartOpen && (
  <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
    <a
      href="https://m.me/61569722611144"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
      aria-label="Wyślij wiadomość na Messenger"
    >
      <img src="/assets/mess.png" alt="Messenger" className="w-8 h-8" />
    </a>
    <a
      href="https://instagram.com/mateusz.garbas"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
      aria-label="Otwórz Instagram"
    >
      <img src="/assets/instagram.png" alt="Instagram" className="w-8 h-8" />
    </a>
  </div>
)}



    </div>
  );
}

