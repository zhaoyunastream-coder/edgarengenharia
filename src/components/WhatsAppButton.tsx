import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5554999787256"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring" />
      <MessageCircle className="w-6 h-6 relative z-10" />
    </a>
  );
}
