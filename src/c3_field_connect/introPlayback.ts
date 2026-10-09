type IntroVideo = Pick<HTMLVideoElement, "play" | "currentTime" | "ended">
type Clock = {
  setInterval: (callback: () => void, milliseconds: number) => number
  clearInterval: (handle: number) => void
}

/** Presentation-only fail-forward; creates no encounter or Registry standing. */
export function startIntroPlayback(video: IntroVideo, finish: () => void, clock: Clock) {
  let active = true
  let previousTime = video.currentTime
  let idleTicks = 0
  const advance = () => { if (active) finish() }
  const timer = clock.setInterval(() => {
    if (video.ended) return advance()
    idleTicks = video.currentTime > previousTime ? 0 : idleTicks + 1
    previousTime = video.currentTime
    if (idleTicks >= 3) advance()
  }, 5000)
  try { void video.play()?.catch(advance) } catch { advance() }
  return () => { active = false; clock.clearInterval(timer) }
}
