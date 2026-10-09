export type AuthoredIntroState = "loading" | "playing" | "blocked" | "failed"
type Player = Pick<HTMLVideoElement, "play" | "pause" | "load" | "muted" | "volume" | "currentTime" | "ended" | "paused" | "addEventListener" | "removeEventListener">
type Clock = {setInterval: (callback: () => void, milliseconds: number) => number; clearInterval: (handle: number) => void}

/** Presentation only. A policy refusal never means that the film completed. */
export function startAuthoredIntro(video: Player, callbacks: {
  state: (state: AuthoredIntroState) => void
  complete: () => void
  failure: (reason: "media_error" | "stall") => void
}, clock: Clock) {
  let active = true, completed = false, attempt = 0, pending = false
  let state: AuthoredIntroState = "loading", previous = video.currentTime, idle = 0
  const report = (value: AuthoredIntroState) => {
    state = value
    if (active && !completed) callbacks.state(value)
  }
  const failed = (reason: "media_error" | "stall") => {
    if (!active || completed || state === "failed") return
    attempt++; pending = false
    report("failed"); video.pause(); callbacks.failure(reason)
  }
  const ended = () => {
    if (!active || completed || !video.ended) return
    completed = true; attempt++; callbacks.complete()
  }
  const play = () => {
    if (!active || completed || pending) return
    const token = ++attempt
    pending = true; idle = 0; previous = video.currentTime
    video.muted = false; video.volume = 1; report("loading")
    const rejected = (error: unknown) => {
      if (!active || completed || token !== attempt) return
      pending = false
      const name = (error as {name?: string})?.name
      if (name === "NotAllowedError") report("blocked")
      else if (name === "AbortError") report("loading")
      else failed("media_error")
    }
    try {
      void Promise.resolve(video.play()).then(() => {
        if (!active || completed || token !== attempt) return
        pending = false; report("playing")
      }, rejected)
    } catch (error) { rejected(error) }
  }
  const ready = () => { if (state === "loading" && !pending) play() }
  const playing = () => { if(state!=="failed") {idle = 0; report("playing")} }
  const error = () => failed("media_error")
  const listeners: [string, () => void][] = [["ended", ended], ["error", error], ["loadedmetadata", ready], ["canplay", ready], ["playing", playing]]
  for (const [event, listener] of listeners) video.addEventListener(event, listener)
  const timer = clock.setInterval(() => {
    if (!active || completed) return
    if (video.ended) return ended()
    // Do not hide the intro while a browser refusal awaits a gesture or the user pauses.
    if (state === "blocked" || state === "failed" || (state === "playing" && video.paused)) return
    idle = video.currentTime > previous ? 0 : idle + 1
    previous = video.currentTime
    if (idle >= (state === "loading" ? 6 : 3)) failed("stall")
  }, 5000)
  play()
  return {
    playWithSound: play,
    retry: () => { if (!active || completed) return; attempt++; pending = false; report("loading"); video.load(); play() },
    dispose: () => { active = false; attempt++; clock.clearInterval(timer); for (const [event, listener] of listeners) video.removeEventListener(event, listener); video.pause() },
  }
}

export function showApprovedCaptions(tracks: ArrayLike<Pick<TextTrack, "kind" | "mode">>, enabled: boolean) {
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].kind === "captions" || tracks[i].kind === "subtitles") tracks[i].mode = enabled ? "showing" : "disabled"
  }
}
