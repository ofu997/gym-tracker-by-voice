// Web Speech API types are not universally typed in TS DOM lib
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance
interface SpeechWindow {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

const CONSENT_KEY = 'gym_tracker_speech_consent'

export function isSpeechSupported(): boolean {
  const w = window as SpeechWindow
  return !!(w.SpeechRecognition ?? w.webkitSpeechRecognition)
}

export function hasSpeechConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === 'true'
}

export function grantSpeechConsent(): void {
  localStorage.setItem(CONSENT_KEY, 'true')
}

function getSpeechRecognition(): SpeechRecognitionConstructor {
  const w = window as SpeechWindow
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (!Ctor) throw new Error('SpeechRecognition not supported')
  return Ctor
}

export interface SpeechSession {
  stop: () => void
}

export function startListening(
  onInterim: (transcript: string) => void,
  onFinal: (transcript: string) => void,
  onError: (message: string) => void
): SpeechSession {
  const Recognition = getSpeechRecognition()
  const recognition = new Recognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = 'en-US'

  recognition.onresult = (event) => {
    const e = event as SpeechRecognitionEvent
    let interim = ''
    let final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i]
      if (result.isFinal) {
        final += result[0].transcript
      } else {
        interim += result[0].transcript
      }
    }
    if (interim) onInterim(interim)
    if (final) onFinal(final)
  }

  recognition.onerror = (event) => {
    const e = event as SpeechRecognitionErrorEvent
    if (e.error === 'no-speech') {
      onError('No speech detected. Try again.')
    } else if (e.error === 'not-allowed') {
      onError('Microphone access denied. Check your browser settings.')
    } else {
      onError(`Voice input error: ${e.error}`)
    }
  }

  recognition.start()

  return { stop: () => recognition.stop() }
}
