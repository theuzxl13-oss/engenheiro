/** Ilustração técnica animada (estilo prancha) usada quando não há foto de destaque. */
export function BlueprintArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 560" fill="none" className={className} role="img" aria-label="Ilustração técnica de uma edificação">
      <defs>
        <linearGradient id="bp-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a9bf0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#4a9bf0" stopOpacity="0.25" />
        </linearGradient>
        <pattern id="bp-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#4a9bf0" strokeOpacity="0.25" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Terreno e fundação */}
      <rect x="40" y="470" width="560" height="40" fill="url(#bp-hatch)" />
      <line x1="20" y1="470" x2="620" y2="470" stroke="#4a9bf0" strokeWidth="1.5" className="draw-line" />

      {/* Torre principal */}
      <g stroke="url(#bp-fade)" strokeWidth="1.6">
        <path d="M150 470 V130 L250 90 V470" className="draw-line" />
        <path d="M250 90 L350 130 V470" className="draw-line" style={{ animationDelay: "0.2s" }} />
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`f${i}`}
            x1="150"
            x2="350"
            y1={160 + i * 28}
            y2={160 + i * 28}
            strokeOpacity="0.55"
            className="draw-line"
            style={{ animationDelay: `${0.3 + i * 0.06}s` }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`c${i}`}
            x1={170 + i * 34}
            x2={170 + i * 34}
            y1="140"
            y2="470"
            strokeOpacity="0.3"
            className="draw-line"
            style={{ animationDelay: `${0.5 + i * 0.05}s` }}
          />
        ))}
      </g>

      {/* Bloco lateral */}
      <g stroke="#4a9bf0" strokeOpacity="0.7" strokeWidth="1.4">
        <path d="M350 470 V260 H520 V470" className="draw-line" style={{ animationDelay: "0.6s" }} />
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`b${i}`}
            x1="350"
            x2="520"
            y1={290 + i * 26}
            y2={290 + i * 26}
            strokeOpacity="0.45"
            className="draw-line"
            style={{ animationDelay: `${0.8 + i * 0.05}s` }}
          />
        ))}
        {/* Treliça de cobertura */}
        <path d="M350 260 L435 215 L520 260 M372 260 L435 215 L498 260 M393 260 L435 215 L477 260" strokeOpacity="0.6" className="draw-line" style={{ animationDelay: "1s" }} />
      </g>

      {/* Cotas */}
      <g stroke="#c8a96b" strokeWidth="1" fill="#c8a96b" fontFamily="ui-monospace, monospace" fontSize="11">
        <line x1="110" y1="90" x2="110" y2="470" className="draw-line" style={{ animationDelay: "1.2s" }} />
        <line x1="104" y1="90" x2="116" y2="90" />
        <line x1="104" y1="470" x2="116" y2="470" />
        <text x="72" y="284" stroke="none" transform="rotate(-90 92 284)">h = 38,00 m</text>

        <line x1="150" y1="530" x2="520" y2="530" className="draw-line" style={{ animationDelay: "1.3s" }} />
        <line x1="150" y1="524" x2="150" y2="536" />
        <line x1="520" y1="524" x2="520" y2="536" />
        <text x="300" y="549" stroke="none">L = 74,00 m</text>
      </g>

      {/* Marcadores */}
      <g fill="#c8a96b">
        <circle cx="250" cy="90" r="4" />
        <circle cx="435" cy="215" r="4" />
      </g>
      <g stroke="#c8a96b" strokeOpacity="0.5" strokeDasharray="3 5">
        <line x1="250" y1="90" x2="560" y2="60" />
        <line x1="435" y1="215" x2="590" y2="170" />
      </g>
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#e2cfa6">
        <text x="520" y="52">DET. 01</text>
        <text x="550" y="162">DET. 02</text>
      </g>
    </svg>
  );
}
