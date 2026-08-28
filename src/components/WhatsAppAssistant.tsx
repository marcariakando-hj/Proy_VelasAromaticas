import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Info,
  PhoneCall,
  CheckCheck,
  Flame,
  Palette,
  Package,
  Heart,
  HelpCircle
} from "lucide-react";
import { useStore } from "../context/StoreContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
  recommendHuman?: boolean;
}

// Typo & normalization helper for friendly natural language understanding
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[¿?¡!.,:;()_#\-"']/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export const WhatsAppAssistant: React.FC = () => {
  const { brandConfig, candles, aromas, collaborators } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: `¡Hola! 🕯️✨ Bienvenido a ${brandConfig.brandName}. Soy tu asistente virtual oficial. Con mucho gusto te oriento sobre nuestras velas botánicas artesanales de cera de soja, aromas, precios actualizados, diseños, creadores y opciones de personalización. ¿En qué puedo ayudarte hoy? 🌸🎁`,
      timestamp: "Ahora",
      options: [
        "¿Cuáles son los precios y velas disponibles?",
        "¿Qué aromas o notas tienen?",
        "¿Cómo personalizar con grabado láser?",
        "¿Cómo son los envíos y formas de pago?",
        "¿Quiénes son los jóvenes creadores?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Knowledge Engine with Dynamic Inventory & Typo Tolerance
  const processQuery = (rawQuery: string): { text: string; recommendHuman?: boolean } => {
    const raw = rawQuery.trim();
    const q = normalizeText(raw);

    // Phonetic & typo substitutions
    // e.g. "ke" -> "que", "bela"/"velas", "presio"/"precio", "deseno"/"diseno", "personalisar"/"personalizar", "espesias"/"especias"
    const cleaned = q
      .replace(/\bke\b/g, "que")
      .replace(/\bbela\b/g, "vela")
      .replace(/\bbelas\b/g, "velas")
      .replace(/\bpresio\b/g, "precio")
      .replace(/\bpresios\b/g, "precios")
      .replace(/\bdeseno\b/g, "diseno")
      .replace(/\bdesenos\b/g, "disenos")
      .replace(/\bdesenar\b/g, "disenar")
      .replace(/\bpersonalisar\b/g, "personalizar")
      .replace(/\bpersonalisacion\b/g, "personalizacion")
      .replace(/\bgrabar\b/g, "grabado")
      .replace(/\bespesias\b/g, "especias")
      .replace(/\bcolavorador\b/g, "colaborador")
      .replace(/\baromai\b/g, "aroma");

    // 1. Greetings & Saludos
    if (
      cleaned === "hola" ||
      cleaned === "buenos dias" ||
      cleaned === "buenas tardes" ||
      cleaned === "buenas noches" ||
      cleaned === "buenas" ||
      cleaned === "hey"
    ) {
      return {
        text: `¡Hola! 🕯️✨ Qué alegría saludarte. Cuéntame qué tipo de aroma, vela o detalle personalizado buscas para tu hogar o para regalar, y con gusto te asesoro al instante. 🌸`,
      };
    }

    // 2. Shipping & Payment Policies
    if (
      cleaned.includes("envio") ||
      cleaned.includes("envios") ||
      cleaned.includes("portes") ||
      cleaned.includes("entrega") ||
      cleaned.includes("cuanto tarda") ||
      cleaned.includes("tiempo de entrega")
    ) {
      return {
        text: `📦 [POLÍTICAS DE ENVÍO]\n` +
          `• Realizamos envíos seguros a todo el país. ✨\n` +
          `• Envío GRATIS en compras superiores a ${brandConfig.shippingFreeThreshold}€.\n` +
          `• Coste estándar para pedidos menores: 4.50€.\n` +
          `• Tiempo de preparación artesanal y despacho: 24 a 72 horas en empaque biodegradable y protegido. 🌿`,
      };
    }

    if (
      cleaned.includes("pago") ||
      cleaned.includes("pagar") ||
      cleaned.includes("metodos de pago") ||
      cleaned.includes("tarjeta") ||
      cleaned.includes("transferencia") ||
      cleaned.includes("bizum")
    ) {
      return {
        text: `💳 [MÉTODOS DE PAGO DISPONIBLES]\n` +
          `Aceptamos con total seguridad:\n` +
          `• Tarjeta de crédito y débito (Visa, Mastercard, etc.). 💳\n` +
          `• Transferencia bancaria directa con confirmación inmediata.\n\n` +
          `Todos los pagos están cifrados y garantizados. 🔒`,
      };
    }

    // 3. Customization & Laser Engraving
    if (
      cleaned.includes("personalizar") ||
      cleaned.includes("personalizacion") ||
      cleaned.includes("grabado") ||
      cleaned.includes("laser") ||
      cleaned.includes("tapa") ||
      cleaned.includes("regalo") ||
      cleaned.includes("dedicatoria")
    ) {
      return {
        text: `🎁 [PERSONALIZACIÓN DE VELAS & GRABADO ARTESANAL]\n` +
          `• Módulo "Personalizar": Puedes formular tu propia vela eligiendo la vasija mineral, la mecha (madera o algodón), combinando entre 2 y 5 botánicos aromáticos reales y redactando el mensaje de la etiqueta en tiempo real. 🕯️✨\n` +
          `• Grabado Láser en Tapa de Madera: Puedes grabar nombres, fechas memorables o frases (+4€).\n` +
          `• Envoltura para Regalo Botánica: Papel kraft artesanal, lazo de lino y flores secas (+3€). 🌸\n` +
          `• ¡Explora la sección "Personalizar" en el menú para diseñar tu vela ahora! 🌿`,
      };
    }

    // 4. Brand origin & Ayllu Philosophy
    if (
      cleaned.includes("ayllu") ||
      cleaned.includes("significa") ||
      cleaned.includes("filosofia") ||
      cleaned.includes("manifiesto") ||
      cleaned.includes("historia") ||
      cleaned.includes("nosotros")
    ) {
      return {
        text: `🌿 [NUESTRA ESENCIA AYLLU]\n` +
          `"${brandConfig.aboutDescription}"\n\n` +
          `Ayllu es un concepto ancestral quechua que representa la comunidad viva, el trabajo colectivo y la reciprocidad con la naturaleza. ${brandConfig.aboutDetailedStory} 🕯️✨`,
      };
    }

    // 5. Check if inquiring about specific Artist / Collaborator
    const matchedCollab = collaborators.find((col) => {
      const colNameNorm = normalizeText(col.name);
      return (
        cleaned.includes(colNameNorm) ||
        colNameNorm.split(" ").some((p) => p.length > 3 && cleaned.includes(p))
      );
    });

    if (matchedCollab) {
      return {
        text: `🎨 [FICHA DE CREADOR - ${matchedCollab.name.toUpperCase()}]\n` +
          `• Edad y Ubicación: ${matchedCollab.age} años, ${matchedCollab.location}.\n` +
          `• Disciplina: ${matchedCollab.discipline}.\n` +
          `• Técnica: ${matchedCollab.technique}.\n` +
          `• Inspiración: ${matchedCollab.artistInspiration}.\n` +
          `• Significado del diseño: "${matchedCollab.designMeaning}"\n` +
          (matchedCollab.associatedCandleName
            ? `• Vela ilustrada: ${matchedCollab.associatedCandleName} 🕯️\n`
            : "") +
          `• Cita: "${matchedCollab.quote}" ✨`,
      };
    }

    if (
      cleaned.includes("artista") ||
      cleaned.includes("artistas") ||
      cleaned.includes("creador") ||
      cleaned.includes("creadores") ||
      cleaned.includes("ilustrador") ||
      cleaned.includes("colaborador")
    ) {
      const collabList = collaborators
        .map((c) => `• ${c.name} (${c.age} años, ${c.location}) — ${c.discipline}`)
        .join("\n");
      return {
        text: `🌸 [JÓVENES CREADORES DEL COLECTIVO AYLLU]\n` +
          `Actualmente contamos con ${collaborators.length} artistas colaborando en nuestras colecciones:\n\n` +
          `${collabList}\n\n` +
          `Cada ilustración en nuestras vasijas y empaques lleva su historia y técnica artística. ✨`,
      };
    }

    // 6. Check if inquiring about a specific Candle product by name / partial name
    const matchedCandle = candles.find((c) => {
      const cNameNorm = normalizeText(c.name);
      const cSubNorm = normalizeText(c.subtitle || "");
      return (
        cleaned.includes(cNameNorm) ||
        cNameNorm.split("•").some((part) => part.trim().length > 3 && cleaned.includes(part.trim())) ||
        (cSubNorm && cleaned.includes(cSubNorm))
      );
    });

    if (matchedCandle) {
      return {
        text: `🕯️ [DETALLES DE: ${matchedCandle.name}]\n` +
          `• Precio: ${matchedCandle.price}€\n` +
          `• Disponibilidad: ${matchedCandle.inStock ? "✅ En Stock Disponible" : "❌ Temporalmente Agotada"}\n` +
          `• Subtítulo: ${matchedCandle.subtitle}\n` +
          `• Pirámide Olfativa:\n` +
          `   - Salida: ${matchedCandle.olfactoryPyramid.salida}\n` +
          `   - Corazón: ${matchedCandle.olfactoryPyramid.corazon}\n` +
          `   - Fondo: ${matchedCandle.olfactoryPyramid.fondo}\n` +
          `• Vasija & Mecha: ${matchedCandle.vesselName} • Mecha de madera natural (${matchedCandle.burnHours}h de duración / ${matchedCandle.weightGrams}g).\n` +
          `• Valoración: ${matchedCandle.rating} / 5.0 ⭐ (${matchedCandle.reviewsCount} reseñas verificadas) ✨`,
      };
    }

    // 7. Check if inquiring by Scent Notes (canela, lavanda, sandalo, vainilla, eucalipto, menta, naranja, citricos, jazmin, ambar, etc.)
    const aromaticTerms = [
      "canela", "lavanda", "sandalo", "vainilla", "eucalipto", "menta",
      "naranja", "citrico", "citricos", "cedro", "bergamota", "jazmin",
      "ambar", "rosas", "cafe", "clavo", "cardamomo", "pino", "manzanilla",
      "pachuli", "tonka", "incienso", "mirra"
    ];

    const matchedTerms = aromaticTerms.filter((term) => cleaned.includes(term));

    if (matchedTerms.length > 0) {
      const scentMatches = candles.filter((c) => {
        const fullProfile = normalizeText(
          `${c.name} ${c.subtitle} ${c.olfactoryPyramid.salida} ${c.olfactoryPyramid.corazon} ${c.olfactoryPyramid.fondo} ${c.category} ${c.botanicals?.join(" ") || ""}`
        );
        return matchedTerms.some((term) => fullProfile.includes(term));
      });

      if (scentMatches.length > 0) {
        const matchesList = scentMatches
          .map(
            (c) =>
              `• ${c.name} (${c.price}€) — ${c.subtitle} [${c.inStock ? "✅ Disponible" : "❌ Agotada"}]`
          )
          .join("\n");

        return {
          text: `🌿 [VELAS CON AROMA A ${matchedTerms.join(", ").toUpperCase()}]\n` +
            `Hemos encontrado estas opciones en nuestro catálogo en tiempo real:\n\n` +
            `${matchesList}\n\n` +
            `¿Te gustaría conocer la pirámide olfativa o diseño de alguna de ellas? 🕯️✨`,
        };
      }
    }

    // 8. General Price & Inventory Inquiry
    if (
      cleaned.includes("precio") ||
      cleaned.includes("precios") ||
      cleaned.includes("cuanto cuesta") ||
      cleaned.includes("catalogo") ||
      cleaned.includes("disponibilidad") ||
      cleaned.includes("stock") ||
      cleaned.includes("velas")
    ) {
      const summaryList = candles
        .map(
          (c) =>
            `• ${c.name}: ${c.price}€ — ${c.inStock ? "✅ En Stock" : "❌ Agotada"} (${c.subtitle})`
        )
        .join("\n");

      return {
        text: `🕯️ [INVENTARIO & PRECIOS EN TIEMPO REAL]\n` +
          `Actualmente tenemos las siguientes velas artesanales registradas:\n\n` +
          `${summaryList}\n\n` +
          `Todas están vertidas a mano con 100% cera de soja virgen y mecha de madera crepitante. 🌿✨`,
      };
    }

    // 9. Aromas List
    if (cleaned.includes("aroma") || cleaned.includes("aromas") || cleaned.includes("fragancias") || cleaned.includes("olores")) {
      const aromasList = aromas
        .map((a) => `• ${a.name} (${a.family}) — Notas: ${a.notes.join(", ")}`)
        .join("\n");

      return {
        text: `🌸 [FAMILIAS OLFATIVAS REGISTRADAS]\n` +
          `${aromasList}\n\n` +
          `Utilizamos aceites esenciales puros botánicos y maceraciones naturales. 🕯️`,
      };
    }

    // 10. Materials and Soy Wax
    if (
      cleaned.includes("cera") ||
      cleaned.includes("soja") ||
      cleaned.includes("soya") ||
      cleaned.includes("mecha") ||
      cleaned.includes("ingredientes") ||
      cleaned.includes("materiales") ||
      cleaned.includes("parafina") ||
      cleaned.includes("toxico")
    ) {
      return {
        text: `🌱 [MATERIA PRIMA CONSCIENTE & ECOLÓGICA]\n` +
          `• Cera 100% Soja Virgen: Biodegradable, no emite toxinas ni hollín negro (0% parafina o derivados del petróleo).\n` +
          `• Mechas de Madera FSC: Crepitar suave tipo fogata que relaja y asegura un quemado parejo.\n` +
          `• Vasijas Cerámicas Esmaltadas: Hechas para perdurar y reutilizarse como macetas o tazas de té. 🌿`,
      };
    }

    // 11. Human Advisor & Contact
    if (
      cleaned.includes("humano") ||
      cleaned.includes("asesor") ||
      cleaned.includes("persona") ||
      cleaned.includes("contacto") ||
      cleaned.includes("telefono") ||
      cleaned.includes("whatsapp") ||
      cleaned.includes("ayuda")
    ) {
      return {
        text: `🤝 [ATENCIÓN PERSONALIZADA DIRECTA]\n` +
          `Puedes hablar directamente con nuestro equipo de artesanos y asesores:\n` +
          `• WhatsApp: ${brandConfig.whatsappNumber}\n` +
          `• Teléfono: ${brandConfig.contactPhone}\n` +
          `• Email: ${brandConfig.contactEmail}\n` +
          `Haz clic en el botón de abajo para iniciar la conversación directa. 💬`,
        recommendHuman: true,
      };
    }

    // 12. STRICT FALLBACK MANDATE: If information is NOT registered in database
    return {
      text: `Lo siento, no dispongo de esa información en nuestro catálogo actual. Te recomiendo contactar a un asesor humano mediante el botón flotante de WhatsApp para brindarte atención personalizada.`,
      recommendHuman: true,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate natural response
    setTimeout(() => {
      const response = processQuery(messageText);
      const botMessage: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        recommendHuman: response.recommendHuman,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 380);
  };

  const generateWhatsAppDirectUrl = (customText?: string) => {
    const rawNumber = brandConfig.whatsappNumber.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(
      customText ||
        `¡Hola equipo de ${brandConfig.brandName}! Me gustaría recibir atención y asesoramiento personalizado sobre sus velas aromáticas.`
    );
    return `https://wa.me/${rawNumber}?text=${encodedText}`;
  };

  return (
    <>
      {/* Floating WhatsApp Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {!isOpen && unreadCount > 0 && (
          <div
            onClick={() => setIsOpen(true)}
            className="bg-white text-[#423D33] px-3.5 py-2 rounded-2xl shadow-lg border border-[#E5E0DA] text-xs font-semibold flex items-center gap-2 cursor-pointer animate-fade-in hover:scale-105 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span>¿Dudas sobre velas o aromas? ¡Pregúntame! 🕯️</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer relative"
          aria-label="Abrir Asistente de WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-7 h-7 fill-white" />
          )}

          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D98B68] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 max-h-[580px] h-[520px] bg-[#FAF7F2] rounded-3xl border border-[#E5E0DA] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header styled as WhatsApp Ayllu Concierge */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/30 flex items-center justify-center">
                  <img
                    src={brandConfig.logoUrl}
                    alt={brandConfig.brandName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide flex items-center gap-1.5">
                  <span>Asistente {brandConfig.brandName}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D9C5B2]" />
                </h4>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span>En línea</span> • <span>Catálogo en Tiempo Real</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={generateWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Hablar directamente en WhatsApp Web"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-header Data Policy Badge */}
          <div className="bg-[#EAE4DC] px-3 py-1.5 border-b border-[#E5E0DA] flex items-center justify-between text-[10px] text-[#423D33]/80">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-[#8C7A6B]" />
              <span>Inventario sincronizado automáticamente</span>
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#DCF8C6] text-[#423D33] rounded-tr-xs"
                      : "bg-white text-[#423D33] border border-[#E5E0DA] rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Suggest human advisor button if flagged */}
                  {msg.recommendHuman && (
                    <div className="mt-2.5 pt-2 border-t border-[#E5E0DA] flex flex-col gap-1.5">
                      <a
                        href={generateWhatsAppDirectUrl(
                          "Hola, estuve conversando con el asistente virtual de la tienda y me gustaría consultar directamente con un asesor humano."
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#20bd5a] transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Hablar con un Asesor Humano</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8C7A6B]">
                    <span>{msg.timestamp}</span>
                    {msg.sender === "user" && <CheckCheck className="w-3 h-3 text-[#34B7F1]" />}
                  </div>
                </div>

                {/* Preset quick question pills */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(opt)}
                        className="text-[11px] bg-white hover:bg-[#FAF7F2] text-[#423D33] px-2.5 py-1 rounded-full border border-[#E5E0DA] shadow-2xs transition-all text-left cursor-pointer hover:border-[#8C7A6B]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-white border-t border-[#E5E0DA] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Pregunta sobre aromas, precios, artistas..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-[#F4EFEA] border border-[#E5E0DA] text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-full bg-[#075E54] text-white disabled:opacity-40 hover:bg-[#064d45] transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
