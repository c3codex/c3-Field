import { useEffect, useMemo, useState } from "react"

type PlaqueContent = {
  title?: string
  body?: string[]
  secondary_title?: string
  secondary_body?: string[]
  position?: string
}

export default function AntechamberPlaque({
  plaque,
}: {
  plaque: PlaqueContent
}) {
  const [isVisible, setIsVisible] = useState(false)

  const title = plaque.title?.trim()
  const secondaryTitle = plaque.secondary_title?.trim()

  const body = useMemo(
    () => (Array.isArray(plaque.body) ? plaque.body.filter(Boolean) : []),
    [plaque.body]
  )

  const secondaryBody = useMemo(
    () =>
      Array.isArray(plaque.secondary_body)
        ? plaque.secondary_body.filter(Boolean)
        : [],
    [plaque.secondary_body]
  )

  const bodySignature = useMemo(() => JSON.stringify(body), [body])
  const secondaryBodySignature = useMemo(
    () => JSON.stringify(secondaryBody),
    [secondaryBody]
  )

  useEffect(() => {
    setIsVisible(false)

    const timeoutId = window.setTimeout(() => {
      setIsVisible(true)
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [
    title,
    secondaryTitle,
    bodySignature,
    secondaryBodySignature,
    plaque.position,
  ])

  if (body.length === 0 && secondaryBody.length === 0) {
    return null
  }

  const isCentered = plaque.position === "center"

  return (
    <div
      style={{
        position: "absolute",
        left: isCentered ? "50%" : "5.5vw",
        transform: isCentered ? "translateX(-50%)" : "none",
        top: "20vh",
        width: isCentered ? "min(46vw, 700px)" : "min(42vw, 640px)",
        maxHeight: "58vh",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "30px 18px 26px 28px",
        scrollbarGutter: "stable",
        background: "rgba(8, 12, 24, 0.18)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(210, 230, 255, 0.07)",
        borderRadius: 24,
        color: "rgba(245, 248, 255, 0.95)",
        lineHeight: 1.56,
        fontSize: "1.02rem",
        boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
        zIndex: 4,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 900ms ease",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {body.length > 0 ? (
        <>
          {title ? (
            <h2
              style={{
                margin: 0,
                marginBottom: 18,
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </h2>
          ) : null}

          <div style={{ display: "grid", gap: 18, paddingRight: 8 }}>
            {body.map((paragraph, index) => (
              <p
                key={`plaque-body-${index}`}
                style={{
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </>
      ) : null}

      {secondaryBody.length > 0 ? (
        <div
          style={{
            marginTop: body.length > 0 ? 22 : 0,
            paddingTop: body.length > 0 ? 18 : 0,
            borderTop:
              body.length > 0
                ? "1px solid rgba(210, 230, 255, 0.08)"
                : "none",
          }}
        >
          {secondaryTitle ? (
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                fontSize: "0.96rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {secondaryTitle}
            </h3>
          ) : null}

          <div style={{ display: "grid", gap: 12, fontSize: "0.92rem" }}>
            {secondaryBody.map((paragraph, index) => (
              <p
                key={`plaque-secondary-${index}`}
                style={{
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}