import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { MATCHES, MESSAGES, Message } from "../data/mockData";

const CURRENT_USER_ID = "t1"; // Viewing as tenant Sophie

export function MessagingPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const match = MATCHES.find((m) => m.id === matchId) ?? MATCHES[0];
  const [messages, setMessages] = useState<Message[]>(
    MESSAGES.filter((m) => m.matchId === (matchId ?? "m1"))
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      matchId: match.id,
      senderId: CURRENT_USER_ID,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const otherUser =
    CURRENT_USER_ID === match.tenant.id ? match.listing.owner : match.tenant;
  const otherName =
    CURRENT_USER_ID === match.tenant.id
      ? match.listing.owner.name
      : match.tenant.name;
  const otherAvatar =
    CURRENT_USER_ID === match.tenant.id
      ? match.listing.owner.avatar
      : match.tenant.avatar;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#F0F4FA" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shadow-sm flex-shrink-0"
        style={{ background: "#1E3A5F" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <img src={otherAvatar} alt={otherName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{otherName}</p>
          <p className="text-white/50 text-xs truncate">
            {match.listing.title} — {match.listing.monthlyRent}€/mois
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
          >
            <Phone size={16} />
          </button>
          <button
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Match banner */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
        style={{ background: "#D1FAE5", borderBottom: "1px solid #A7F3D0" }}
      >
        <span style={{ fontSize: "14px" }}>🎉</span>
        <p className="text-xs font-semibold" style={{ color: "#065F46" }}>
          Match validé ! Vous pouvez discuter librement et organiser une visite.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => {
          const isMine = msg.senderId === CURRENT_USER_ID;
          const showDate =
            i === 0 ||
            new Date(msg.createdAt).toDateString() !==
              new Date(messages[i - 1].createdAt).toDateString();

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "#E2E8F0", color: "#64748B" }}
                  >
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              )}
              <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!isMine && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1">
                    <img src={otherAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: isMine ? "#1E3A5F" : "white",
                    color: isMine ? "white" : "#1E293B",
                    borderBottomRightRadius: isMine ? "4px" : "16px",
                    borderBottomLeftRadius: isMine ? "16px" : "4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {msg.content}
                  <div
                    className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : ""}`}
                    style={{ opacity: 0.6 }}
                  >
                    <span style={{ fontSize: "10px", color: isMine ? "rgba(255,255,255,0.6)" : "#94A3B8" }}>
                      {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMine && (
                      <CheckCheck
                        size={12}
                        style={{ color: msg.readAt ? "#60A5FA" : "rgba(255,255,255,0.5)" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "#E8EEF8" }}
            >
              <span style={{ fontSize: "28px" }}>👋</span>
            </div>
            <p className="font-bold" style={{ color: "#1E293B" }}>
              Démarrez la conversation
            </p>
            <p className="text-sm text-gray-400 max-w-xs">
              Vous êtes maintenant en contact. Présentez-vous et proposez une visite !
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex items-end gap-3 px-4 py-3 flex-shrink-0 border-t border-gray-100"
        style={{ background: "white" }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message…"
          rows={1}
          className="flex-1 px-4 py-3 rounded-xl outline-none resize-none"
          style={{
            background: "#F0F4FA",
            fontSize: "14px",
            maxHeight: "120px",
            color: "#1E293B",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: input.trim() ? "#F97316" : "#E2E8F0",
            color: input.trim() ? "white" : "#94A3B8",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Messages List (all conversations) ────────────────────────────────────────

export function MessagesList() {
  const connectedMatches = MATCHES.filter((m) => m.status === "connected");

  return (
    <div className="pb-8">
      <div className="px-4 pt-6 pb-5" style={{ background: "#1E3A5F" }}>
        <h1 className="text-white font-bold" style={{ fontSize: "20px" }}>
          Messages
        </h1>
        <p className="text-white/60 text-sm">Vos conversations en cours</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {connectedMatches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              Aucune conversation en cours. Attendez qu'un match soit validé.
            </p>
          </div>
        )}

        {connectedMatches.map((match) => (
          <Link
            key={match.id}
            to={`/messages/${match.id}`}
            className="flex items-center gap-4 p-4 rounded-2xl transition-transform active:scale-[0.98]"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden">
                <img
                  src={match.listing.owner.avatar}
                  alt={match.listing.owner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {(match.unreadCount ?? 0) > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: "#F97316" }}
                >
                  {match.unreadCount}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-bold text-sm" style={{ color: "#1E293B" }}>
                  {match.listing.owner.name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(match.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <p className="text-xs text-gray-500 mb-1 truncate">{match.listing.title}</p>
              <p
                className="text-xs truncate"
                style={{
                  color: (match.unreadCount ?? 0) > 0 ? "#1E293B" : "#94A3B8",
                  fontWeight: (match.unreadCount ?? 0) > 0 ? 600 : 400,
                }}
              >
                {match.lastMessage ?? "Commencez la conversation…"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
