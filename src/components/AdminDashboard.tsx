import React, { useState } from "react";
import {
  Shield,
  Package,
  Sparkles,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Palette,
  Flame,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  LogOut,
  Sliders,
  Send,
  Phone,
  Mail,
  MapPin,
  FileText,
  UserCheck,
  UserX,
  Filter,
  UserPlus
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CandleProduct, Collaborator, AromaItem, StoreOrder, UserAccount, OrderStatus, UserRole } from "../types";
import { ImageUploadField } from "./ImageUploadField";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    brandConfig,
    updateBrandConfig,
    resetBrandConfig,
    candles,
    addCandle,
    updateCandle,
    deleteCandle,
    collaborators,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator,
    aromas,
    addAroma,
    updateAroma,
    deleteAroma,
    users,
    currentUser,
    registerUser,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    orders,
    updateOrderStatus,
    deleteOrder,
    logoutUser,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "resumen" | "productos" | "aromas" | "creadores" | "pedidos" | "usuarios" | "marca"
  >("resumen");

  // Product Editing & Creating states
  const [editingCandle, setEditingCandle] = useState<CandleProduct | null>(null);
  const [isAddingCandle, setIsAddingCandle] = useState(false);
  const [candleSearch, setCandleSearch] = useState("");
  const [candleImageInput, setCandleImageInput] = useState<string>("");

  // Collaborator Editing & Creating states
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  const [isAddingCollab, setIsAddingCollab] = useState(false);
  const [collabImageInput, setCollabImageInput] = useState<string>("");

  // Aroma Editing & Creating states
  const [editingAroma, setEditingAroma] = useState<AromaItem | null>(null);
  const [isAddingAroma, setIsAddingAroma] = useState(false);

  // User Management State (Search, Filters, New User Modal)
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"todos" | "activo" | "suspendido" | "administrador" | "cliente">("todos");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("cliente");

  // Brand Form State
  const [brandForm, setBrandForm] = useState(brandConfig);

  // Success Toast state
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  // STRICT ROLE GATEWAY: Admin Only
  if (!currentUser || currentUser.role !== "administrador") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 border border-[#E5E0DA] shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#423D33]">
            Acceso Restringido
          </h3>
          <p className="text-xs text-[#423D33]/70 leading-relaxed">
            Este panel de administración está reservado exclusivamente para cuentas autorizadas con rol de administrador.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status === "Pendiente" || o.status === "En Elaboración"
  ).length;
  const inStockCandlesCount = candles.filter((c) => c.inStock).length;

  // Candle Submit Handler
  const handleSaveCandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const chosenImage = candleImageInput || (editingCandle?.image || candles[0]?.image);

    const candleData: CandleProduct = {
      id: editingCandle ? editingCandle.id : `vela-custom-${Date.now()}`,
      name: (formData.get("name") as string) || "Nueva Vela Artesanal",
      subtitle: (formData.get("subtitle") as string) || "",
      tagline: (formData.get("tagline") as string) || "",
      price: Number(formData.get("price")) || 35,
      weightGrams: Number(formData.get("weightGrams")) || 300,
      burnHours: Number(formData.get("burnHours")) || 60,
      image: chosenImage,
      vesselColor: (formData.get("vesselColor") as string) || "#8C7A6B",
      vesselName: (formData.get("vesselName") as string) || "Cerámica Mate",
      category: (formData.get("category") as any) || "Relajación",
      olfactoryPyramid: {
        salida: (formData.get("salida") as string) || "",
        corazon: (formData.get("corazon") as string) || "",
        fondo: (formData.get("fondo") as string) || "",
      },
      ingredients: (formData.get("ingredients") as string)
        ? (formData.get("ingredients") as string).split(",").map((s) => s.trim())
        : ["100% Cera de soja virgen", "Mecha de madera FSC", "Aceites botánicos"],
      botanicals: (formData.get("botanicals") as string)
        ? (formData.get("botanicals") as string).split(",").map((s) => s.trim())
        : ["Botánicos secos"],
      description: (formData.get("description") as string) || "",
      artisanNote: (formData.get("artisanNote") as string) || "",
      rating: editingCandle ? editingCandle.rating : 5.0,
      reviewsCount: editingCandle ? editingCandle.reviewsCount : 1,
      inStock: formData.get("inStock") === "on",
      featured: formData.get("featured") === "on",
    };

    if (editingCandle) {
      updateCandle(editingCandle.id, candleData);
      notify(`Vela "${candleData.name}" actualizada con éxito.`);
    } else {
      addCandle(candleData);
      notify(`Nueva vela "${candleData.name}" añadida al catálogo.`);
    }

    setEditingCandle(null);
    setIsAddingCandle(false);
    setCandleImageInput("");
  };

  // Collaborator Submit Handler
  const handleSaveCollaborator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const colors = (formData.get("paletteColors") as string)
      ? (formData.get("paletteColors") as string).split(",").map((s) => s.trim())
      : ["#8C7A6B", "#D98B68", "#E8DFD5"];

    const chosenCollabImage = collabImageInput || (editingCollab?.image || collaborators[0]?.image);

    const collabData: Collaborator = {
      id: editingCollab ? editingCollab.id : `collab-${Date.now()}`,
      name: (formData.get("name") as string) || "Nuevo Creador",
      age: Number(formData.get("age")) || 20,
      location: (formData.get("location") as string) || "Madrid, España",
      discipline: (formData.get("discipline") as string) || "Ilustración Botánica",
      bio: (formData.get("bio") as string) || "",
      artistInspiration: (formData.get("artistInspiration") as string) || "",
      technique: (formData.get("technique") as string) || "",
      designMeaning: (formData.get("designMeaning") as string) || "",
      aromaDesignRelation: (formData.get("aromaDesignRelation") as string) || "",
      quote: (formData.get("quote") as string) || "",
      image: chosenCollabImage,
      associatedCandleId: (formData.get("associatedCandleId") as string) || undefined,
      associatedCandleName: (formData.get("associatedCandleName") as string) || undefined,
      paletteColors: colors,
    };

    if (editingCollab) {
      updateCollaborator(editingCollab.id, collabData);
      notify(`Ficha de "${collabData.name}" actualizada.`);
    } else {
      addCollaborator(collabData);
      notify(`Nuevo creador "${collabData.name}" incorporado.`);
    }

    setEditingCollab(null);
    setIsAddingCollab(false);
    setCollabImageInput("");
  };

  // Aroma Submit Handler
  const handleSaveAroma = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const notes = (formData.get("notes") as string)
      ? (formData.get("notes") as string).split(",").map((s) => s.trim())
      : ["Nota 1", "Nota 2"];

    const aromaData: AromaItem = {
      id: editingAroma ? editingAroma.id : `aroma-${Date.now()}`,
      name: (formData.get("name") as string) || "Nuevo Aroma",
      family: (formData.get("family") as string) || "Floral & Relajación",
      intensity: Number(formData.get("intensity")) || 4,
      notes: notes,
      description: (formData.get("description") as string) || "",
      accentColor: (formData.get("accentColor") as string) || "#8C7A6B",
    };

    if (editingAroma) {
      updateAroma(editingAroma.id, aromaData);
      notify(`Aroma "${aromaData.name}" actualizado.`);
    } else {
      addAroma(aromaData);
      notify(`Nuevo aroma "${aromaData.name}" registrado.`);
    }

    setEditingAroma(null);
    setIsAddingAroma(false);
  };

  // Brand Update Submit
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandConfig(brandForm);
    notify("Configuración de marca e identidad actualizada en tiempo real.");
  };

  // Handle Add New User
  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Por favor complete nombre y correo electrónico.");
      return;
    }
    const res = registerUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword || "123456",
      role: newUserRole,
    });
    if (res.success) {
      notify(`Usuario "${newUserName}" creado exitosamente.`);
      setIsAddingUser(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("cliente");
    } else {
      alert(res.message);
    }
  };

  // Filter Candles
  const filteredCandles = candles.filter(
    (c) =>
      c.name.toLowerCase().includes(candleSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(candleSearch.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(candleSearch.toLowerCase())
  );

  // Filter Users by Search and Status/Role Filters
  const filteredUsers = users.filter((u) => {
    const searchMatch =
      userSearch.trim() === "" ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.city && u.city.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.phone && u.phone.includes(userSearch)) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());

    if (!searchMatch) return false;

    if (userStatusFilter === "todos") return true;
    if (userStatusFilter === "activo") return u.status === "activo";
    if (userStatusFilter === "suspendido") return u.status === "suspendido";
    if (userStatusFilter === "administrador") return u.role === "administrador";
    if (userStatusFilter === "cliente") return u.role === "cliente";

    return true;
  });

  const activeUsersCount = users.filter((u) => u.status === "activo").length;
  const suspendedUsersCount = users.filter((u) => u.status === "suspendido").length;
  const adminUsersCount = users.filter((u) => u.role === "administrador").length;
  const clientUsersCount = users.filter((u) => u.role === "cliente").length;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs overflow-hidden animate-fade-in">
      <div className="bg-[#FAF7F2] w-full h-full max-w-7xl mx-auto my-auto md:my-6 md:rounded-3xl border border-[#E5E0DA] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Toast */}
        {toast && (
          <div className="absolute top-4 right-4 z-50 bg-[#4A4541] text-white px-4 py-2.5 rounded-2xl shadow-lg border border-[#E5E0DA]/40 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-[#D9C5B2]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Bar */}
        <header className="p-4 sm:p-5 bg-[#423D33] text-white flex items-center justify-between border-b border-[#35312E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold">
                  Panel de Administración • {brandConfig.brandName}
                </h2>
                <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8C7A6B]/30 text-[#D9C5B2] border border-[#D9C5B2]/30 font-bold">
                  Control Total
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                Sesión activa: <span className="text-[#D9C5B2] font-semibold">{currentUser.name}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#423D33] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Cerrar Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Sub Navigation Bar Tabs */}
        <div className="bg-[#F4EFEA] border-b border-[#E5E0DA] px-4 sm:px-6 py-2 overflow-x-auto shrink-0 flex items-center gap-2">
          {[
            { id: "resumen", label: "Resumen & Métricas", icon: Sliders },
            { id: "productos", label: `Productos (${candles.length})`, icon: Package },
            { id: "aromas", label: `Aromas (${aromas.length})`, icon: Sparkles },
            { id: "creadores", label: `Jóvenes Creadores (${collaborators.length})`, icon: Palette },
            { id: "pedidos", label: `Pedidos (${orders.length})`, icon: ShoppingBag },
            { id: "usuarios", label: `Usuarios (${users.length})`, icon: Users },
            { id: "marca", label: "Marca & Identidad", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#4A4541] text-white shadow-xs"
                    : "text-[#423D33]/75 hover:bg-white hover:text-[#423D33]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Body / Tab Views */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: RESUMEN */}
          {activeTab === "resumen" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8C7A6B]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Ventas Totales</span>
                    <DollarSign className="w-4 h-4 text-[#D98B68]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#423D33]">
                    {totalRevenue}€
                  </div>
                  <span className="text-[11px] text-[#608058] font-medium flex items-center gap-1">
                    {orders.length} pedidos procesados
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8C7A6B]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pedidos en Curso</span>
                    <ShoppingBag className="w-4 h-4 text-[#D98B68]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#423D33]">
                    {activeOrdersCount}
                  </div>
                  <span className="text-[11px] text-[#8C7A6B]">Pendientes o en elaboración</span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8C7A6B]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Catálogo Activo</span>
                    <Package className="w-4 h-4 text-[#8C7A6B]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#423D33]">
                    {candles.length} Velas
                  </div>
                  <span className="text-[11px] text-[#608058]">
                    {inStockCandlesCount} disponibles en stock
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#8C7A6B]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Comunidad Ayllu</span>
                    <Users className="w-4 h-4 text-[#8C7A6B]" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#423D33]">
                    {collaborators.length} Creadores
                  </div>
                  <span className="text-[11px] text-[#8C7A6B]">{users.length} usuarios registrados</span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Bento */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders List */}
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#423D33]">
                      Últimos Pedidos Registrados
                    </h3>
                    <button
                      onClick={() => setActiveTab("pedidos")}
                      className="text-xs text-[#8C7A6B] hover:text-[#423D33] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Todos</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#E5E0DA]/70">
                    {orders.slice(0, 4).map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#423D33]">{ord.id}</span>
                            <span className="text-[#8C7A6B]">• {ord.customerName}</span>
                          </div>
                          <p className="text-[11px] text-[#423D33]/70">
                            {ord.items.map((i) => `${i.quantity}x ${i.candle.name}`).join(", ")}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-bold text-[#423D33] block">{ord.total}€</span>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === "Entregado"
                                ? "bg-[#608058]/15 text-[#35522e]"
                                : ord.status === "Enviado"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Shortcut Box */}
                <div className="lg:col-span-4 bg-[#F2EDE7] p-6 rounded-3xl border border-[#E5E0DA] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]">
                      Acciones Directas
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#423D33]">
                      Gestión de Ayllu
                    </h4>
                    <p className="text-xs text-[#423D33]/70">
                      Sube fotos desde tu ordenador para nuevos productos, artistas o el logotipo de {brandConfig.brandName}.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setEditingCandle(null);
                        setCandleImageInput("");
                        setIsAddingCandle(true);
                        setActiveTab("productos");
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#4A4541] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#35312E] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Subir Nueva Vela al Catálogo</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCollab(null);
                        setCollabImageInput("");
                        setIsAddingCollab(true);
                        setActiveTab("creadores");
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white text-[#423D33] border border-[#E5E0DA] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#8C7A6B]" />
                      <span>Registrar Joven Creador</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GESTIÓN DE PRODUCTOS */}
          {activeTab === "productos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar vela por nombre, aroma o categoría..."
                    value={candleSearch}
                    onChange={(e) => setCandleSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingCandle(null);
                    setCandleImageInput("");
                    setIsAddingCandle(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Nueva Vela</span>
                </button>
              </div>

              {/* Candles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandles.map((candle) => (
                  <div
                    key={candle.id}
                    className="bg-white rounded-3xl border border-[#E5E0DA] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F2EDE7] border border-[#E5E0DA]">
                        <img
                          src={candle.image}
                          alt={candle.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              candle.inStock
                                ? "bg-[#608058] text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {candle.inStock ? "En Stock" : "Agotada"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]">
                            {candle.category}
                          </span>
                          <span className="font-serif font-bold text-[#423D33] text-base">
                            {candle.price}€
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-[#423D33] text-lg">
                          {candle.name}
                        </h4>
                        <p className="text-xs text-[#8C7A6B] font-medium truncate">
                          {candle.subtitle}
                        </p>
                      </div>

                      <div className="text-[11px] text-[#423D33]/80 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E5E0DA]/70 space-y-1">
                        <p>
                          <strong className="text-[#8C7A6B]">Salida:</strong> {candle.olfactoryPyramid.salida}
                        </p>
                        <p>
                          <strong className="text-[#8C7A6B]">Vasija:</strong> {candle.vesselName} ({candle.burnHours}h)
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#E5E0DA] flex items-center justify-between">
                      {/* Stock Quick Toggle */}
                      <button
                        onClick={() => {
                          updateCandle(candle.id, { inStock: !candle.inStock });
                          notify(`Disponibilidad de "${candle.name}" modificada.`);
                        }}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          candle.inStock
                            ? "bg-[#608058]/15 text-[#35522e] hover:bg-red-100 hover:text-red-700"
                            : "bg-red-100 text-red-700 hover:bg-[#608058]/20 hover:text-[#35522e]"
                        }`}
                      >
                        {candle.inStock ? "Disponible" : "Marcar Agotada"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCandle(candle);
                            setCandleImageInput(candle.image);
                            setIsAddingCandle(false);
                          }}
                          className="p-1.5 rounded-full bg-[#F4EFEA] hover:bg-[#4A4541] text-[#423D33] hover:text-white transition-colors cursor-pointer"
                          title="Editar Vela"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la vela "${candle.name}" del catálogo?`)) {
                              deleteCandle(candle.id);
                              notify(`Vela "${candle.name}" eliminada.`);
                            }
                          }}
                          className="p-1.5 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors cursor-pointer"
                          title="Eliminar Vela"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal / Form for Adding / Editing Product with Image Upload */}
              {(isAddingCandle || editingCandle) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#E5E0DA] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-4">
                      <h3 className="font-serif text-2xl font-bold text-[#423D33]">
                        {editingCandle ? "Editar Vela de Colección" : "Crear Nueva Vela"}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingCandle(null);
                          setIsAddingCandle(false);
                          setCandleImageInput("");
                        }}
                        className="p-1.5 rounded-full bg-[#F4EFEA] text-[#423D33] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCandle} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Nombre de la Vela *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            defaultValue={editingCandle?.name || ""}
                            placeholder="Ej. Nº 05 • Ecos del Valle"
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Subtítulo Olfativo *
                          </label>
                          <input
                            type="text"
                            name="subtitle"
                            required
                            defaultValue={editingCandle?.subtitle || ""}
                            placeholder="Ej. Eucalipto Andino, Menta & Pino"
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      {/* Image Upload Component for Product Image & Design */}
                      <ImageUploadField
                        label="Fotografía & Diseño de la Vela (Subir desde el Computador o URL)"
                        value={candleImageInput || editingCandle?.image || ""}
                        onChange={(newUrl) => setCandleImageInput(newUrl)}
                        recommendedSize="800x800px o 1200x800px (JPG, PNG, WebP)"
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Precio (€) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            required
                            step="1"
                            defaultValue={editingCandle?.price || 38}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Horas Quemado
                          </label>
                          <input
                            type="number"
                            name="burnHours"
                            defaultValue={editingCandle?.burnHours || 65}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Peso (Gramos)
                          </label>
                          <input
                            type="number"
                            name="weightGrams"
                            defaultValue={editingCandle?.weightGrams || 320}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Categoría *
                          </label>
                          <select
                            name="category"
                            defaultValue={editingCandle?.category || "Relajación"}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white"
                          >
                            <option value="Relajación">Relajación</option>
                            <option value="Cálido & Especiado">Cálido & Especiado</option>
                            <option value="Madera & Místico">Madera & Místico</option>
                            <option value="Fresco & Vital">Fresco & Vital</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                            Nombre de Vasija
                          </label>
                          <input
                            type="text"
                            name="vesselName"
                            defaultValue={editingCandle?.vesselName || "Cerámica Arena Mate"}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      {/* Olfactory Pyramid Inputs */}
                      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] space-y-3">
                        <span className="font-bold text-[#8C7A6B] uppercase tracking-wider block">
                          Pirámide Olfativa
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#423D33] mb-0.5">
                            Notas de Salida
                          </label>
                          <input
                            type="text"
                            name="salida"
                            defaultValue={editingCandle?.olfactoryPyramid?.salida || ""}
                            placeholder="Ej. Bergamota, naranja dulce y cardamomo"
                            className="w-full p-2 rounded-lg border border-[#E5E0DA] bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#423D33] mb-0.5">
                            Notas de Corazón
                          </label>
                          <input
                            type="text"
                            name="corazon"
                            defaultValue={editingCandle?.olfactoryPyramid?.corazon || ""}
                            placeholder="Ej. Lavanda silvestre, canela y azahar"
                            className="w-full p-2 rounded-lg border border-[#E5E0DA] bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#423D33] mb-0.5">
                            Notas de Fondo
                          </label>
                          <input
                            type="text"
                            name="fondo"
                            defaultValue={editingCandle?.olfactoryPyramid?.fondo || ""}
                            placeholder="Ej. Cera de soja pura, cedro y vainilla"
                            className="w-full p-2 rounded-lg border border-[#E5E0DA] bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                          Descripción Emocional & Filosofía
                        </label>
                        <textarea
                          name="description"
                          rows={2}
                          defaultValue={editingCandle?.description || ""}
                          placeholder="Historia y sensación de esta vela..."
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="inStock"
                            defaultChecked={editingCandle ? editingCandle.inStock : true}
                            className="w-4 h-4 rounded text-[#8C7A6B] focus:ring-[#8C7A6B]"
                          />
                          <span className="font-semibold text-[#423D33]">Disponible en Stock</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={editingCandle ? editingCandle.featured : false}
                            className="w-4 h-4 rounded text-[#8C7A6B] focus:ring-[#8C7A6B]"
                          />
                          <span className="font-semibold text-[#423D33]">Vela Destacada en Portada</span>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-[#E5E0DA] flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCandle(null);
                            setIsAddingCandle(false);
                            setCandleImageInput("");
                          }}
                          className="px-4 py-2 rounded-full border border-[#E5E0DA] text-[#423D33] hover:bg-[#F2EDE7] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-full bg-[#4A4541] text-white font-bold uppercase tracking-wider hover:bg-[#35312E] transition-colors cursor-pointer"
                        >
                          {editingCandle ? "Guardar Cambios" : "Publicar Vela"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GESTIÓN DE AROMAS */}
          {activeTab === "aromas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#423D33]">
                    Catálogo de Aromas Botánicos & Notas
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Define las esencias puras utilizadas en las fórmulas y el Asesor Botánico
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAroma(null);
                    setIsAddingAroma(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Aroma</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aromas.map((aroma) => (
                  <div
                    key={aroma.id}
                    className="bg-white rounded-3xl border border-[#E5E0DA] p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: aroma.accentColor }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]">
                          Intensidad: {aroma.intensity}/5
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-[#423D33] text-lg">
                          {aroma.name}
                        </h4>
                        <span className="text-xs text-[#D98B68] font-medium">
                          {aroma.family}
                        </span>
                      </div>

                      <p className="text-xs text-[#423D33]/80 leading-relaxed">
                        {aroma.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {aroma.notes.map((n, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5E0DA] text-[#423D33]"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E0DA] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingAroma(aroma);
                          setIsAddingAroma(false);
                        }}
                        className="p-1.5 rounded-full bg-[#F4EFEA] hover:bg-[#4A4541] text-[#423D33] hover:text-white transition-colors cursor-pointer"
                        title="Editar Aroma"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el aroma "${aroma.name}"?`)) {
                            deleteAroma(aroma.id);
                            notify(`Aroma "${aroma.name}" eliminado.`);
                          }
                        }}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Eliminar Aroma"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Aroma */}
              {(isAddingAroma || editingAroma) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E5E0DA] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                      <h3 className="font-serif text-xl font-bold text-[#423D33]">
                        {editingAroma ? "Editar Aroma" : "Registrar Aroma"}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingAroma(null);
                          setIsAddingAroma(false);
                        }}
                        className="p-1.5 rounded-full bg-[#F4EFEA] text-[#423D33]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAroma} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Nombre del Aroma *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          defaultValue={editingAroma?.name || ""}
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Familia Olfativa</label>
                          <input
                            type="text"
                            name="family"
                            defaultValue={editingAroma?.family || "Floral & Relajación"}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Intensidad (1-5)</label>
                          <input
                            type="number"
                            name="intensity"
                            min="1"
                            max="5"
                            defaultValue={editingAroma?.intensity || 4}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Notas Aromáticas (separadas por comas)</label>
                        <input
                          type="text"
                          name="notes"
                          defaultValue={editingAroma?.notes?.join(", ") || ""}
                          placeholder="Lavanda, Manzanilla, Eucalipto"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Descripción del Efecto</label>
                        <textarea
                          name="description"
                          rows={2}
                          defaultValue={editingAroma?.description || ""}
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E0DA]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAroma(null);
                            setIsAddingAroma(false);
                          }}
                          className="px-4 py-2 rounded-full border border-[#E5E0DA]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#4A4541] text-white font-bold"
                        >
                          Guardar Aroma
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GESTIÓN DE CREADORES */}
          {activeTab === "creadores" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#423D33]">
                    Jóvenes Creadores & Colectivo Artístico
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Administra los perfiles de artistas, fotografías, técnicas de pigmento y obras
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCollab(null);
                    setCollabImageInput("");
                    setIsAddingCollab(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Creador</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="bg-white rounded-3xl border border-[#E5E0DA] p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#E5E0DA] bg-[#F2EDE7] shrink-0">
                          <img
                            src={collab.image}
                            alt={collab.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-[#423D33] text-lg">
                            {collab.name}
                          </h4>
                          <p className="text-xs text-[#8C7A6B]">
                            {collab.age} años • {collab.location}
                          </p>
                          <span className="text-[10px] text-[#D98B68] font-semibold">
                            {collab.discipline}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#423D33]/80 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E5E0DA]/70 space-y-1">
                        <p><strong>Técnica:</strong> {collab.technique}</p>
                        <p><strong>Inspiración:</strong> {collab.artistInspiration}</p>
                        {collab.associatedCandleName && (
                          <p className="text-[#8C7A6B]"><strong>Vela:</strong> {collab.associatedCandleName}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E0DA] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCollab(collab);
                          setCollabImageInput(collab.image);
                          setIsAddingCollab(false);
                        }}
                        className="p-1.5 rounded-full bg-[#F4EFEA] hover:bg-[#4A4541] text-[#423D33] hover:text-white transition-colors cursor-pointer"
                        title="Editar Creador"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar al creador "${collab.name}"?`)) {
                            deleteCollaborator(collab.id);
                            notify(`Creador "${collab.name}" eliminado.`);
                          }
                        }}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Eliminar Creador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Creador with Image Upload */}
              {(isAddingCollab || editingCollab) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-[#E5E0DA] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                      <h3 className="font-serif text-xl font-bold text-[#423D33]">
                        {editingCollab ? "Editar Ficha de Creador" : "Registrar Nuevo Creador"}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingCollab(null);
                          setIsAddingCollab(false);
                          setCollabImageInput("");
                        }}
                        className="p-1.5 rounded-full bg-[#F4EFEA] text-[#423D33]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCollaborator} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Nombre Completo *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            defaultValue={editingCollab?.name || ""}
                            placeholder="Ej. Valentina Morales"
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Edad</label>
                          <input
                            type="number"
                            name="age"
                            defaultValue={editingCollab?.age || 20}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Ciudad / País *</label>
                          <input
                            type="text"
                            name="location"
                            required
                            defaultValue={editingCollab?.location || "Medellín, Colombia"}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#8C7A6B] mb-1">Disciplina Artística</label>
                          <input
                            type="text"
                            name="discipline"
                            defaultValue={editingCollab?.discipline || "Ilustración Botánica & Acuarela"}
                            className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                          />
                        </div>
                      </div>

                      {/* Image Upload for Creator Photo */}
                      <ImageUploadField
                        label="Fotografía del Creador (Subir desde el Computador o URL)"
                        value={collabImageInput || editingCollab?.image || ""}
                        onChange={(newUrl) => setCollabImageInput(newUrl)}
                        aspectRatio="portrait"
                        recommendedSize="600x800px (Retrato JPG, PNG)"
                      />

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Inspiración del Artista</label>
                        <textarea
                          name="artistInspiration"
                          rows={2}
                          defaultValue={editingCollab?.artistInspiration || ""}
                          placeholder="Qué lo inspira en la naturaleza..."
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Técnica Utilizada</label>
                        <input
                          type="text"
                          name="technique"
                          defaultValue={editingCollab?.technique || ""}
                          placeholder="Ej. Acuarela con pigmentos orgánicos de arcilla y cúrcuma"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Significado del Diseño</label>
                        <input
                          type="text"
                          name="designMeaning"
                          defaultValue={editingCollab?.designMeaning || ""}
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Cita del Creador</label>
                        <input
                          type="text"
                          name="quote"
                          defaultValue={editingCollab?.quote || ""}
                          placeholder="Frase inspiradora..."
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] mb-1">Vela Asociada en Colección</label>
                        <input
                          type="text"
                          name="associatedCandleName"
                          defaultValue={editingCollab?.associatedCandleName || ""}
                          placeholder="Ej. Nº 01 • Serenidad Botánica"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E0DA]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCollab(null);
                            setIsAddingCollab(false);
                            setCollabImageInput("");
                          }}
                          className="px-4 py-2 rounded-full border border-[#E5E0DA]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#4A4541] text-white font-bold"
                        >
                          Guardar Creador
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GESTIÓN DE PEDIDOS */}
          {activeTab === "pedidos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#423D33]">
                    Gestión de Pedidos & Envíos
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Monitorea los pedidos, estados de elaboración y personalizaciones de clientes
                  </p>
                </div>
                <span className="text-xs font-bold text-[#423D33] bg-white px-3 py-1 rounded-full border border-[#E5E0DA]">
                  Total: {orders.length} pedidos
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-[#E5E0DA] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0DA] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-lg text-[#423D33]">
                            Pedido #{ord.id}
                          </span>
                          <span className="text-xs text-[#8C7A6B]">
                            {new Date(ord.createdAt).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#423D33]">
                          Cliente: <strong>{ord.customerName}</strong> ({ord.customerEmail} • {ord.customerPhone})
                        </p>
                        <p className="text-[11px] text-[#8C7A6B]">
                          Dirección: {ord.shippingAddress}, {ord.shippingCity}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold uppercase text-[#8C7A6B]">
                          Estado:
                        </label>
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            updateOrderStatus(ord.id, e.target.value as OrderStatus);
                            notify(`Estado del pedido #${ord.id} actualizado a ${e.target.value}.`);
                          }}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#E5E0DA] bg-[#FAF7F2] font-semibold text-[#423D33]"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Elaboración">En Elaboración</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] block">
                        Artículos del Pedido
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E5E0DA]/70 flex items-center gap-3 text-xs"
                          >
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#E5E0DA] shrink-0">
                              <img
                                src={it.candle.image}
                                alt={it.candle.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-[#423D33] block truncate">
                                {it.quantity}x {it.candle.name}
                              </span>
                              {it.customEngraving && (
                                <span className="text-[10px] text-[#D98B68] block italic truncate">
                                  Grabado: "{it.customEngraving}"
                                </span>
                              )}
                              {it.giftWrap && (
                                <span className="text-[9px] text-[#608058] font-bold uppercase block">
                                  + Envoltura Regalo
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-[#423D33]">
                              {it.candle.price * it.quantity}€
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-[#8C7A6B]">
                        Método: {ord.paymentMethod} {ord.trackingCode && `• Código: ${ord.trackingCode}`}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-base font-bold text-[#423D33]">
                          Total: {ord.total}€
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el pedido #${ord.id}?`)) {
                              deleteOrder(ord.id);
                              notify("Pedido eliminado.");
                            }
                          }}
                          className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar Pedido"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GESTIÓN DE USUARIOS CON BÚSQUEDA Y FILTROS */}
          {activeTab === "usuarios" && (
            <div className="space-y-6">
              {/* Header and User Creation Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#423D33]">
                    Usuarios Registrados & Permisos
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Control de cuentas de clientes, administradores del taller y estados de acceso
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingUser(true)}
                  className="px-4 py-2 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              {/* Quick Stat Chips for Users */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-[#E5E0DA] text-center">
                  <span className="text-[10px] text-[#8C7A6B] uppercase font-bold block">Total</span>
                  <span className="font-serif text-xl font-bold text-[#423D33]">{users.length}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E5E0DA] text-center">
                  <span className="text-[10px] text-[#608058] uppercase font-bold block">Activos</span>
                  <span className="font-serif text-xl font-bold text-[#608058]">{activeUsersCount}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E5E0DA] text-center">
                  <span className="text-[10px] text-red-600 uppercase font-bold block">Inactivos/Susp.</span>
                  <span className="font-serif text-xl font-bold text-red-600">{suspendedUsersCount}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E5E0DA] text-center">
                  <span className="text-[10px] text-[#8C7A6B] uppercase font-bold block">Admins</span>
                  <span className="font-serif text-xl font-bold text-[#8C7A6B]">{adminUsersCount}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#E5E0DA] text-center">
                  <span className="text-[10px] text-[#423D33] uppercase font-bold block">Clientes</span>
                  <span className="font-serif text-xl font-bold text-[#423D33]">{clientUsersCount}</span>
                </div>
              </div>

              {/* Search Bar and Status Filter Buttons */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E0DA] shadow-xs">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, correo, ciudad o rol..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E5E0DA] bg-[#FAF7F2] text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#423D33]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills for Status and Role */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4EFEA] rounded-full border border-[#E5E0DA]">
                  <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider px-2 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    <span>Filtro:</span>
                  </span>

                  {[
                    { id: "todos", label: "Todos" },
                    { id: "activo", label: `Activos (${activeUsersCount})` },
                    { id: "suspendido", label: `Inactivos (${suspendedUsersCount})` },
                    { id: "administrador", label: `Admins (${adminUsersCount})` },
                    { id: "cliente", label: `Clientes (${clientUsersCount})` },
                  ].map((filterItem) => (
                    <button
                      key={filterItem.id}
                      onClick={() => setUserStatusFilter(filterItem.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        userStatusFilter === filterItem.id
                          ? "bg-[#4A4541] text-white shadow-xs"
                          : "text-[#423D33]/70 hover:text-[#423D33]"
                      }`}
                    >
                      {filterItem.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-3xl border border-[#E5E0DA] overflow-hidden shadow-xs">
                {filteredUsers.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <p className="text-sm font-serif text-[#423D33]">
                      No se encontraron usuarios que coincidan con la búsqueda o filtro aplicado.
                    </p>
                    <button
                      onClick={() => {
                        setUserSearch("");
                        setUserStatusFilter("todos");
                      }}
                      className="text-xs text-[#8C7A6B] font-bold uppercase underline cursor-pointer"
                    >
                      Restablecer Filtros
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E0DA]">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#E5E0DA] flex items-center justify-center font-bold text-[#423D33] font-serif shrink-0">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-full h-full object-cover rounded-full"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              u.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-[#423D33]">
                                {u.name}
                              </span>
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  u.role === "administrador"
                                    ? "bg-[#8C7A6B] text-white"
                                    : "bg-[#F2EDE7] text-[#8C7A6B]"
                                }`}
                              >
                                {u.role}
                              </span>
                              <span
                                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                                  u.status === "activo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {u.status === "activo" ? "Activo" : "Inactivo / Suspendido"}
                              </span>
                            </div>
                            <p className="text-xs text-[#8C7A6B]">
                              {u.email} • {u.city || "Ciudad no registrada"} {u.phone && `• Tel: ${u.phone}`}
                            </p>
                          </div>
                        </div>

                        {/* Role & Status Action Buttons */}
                        <div className="flex items-center gap-2 text-xs">
                          {/* Role Toggle */}
                          <button
                            onClick={() => {
                              const newRole = u.role === "administrador" ? "cliente" : "administrador";
                              updateUserRole(u.id, newRole);
                              notify(`Rol de "${u.name}" actualizado a ${newRole}.`);
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5E0DA] text-[#423D33] hover:bg-[#4A4541] hover:text-white transition-colors cursor-pointer"
                            title={u.role === "administrador" ? "Convertir en Cliente" : "Otorgar Permisos de Administrador"}
                          >
                            {u.role === "administrador" ? "Hacer Cliente" : "Hacer Admin"}
                          </button>

                          {/* Status Toggle (Active / Inactive) */}
                          <button
                            onClick={() => {
                              const newStatus = u.status === "activo" ? "suspendido" : "activo";
                              updateUserStatus(u.id, newStatus);
                              notify(`Estado de "${u.name}" cambiado a ${newStatus}.`);
                            }}
                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${
                              u.status === "activo"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                            title={u.status === "activo" ? "Suspender acceso" : "Reactivar acceso"}
                          >
                            {u.status === "activo" ? "Suspender" : "Activar"}
                          </button>

                          {/* Delete user */}
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar definitivamente la cuenta de ${u.name}?`)) {
                                  deleteUser(u.id);
                                  notify("Usuario eliminado.");
                                }
                              }}
                              className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar Usuario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal to Add New User */}
              {isAddingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E5E0DA] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                      <h3 className="font-serif text-xl font-bold text-[#423D33]">
                        Crear Nuevo Usuario
                      </h3>
                      <button
                        onClick={() => setIsAddingUser(false)}
                        className="p-1.5 rounded-full bg-[#F4EFEA] text-[#423D33] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateNewUser} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Ej. Mateo Gómez"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="mateo@ejemplo.com"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                          Contraseña Inicial
                        </label>
                        <input
                          type="password"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="Por defecto: 123456"
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                          Rol Asignado *
                        </label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                          className="w-full p-2.5 rounded-xl border border-[#E5E0DA] bg-white font-medium"
                        >
                          <option value="cliente">Cliente (Compras, Historial y Personalización)</option>
                          <option value="administrador">Administrador (Control Total del Panel)</option>
                        </select>
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E0DA]">
                        <button
                          type="button"
                          onClick={() => setIsAddingUser(false)}
                          className="px-4 py-2 rounded-full border border-[#E5E0DA] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-full bg-[#4A4541] text-white font-bold cursor-pointer"
                        >
                          Crear Cuenta
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CONFIGURACIÓN DE MARCA & LOGO UPLOAD */}
          {activeTab === "marca" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#423D33]">
                  Identidad & Configuración General de la Marca
                </h3>
                <p className="text-xs text-[#8C7A6B]">
                  Cambia el nombre, logotipo oficial (subido desde tu computador o por URL), historia, manifiesto y WhatsApp
                </p>
              </div>

              <form onSubmit={handleSaveBrand} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0DA] shadow-xs space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Nombre de la Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandForm.brandName}
                      onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                      placeholder="Ej. Ayllu"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA] text-sm font-serif font-bold text-[#423D33]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Eslogan / Subtítulo *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandForm.slogan}
                      onChange={(e) => setBrandForm({ ...brandForm, slogan: e.target.value })}
                      placeholder="Ej. Velas con Aroma • Creación Artesanal"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                    />
                  </div>
                </div>

                {/* Logo Upload Component */}
                <ImageUploadField
                  label="Logotipo Oficial de Ayllu (Subir desde el Computador)"
                  value={brandForm.logoUrl}
                  onChange={(newLogoUrl) => setBrandForm({ ...brandForm, logoUrl: newLogoUrl })}
                  aspectRatio="circle"
                  recommendedSize="500x500px o 800x800px (PNG, JPG, SVG)"
                />

                {/* About & Manifesto Texts */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Frase Destacada de Nosotros (Manifiesto) *
                    </label>
                    <textarea
                      rows={3}
                      value={brandForm.aboutDescription}
                      onChange={(e) => setBrandForm({ ...brandForm, aboutDescription: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA] font-serif leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Historia Detallada del Origen & Filosofía
                    </label>
                    <textarea
                      rows={3}
                      value={brandForm.aboutDetailedStory}
                      onChange={(e) => setBrandForm({ ...brandForm, aboutDetailedStory: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA] leading-relaxed"
                    />
                  </div>
                </div>

                {/* Contact & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={brandForm.whatsappNumber}
                      onChange={(e) => setBrandForm({ ...brandForm, whatsappNumber: e.target.value })}
                      placeholder="+34 612 345 678"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={brandForm.contactEmail}
                      onChange={(e) => setBrandForm({ ...brandForm, contactEmail: e.target.value })}
                      placeholder="taller@aylluvelas.es"
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                      Envío Gratis Desde (€)
                    </label>
                    <input
                      type="number"
                      value={brandForm.shippingFreeThreshold}
                      onChange={(e) =>
                        setBrandForm({ ...brandForm, shippingFreeThreshold: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl border border-[#E5E0DA]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E0DA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("¿Restaurar valores predeterminados de marca?")) {
                        resetBrandConfig();
                        setBrandForm(brandConfig);
                        notify("Valores restaurados.");
                      }
                    }}
                    className="px-4 py-2 rounded-full border border-[#E5E0DA] text-[#8C7A6B] hover:text-[#423D33] cursor-pointer"
                  >
                    Restaurar Original
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#4A4541] text-white font-bold hover:bg-[#35312E] shadow-xs cursor-pointer"
                  >
                    Guardar Cambios de Marca
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
