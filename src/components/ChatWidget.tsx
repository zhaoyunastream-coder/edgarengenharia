import { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_URL = 'https://wa.me/5554997014995';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const text = message.trim() || 'Olá, gostaria de mais informações!';
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank');
    setMessage('');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium shadow-lg flex items-center gap-2"
          >
            👋 Como posso ajudar você hoje?
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-heading text-lg text-foreground">E</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Edgar Engenharia</p>
                  <p className="text-xs text-emerald-200">Online agora</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-foreground/80 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message */}
            <div className="p-4">
              <div className="bg-muted rounded-lg p-3 text-sm text-foreground leading-relaxed">
                Olá! 👋 Sou o Edgar, Engenheiro Civil. Como posso te ajudar hoje? Fique à vontade para perguntar sobre nossos serviços, projetos ou tirar qualquer dúvida!
              </div>
            </div>

            {/* Input */}
            <div className="p-3 pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Digite sua pergunta..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-muted border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
                  className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-500 hover:bg-emerald-600 text-foreground text-center py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                💬 Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-ring" />
        {open ? (
          <X className="w-6 h-6 text-foreground relative z-10" />
        ) : (
          <MessageSquare className="w-6 h-6 text-foreground relative z-10" />
        )}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card" />
        )}
      </button>
    </div>
  );
}
