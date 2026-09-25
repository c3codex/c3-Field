import "./eternalFlame.css"

type EternalFlameProps={
  compact?:boolean
  label?:string
  text?:string
  className?:string
}

export default function EternalFlame({
  compact=false,
  label="Eternal Flame",
  text="For those who died waiting.",
  className=""
}:EternalFlameProps){
  return <figure className={`eternal-flame ${compact?"eternal-flame--compact":""} ${className}`.trim()} aria-label={label+" memorial"}>
    <div className="eternal-flame__visual" aria-hidden="true">
      <div className="eternal-flame__halo"/>
      <svg viewBox="0 0 120 168" role="presentation" focusable="false">
        <defs>
          <linearGradient id="efOuter" x1="0" y1="1" x2=".48" y2="0">
            <stop offset="0%" stopColor="#7a1f0a"/>
            <stop offset="43%" stopColor="#e66a16"/>
            <stop offset="100%" stopColor="#f5c85a"/>
          </linearGradient>
          <linearGradient id="efInner" x1=".3" y1="1" x2=".65" y2="0">
            <stop offset="0%" stopColor="#f29926"/>
            <stop offset="58%" stopColor="#ffd777"/>
            <stop offset="100%" stopColor="#fff2bd"/>
          </linearGradient>
          <radialGradient id="efCore" cx=".5" cy=".65" r=".48">
            <stop offset="0%" stopColor="#fff9de"/>
            <stop offset="60%" stopColor="#ffd56b"/>
            <stop offset="100%" stopColor="#f07a1b"/>
          </radialGradient>
          <filter id="efGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g className="eternal-flame__outer" filter="url(#efGlow)">
          <path fill="url(#efOuter)" d="M60 6c7 24-13 34-13 55 0 12 8 17 14 10 9-11 9-29 4-45 23 23 37 45 35 72-2 35-24 58-40 64-24-7-42-28-40-58 2-29 18-45 34-66-1 18-7 32 6 40 8-16 8-34 0-72z"/>
        </g>
        <g className="eternal-flame__mid">
          <path fill="url(#efInner)" d="M62 47c4 16-8 23-8 37 0 8 5 12 10 8 7-7 7-19 4-29 15 15 24 29 23 47-1 23-15 39-31 45-17-6-28-20-27-39 1-18 12-31 23-44-1 11-4 21 4 26 6-11 6-23 2-51z"/>
        </g>
        <g className="eternal-flame__core">
          <path fill="url(#efCore)" d="M61 86c2 8-4 13-4 20 0 5 3 7 6 5 4-4 4-10 2-16 9 8 14 16 13 26-1 12-8 21-18 25-10-4-16-11-16-22 0-10 6-17 13-25 0 7-2 12 2 15 4-7 4-14 2-28z"/>
        </g>
      </svg>
      <div className="eternal-flame__base"/>
    </div>
    <figcaption>
      <strong>{label}</strong>
      <span>{text}</span>
    </figcaption>
  </figure>
}
