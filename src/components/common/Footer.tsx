import React from 'react';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t"
            style={{ borderColor: 'hsl(var(--border))', zIndex: 40 }}>
      <div className="flex justify-center">
        <a href="https://www.instagram.com/fcmello.design"
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center gap-2 font-medium"
           style={{ color: '#266e42', marginBottom: 'env(safe-area-inset-bottom)' }}>
          <Instagram size={18} />
          <span>@fcmello.design</span>
        </a>
      </div>
    </footer>
  );
}
