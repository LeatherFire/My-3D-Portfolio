import { useState } from 'react';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

const LockButton = ({ locked, onToggle }) => {
  // Sadece partikül efektleri için local state
  const [partikuller, setPartikuller] = useState([]);

  const handleClick = () => {
    // Kilit durumunu parent'e bildirmek
    onToggle();

    // Partikül animasyonunu tetiklemek
    partikulleriOlustur();
  };

  const partikulleriOlustur = () => {
    const yeniPartikuller = Array.from({ length: 20 });
    setPartikuller(yeniPartikuller);

    // 1 saniye sonra partikülleri temizle (animasyon bitişi)
    setTimeout(() => {
      setPartikuller([]);
    }, 1000);
  };

  return (
    <div className="relative inline-block items-center">
      <button
        className={`relative z-10 flex items-center justify-center p-3 ml-2 rounded-lg transition-colors duration-300 ${
          locked ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
        }`}
      >
        {locked ? (
          <LockClosedIcon className="h-4 w-4 text-white scale-150" />
        ) : (
          <LockOpenIcon className="h-4 w-4 text-white scale-150" />
        )}
      </button>

      {/* Partiküller */}
      {partikuller.map((_, index) => (
        <span
          key={index}
          className="partikul"
          style={{
            '--angle': `${(index / partikuller.length) * 360}deg`,
          }}
        ></span>
      ))}

      <style jsx>{`
        .partikul {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 5px;
          height: 5px;
          margin: -2.5px;
          background-color: white;
          border-radius: 50%;
          animation: partikul-animasyonu 1s ease-out forwards;
        }

        @keyframes partikul-animasyonu {
          0% {
            transform: rotate(var(--angle)) translateX(0);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LockButton;
