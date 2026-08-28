import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Gift,
  Truck,
  Check,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  CreditCard,
  Building2,
  Smartphone,
  Upload,
  FileCheck,
  AlertCircle,
  Copy,
  CheckCircle2,
  Lock,
  ChevronDown,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { CartItem } from "../types";
import { useStore } from "../context/StoreContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

type PaymentMethodType = "transferencia" | "tarjeta" | "digital";
type DigitalSubtype = "bizum" | "paypal" | "apple_google";

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { brandConfig, currentUser, createOrder } = useStore();

  const [giftNote, setGiftNote] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderCode, setCompletedOrderCode] = useState<string>("");

  // Customer shipping details
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || "");
  const [customerCity, setCustomerCity] = useState(currentUser?.city || "Madrid");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "+34 600 000 000");

  // Payment Selection States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("tarjeta");
  const [digitalSubtype, setDigitalSubtype] = useState<DigitalSubtype>("bizum");

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Bank Transfer Receipt Upload State
  const [uploadedReceipt, setUploadedReceipt] = useState<{
    name: string;
    size: string;
    previewUrl?: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Digital Wallet States
  const [bizumPhone, setBizumPhone] = useState(currentUser?.phone || "+34 600 000 000");

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    let itemPrice = item.candle.price;
    if (item.customEngraving) itemPrice += 4;
    if (item.giftWrap) itemPrice += 3;
    return acc + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = brandConfig.shippingFreeThreshold || 45;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 4.5;
  const total = subtotal + shippingCost;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM/YY)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Detect Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^3[47]/.test(clean)) return "Amex";
    return "Tarjeta";
  };

  // Copy IBAN Helper
  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith("image/");
      setUploadedReceipt({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isImg = file.type.startsWith("image/");
      setUploadedReceipt({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      });
    }
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let methodLabel = "Tarjeta de Crédito / Débito";
    if (paymentMethod === "transferencia") {
      methodLabel = `Transferencia Bancaria Directa ${uploadedReceipt ? "(Comprobante adjunto)" : "(Pendiente de comprobante)"}`;
    } else if (paymentMethod === "digital") {
      if (digitalSubtype === "bizum") methodLabel = `Bizum (${bizumPhone})`;
      else if (digitalSubtype === "paypal") methodLabel = "PayPal Express";
      else methodLabel = "Apple Pay / Google Pay";
    }

    // Register real order in centralized store
    const newOrder = createOrder({
      userId: currentUser?.id,
      customerName: customerName || "Cliente Ayllu",
      customerEmail: customerEmail || "cliente@email.com",
      customerPhone: customerPhone || "+34 600 000 000",
      shippingAddress: customerAddress || "Dirección de Entrega",
      shippingCity: customerCity || "España",
      items: cartItems,
      subtotal,
      shippingCost,
      total,
      status: paymentMethod === "transferencia" && !uploadedReceipt ? "Pendiente" : "En Elaboración",
      paymentMethod: methodLabel,
      notes: giftNote,
    });

    setCompletedOrderCode(newOrder.id);

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#8C7A6B", "#4A4541", "#608058", "#F2EDE7", "#D98B68"],
      });
    } catch {
      // Confetti fallback
    }
    setOrderComplete(true);
  };

  const handleCloseAll = () => {
    setOrderComplete(false);
    setIsCheckingOut(false);
    setUploadedReceipt(null);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2D2824]/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-lg bg-[#FDFBF9] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E0DA] relative"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E0DA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8C7A6B]" />
            <h2 className="font-serif text-lg font-normal text-[#423D33]">
              {isCheckingOut ? "Finalizar Compra & Pasarela" : `Cesta de ${brandConfig.brandName}`}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F2EDE7] text-[#423D33] border border-[#E5E0DA]">
              {cartItems.reduce((a, b) => a + b.quantity, 0)} {cartItems.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2EDE7] hover:bg-[#E5E0DA] text-[#423D33] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Cerrar cesta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {!orderComplete && (
          <div className="px-5 py-3 bg-[#F2EDE7] border-b border-[#E5E0DA] text-xs">
            <div className="flex items-center justify-between mb-1 text-[11px] font-medium text-[#423D33]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8C7A6B]" />
                {remainingForFreeShipping === 0
                  ? "¡Envío estándar GRATIS conseguido!"
                  : `Añade ${remainingForFreeShipping.toFixed(2)} € para Envío Gratis`}
              </span>
              <span className="font-bold text-[10px]">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E5E0DA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8C7A6B] rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderComplete ? (
            /* ORDER SUCCESS VIEW */
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#608058]/20 text-[#608058] flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-normal text-[#423D33]">
                  ¡Pedido Confirmado con Éxito!
                </h3>
                <p className="text-xs text-[#8C7A6B] font-bold">
                  Código de seguimiento: {completedOrderCode}
                </p>
              </div>

              <p className="text-xs text-[#423D33]/75 max-w-sm mx-auto leading-relaxed">
                Hemos enviado el recibo detallado a <strong>{customerEmail || "tu correo"}</strong>. Tu pedido ha sido asignado para su elaboración artesanal en {brandConfig.brandName}.
              </p>

              {/* Order Summary Confirmation Card */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] text-xs text-[#423D33] text-left space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-2">
                  <span className="font-bold text-[#8C7A6B] uppercase text-[10px] tracking-wider">
                    Resumen de Entrega
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#608058]/15 text-[#608058] font-bold">
                    {paymentMethod === "transferencia" && !uploadedReceipt ? "Pendiente Comprobante" : "En Preparación"}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p><strong>Destinatario:</strong> {customerName}</p>
                  <p><strong>Dirección:</strong> {customerAddress}, {customerCity}</p>
                  <p><strong>Forma de Pago:</strong> {
                    paymentMethod === "transferencia"
                      ? "Transferencia Bancaria Directa (Triodos Bank)"
                      : paymentMethod === "tarjeta"
                      ? `Tarjeta Bancaria (${cardNumber ? `•••• ${cardNumber.slice(-4)}` : "Visa/Mastercard"})`
                      : `Billetera Digital (${digitalSubtype.toUpperCase()})`
                  }</p>
                  {uploadedReceipt && (
                    <p className="text-[#608058] flex items-center gap-1 text-[11px] font-semibold">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Comprobante recibido: {uploadedReceipt.name}</span>
                    </p>
                  )}
                  <p className="pt-1.5 border-t border-[#E5E0DA] flex justify-between font-serif text-sm font-bold">
                    <span>Total Abonado:</span>
                    <span>{total.toFixed(2)} €</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="w-full py-3.5 rounded-full bg-[#4A4541] hover:bg-[#35312E] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Volver a la Tienda
              </button>
            </div>
          ) : isCheckingOut ? (
            /* CHECKOUT & PAYMENT FORM */
            <form onSubmit={handleFinishOrder} className="space-y-5 text-xs">
              {/* Back to Cart & Title */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E0DA]">
                <span className="font-serif font-bold text-sm text-[#423D33]">
                  1. Datos de Envío & Facturación
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-[11px] text-[#8C7A6B] hover:text-[#423D33] underline cursor-pointer"
                >
                  Volver a la cesta
                </button>
              </div>

              {/* Customer Shipping Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Lucía Morales"
                    className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                      Dirección de Entrega *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Calle, número, piso"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                      Ciudad & CP *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="Madrid, 28001"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                  />
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION BLOCK */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-2">
                  <span className="font-serif font-bold text-sm text-[#423D33] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#608058]" />
                    <span>2. Forma de Pago Segura</span>
                  </span>
                  <span className="text-[10px] text-[#608058] font-bold">Cifrado SSL 256-bit</span>
                </div>

                {/* 3 Payment Options Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Option 1: Tarjeta */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("tarjeta")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                      paymentMethod === "tarjeta"
                        ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                        : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#423D33]" />
                    <span className="font-semibold text-[11px] text-[#423D33] leading-tight">
                      Tarjeta
                    </span>
                    <span className="text-[9px] text-[#8C7A6B]">Visa, MC, Amex</span>
                  </button>

                  {/* Option 2: Transferencia Bancaria */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("transferencia")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                      paymentMethod === "transferencia"
                        ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                        : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#423D33]" />
                    <span className="font-semibold text-[11px] text-[#423D33] leading-tight">
                      Transferencia
                    </span>
                    <span className="text-[9px] text-[#8C7A6B]">Pago Directo</span>
                  </button>

                  {/* Option 3: Billeteras Digitales / Bizum / PayPal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("digital")}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                      paymentMethod === "digital"
                        ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                        : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#423D33]" />
                    <span className="font-semibold text-[11px] text-[#423D33] leading-tight">
                      Bizum / PayPal
                    </span>
                    <span className="text-[9px] text-[#8C7A6B]">Pago Rápido</span>
                  </button>
                </div>

                {/* PAYMENT METHOD DETAIL PANELS */}
                {/* 1. TARJETA DE CRÉDITO / DÉBITO FORM */}
                {paymentMethod === "tarjeta" && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E0DA] space-y-3 animate-fade-in shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#423D33] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#8C7A6B]" />
                        <span>Pasarela de Pago con Tarjeta</span>
                      </span>
                      {/* Accepted Card Badges */}
                      <div className="flex items-center gap-1 text-[9px] font-bold text-[#8C7A6B]">
                        <span className="px-1.5 py-0.5 rounded bg-[#F2EDE7] border border-[#E5E0DA]">VISA</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#F2EDE7] border border-[#E5E0DA]">MC</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#F2EDE7] border border-[#E5E0DA]">AMEX</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">
                        Número de Tarjeta
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• 8921"
                          maxLength={19}
                          className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-[#FDFBF9] text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-bold text-[#8C7A6B]">
                          {cardNumber.length > 0 ? getCardBrand(cardNumber) : ""}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">
                        Titular de la Tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Nombre tal como aparece en el plástico"
                        className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-[#FDFBF9] text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">
                          Caducidad (MM/AA)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-[#FDFBF9] text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1 flex items-center justify-between">
                          <span>CVC / CVV</span>
                          <span className="text-[9px] text-[#8C7A6B] font-normal">3 o 4 dígitos</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-[#FDFBF9] text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TRANSFERENCIA BANCARIA DIRECTA CON CARGA DE COMPROBANTE */}
                {paymentMethod === "transferencia" && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5E0DA] space-y-3.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#423D33] flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#8C7A6B]" />
                        <span>Instrucciones de Transferencia Bancaria</span>
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#608058]/15 text-[#608058] font-bold">
                        Sin comisiones
                      </span>
                    </div>

                    <p className="text-[11px] text-[#423D33]/75 leading-relaxed">
                      Realiza la transferencia desde tu banca online con los siguientes datos oficiales de {brandConfig.brandName}:
                    </p>

                    {/* Bank Info Box */}
                    <div className="p-3 bg-white rounded-xl border border-[#E5E0DA] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8C7A6B]">Entidad Bancaria:</span>
                        <span className="font-semibold text-[#423D33]">Triodos Bank / Banca Ética</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#8C7A6B]">Beneficiario:</span>
                        <span className="font-semibold text-[#423D33]">AYLLU ARTESANAL S.L.</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#E5E0DA]/60">
                        <span className="text-[#8C7A6B]">IBAN:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono font-bold text-[#423D33] text-[10px]">
                            ES91 2100 0418 4502 0005 1234
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyIban("ES9121000418450200051234")}
                            className="p-1 text-[#8C7A6B] hover:text-[#423D33] cursor-pointer"
                            title="Copiar IBAN"
                          >
                            {copiedIban ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#608058]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#8C7A6B]">Concepto:</span>
                        <span className="font-semibold text-[#8C7A6B]">
                          AYLLU - {customerName ? customerName.slice(0, 12) : "PEDIDO"}
                        </span>
                      </div>
                    </div>

                    {/* RECEIPT UPLOAD ZONE (DRAG & DROP) */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-[#8C7A6B] uppercase">
                        Carga de Comprobante / Recibo de Pago (Opcional)
                      </span>

                      {uploadedReceipt ? (
                        <div className="p-3 bg-white rounded-xl border border-[#608058]/50 flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {uploadedReceipt.previewUrl ? (
                              <img
                                src={uploadedReceipt.previewUrl}
                                alt="Comprobante"
                                className="w-8 h-8 rounded-lg object-cover border border-[#E5E0DA]"
                              />
                            ) : (
                              <FileCheck className="w-7 h-7 text-[#608058]" />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-[#423D33] truncate">
                                {uploadedReceipt.name}
                              </p>
                              <span className="text-[10px] text-[#608058]">
                                {uploadedReceipt.size} • Listo para verificar
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedReceipt(null)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer ml-2"
                          >
                            Quitar
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`p-4 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer bg-white ${
                            isDragging
                              ? "border-[#8C7A6B] bg-[#FAF7F2]"
                              : "border-[#E5E0DA] hover:border-[#8C7A6B]/50"
                          }`}
                        >
                          <input
                            type="file"
                            id="receipt-file-input"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="receipt-file-input" className="cursor-pointer block space-y-1">
                            <Upload className="w-5 h-5 text-[#8C7A6B] mx-auto" />
                            <p className="text-xs font-semibold text-[#423D33]">
                              Arrastra tu comprobante o haz clic para seleccionarlo
                            </p>
                            <p className="text-[10px] text-[#8C7A6B]">
                              Formatos aceptados: JPG, PNG o PDF (Máx. 10MB)
                            </p>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. BILLETERAS DIGITALES (BIZUM / PAYPAL / WALLETS) */}
                {paymentMethod === "digital" && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E0DA] space-y-3.5 animate-fade-in shadow-2xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDigitalSubtype("bizum")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          digitalSubtype === "bizum"
                            ? "bg-[#00828A] text-white shadow-xs"
                            : "bg-[#F2EDE7] text-[#423D33] hover:bg-[#E5E0DA]"
                        }`}
                      >
                        Bizum
                      </button>
                      <button
                        type="button"
                        onClick={() => setDigitalSubtype("paypal")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          digitalSubtype === "paypal"
                            ? "bg-[#003087] text-white shadow-xs"
                            : "bg-[#F2EDE7] text-[#423D33] hover:bg-[#E5E0DA]"
                        }`}
                      >
                        PayPal
                      </button>
                      <button
                        type="button"
                        onClick={() => setDigitalSubtype("apple_google")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          digitalSubtype === "apple_google"
                            ? "bg-[#111111] text-white shadow-xs"
                            : "bg-[#F2EDE7] text-[#423D33] hover:bg-[#E5E0DA]"
                        }`}
                      >
                        Apple / GPay
                      </button>
                    </div>

                    {digitalSubtype === "bizum" && (
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5E0DA] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#00828A]">Pago Instantáneo Bizum</span>
                          <span className="text-[10px] text-[#8C7A6B]">Sin esperas</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#8C7A6B] uppercase mb-1">
                            Número de Teléfono Móvil
                          </label>
                          <input
                            type="tel"
                            required
                            value={bizumPhone}
                            onChange={(e) => setBizumPhone(e.target.value)}
                            placeholder="+34 600 000 000"
                            className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#00828A] outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-[#423D33]/70">
                          Recibirás una notificación en la app de tu banco para autorizar el cargo de {total.toFixed(2)} €.
                        </p>
                      </div>
                    )}

                    {digitalSubtype === "paypal" && (
                      <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#003087]/20 text-center space-y-2">
                        <p className="text-xs text-[#423D33]">
                          Completa tu compra de forma rápida y protegida con tu cuenta PayPal.
                        </p>
                        <div className="inline-block py-2 px-6 rounded-full bg-[#FFC439] text-[#003087] font-bold text-xs tracking-wider shadow-2xs">
                          Pagar con PayPal Express
                        </div>
                      </div>
                    )}

                    {digitalSubtype === "apple_google" && (
                      <div className="p-4 bg-[#F8F9FA] rounded-xl border border-black/10 text-center space-y-2">
                        <p className="text-xs text-[#423D33]">
                          Autenticación biométrica con un solo toque desde tu dispositivo.
                        </p>
                        <div className="inline-block py-2.5 px-6 rounded-full bg-black text-white font-bold text-xs tracking-wider shadow-xs">
                          Pay con Touch / Face ID
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Notes / Gift Message */}
              <div>
                <label className="block text-[11px] font-bold text-[#8C7A6B] uppercase mb-1">
                  Notas de Fabricación o Dedicatoria
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Instrucciones para el maestro cerero o empaque..."
                  className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:ring-1 focus:ring-[#8C7A6B] outline-none"
                />
              </div>

              {/* Security Banner */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E5E0DA] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#423D33]">
                  <ShieldCheck className="w-4 h-4 text-[#608058]" />
                  <span>Compromiso de Elaboración Ayllu</span>
                </div>
                <p className="text-[10px] text-[#8C7A6B]">
                  100% Cera de Soja Pura, esencias botánicas libres de parabenos y apoyo a jóvenes artistas.
                </p>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#4A4541] hover:bg-[#35312E] text-white text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Confirmar & Abonar • {total.toFixed(2)} €</span>
                <PackageCheck className="w-4 h-4 text-[#D9C5B2]" />
              </button>
            </form>
          ) : cartItems.length === 0 ? (
            /* EMPTY CART VIEW */
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F2EDE7] text-[#8C7A6B] flex items-center justify-center mx-auto border border-[#E5E0DA]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-normal text-[#423D33]">
                Tu cesta está vacía
              </h3>
              <p className="text-xs text-[#423D33]/70 max-w-xs mx-auto">
                Explora nuestras velas botánicas o diseña tu creación personalizada en {brandConfig.brandName}.
              </p>
            </div>
          ) : (
            /* CART ITEMS LIST WITH DETAILED BREAKDOWN */
            cartItems.map((item, index) => {
              const isBespoke =
                item.candle.category === "Personalizada" ||
                item.candle.id.includes("bespoke") ||
                Boolean(item.customDetails) ||
                Boolean(item.candle.waxColorName);

              return (
                <div
                  key={index}
                  className="p-4 bg-white rounded-3xl border border-[#E5E0DA] shadow-2xs space-y-3"
                >
                  {/* Top line: image + title + remove */}
                  <div className="flex gap-3 items-start">
                    <img
                      src={item.candle.image}
                      alt={item.candle.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover bg-[#F2EDE7] shrink-0 border border-[#E5E0DA]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-bold text-[#423D33] truncate">
                          {item.candle.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-[#423D33]/40 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#8C7A6B] truncate">
                        {item.candle.subtitle || item.candle.tagline}
                      </p>
                    </div>
                  </div>

                  {/* DETAILED BESPOKE BREAKDOWN CARD */}
                  {isBespoke ? (
                    <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] space-y-2 text-[11px]">
                      <div className="flex items-center justify-between border-b border-[#E5E0DA]/70 pb-1.5">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C7A6B] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#D98B68]" />
                          <span>Desglose de Formulación Artesanal</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#423D33]">320g • 65h</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 text-[10px] sm:text-[11px]">
                        {/* Vasija */}
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C7A6B]">🏺 Vasija Mineral:</span>
                          <span className="font-semibold text-[#423D33]">
                            {item.customDetails?.vesselName || item.candle.vesselName}
                          </span>
                        </div>

                        {/* Color de Cera */}
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C7A6B]">🎨 Color de Cera:</span>
                          <span className="font-semibold text-[#423D33] flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block shadow-2xs"
                              style={{
                                backgroundColor:
                                  item.customDetails?.waxColorHex ||
                                  item.candle.waxColorHex ||
                                  "#FAF7F2",
                              }}
                            />
                            <span>
                              {item.customDetails?.waxColorName ||
                                item.candle.waxColorName ||
                                "Blanco Marfil (Natural)"}
                            </span>
                          </span>
                        </div>

                        {/* Tipo de Mecha */}
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C7A6B]">🕯️ Tipo de Mecha:</span>
                          <span className="font-semibold text-[#423D33]">
                            {item.customDetails?.wickName || item.candle.wickType || "Mecha de Madera FSC"}
                          </span>
                        </div>

                        {/* Botánicos Aromáticos */}
                        <div className="flex items-start justify-between pt-0.5">
                          <span className="text-[#8C7A6B] shrink-0">🌿 Aromas & Botánicos:</span>
                          <span className="font-medium text-[#423D33] text-right pl-2 truncate max-w-[200px]">
                            {item.customDetails?.botanicalsList?.join(", ") ||
                              item.candle.botanicals?.join(", ") ||
                              "Lavanda, Naranja, Canela"}
                          </span>
                        </div>

                        {/* Etiqueta / Dedicatoria */}
                        {(item.candle.customLabelTitle || item.customDetails?.labelTitle) && (
                          <div className="flex items-start justify-between pt-0.5 border-t border-[#E5E0DA]/50">
                            <span className="text-[#8C7A6B] shrink-0">🏷️ Frase Etiqueta:</span>
                            <span className="font-serif italic font-bold text-[#423D33] text-right pl-2 truncate max-w-[200px]">
                              "{item.customDetails?.labelTitle || item.candle.customLabelTitle}"
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Standard Catalog Candle Breakdown */
                    <div className="flex items-center gap-2 text-[10px] text-[#8C7A6B]">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5E0DA]">
                        {item.candle.vesselName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5E0DA]">
                        {item.candle.burnHours}h de quemado
                      </span>
                    </div>
                  )}

                  {/* Add-ons Badges */}
                  {(item.customEngraving || item.giftWrap) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.customEngraving && (
                        <span className="text-[9px] bg-[#F2EDE7] text-[#8C7A6B] px-2 py-0.5 rounded-full font-medium border border-[#E5E0DA]">
                          Grabado: "{item.customEngraving}" (+4€)
                        </span>
                      )}
                      {item.giftWrap && (
                        <span className="text-[9px] bg-[#F2EDE7] text-[#608058] px-2 py-0.5 rounded-full font-medium border border-[#E5E0DA]">
                          Regalo Botánico (+3€)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quantity and Line Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E0DA]">
                    <div className="flex items-center border border-[#E5E0DA] rounded-full bg-[#FDFBF9] px-1.5 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#423D33] hover:text-black cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-medium text-[#423D33]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#423D33] hover:text-black cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="text-sm font-serif font-bold text-[#423D33]">
                      {(
                        (item.candle.price +
                          (item.customEngraving ? 4 : 0) +
                          (item.giftWrap ? 3 : 0)) *
                        item.quantity
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {!orderComplete && cartItems.length > 0 && !isCheckingOut && (
          <div className="p-5 border-t border-[#E5E0DA] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#423D33]/80">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-medium text-[#423D33]">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Envío ({brandConfig.shippingFreeThreshold}€ gratis):</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-[#608058] font-bold text-[10px] uppercase">GRATIS</span>
                  ) : (
                    `${shippingCost.toFixed(2)} €`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E0DA] text-sm font-normal text-[#423D33]">
                <span>Total:</span>
                <span className="font-serif text-lg font-bold text-[#423D33]">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-full bg-[#4A4541] hover:bg-[#35312E] text-white text-xs font-bold uppercase tracking-widest shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Tramitar Pedido • Pasarela Segura</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D9C5B2]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
