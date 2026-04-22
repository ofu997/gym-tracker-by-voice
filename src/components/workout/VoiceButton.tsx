import { useState, useRef, useEffect } from 'react'
import {
  isSpeechSupported,
  hasSpeechConsent,
  grantSpeechConsent,
  startListening,
} from '../../services/speech'
import type { SpeechSession } from '../../services/speech'

interface Props {
  onTranscript: (text: string) => void
  disabled: boolean
}

type Status = 'idle' | 'consent' | 'listening' | 'error'

export default function VoiceButton({ onTranscript, disabled }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [interimText, setInterimText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sessionRef = useRef<SpeechSession | null>(null)
  const consentAcceptRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (status === 'consent') consentAcceptRef.current?.focus()
  }, [status])

  if (!isSpeechSupported()) return null

  function handleClick() {
    if (disabled) return
    if (status === 'listening') {
      sessionRef.current?.stop()
      setStatus('idle')
      setInterimText('')
      return
    }
    if (!hasSpeechConsent()) {
      setStatus('consent')
      return
    }
    beginListening()
  }

  function beginListening() {
    setStatus('listening')
    setInterimText('')
    setErrorMsg('')
    setAnnouncement('Recording started')

    sessionRef.current = startListening(
      (interim) => setInterimText(interim),
      (final) => {
        sessionRef.current = null
        setStatus('idle')
        setInterimText('')
        setAnnouncement('Recording stopped')
        onTranscript(final)
      },
      (msg) => {
        sessionRef.current = null
        setStatus('error')
        setErrorMsg(msg)
        setInterimText('')
        setAnnouncement('')
      }
    )
  }

  function handleConsentAccept() {
    grantSpeechConsent()
    setStatus('idle')
    beginListening()
  }

  return (
    <div>
      {status === 'consent' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="speech-consent-title"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
        >
          <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', maxWidth: '380px', margin: '1rem' }}>
            <h3 id="speech-consent-title" style={{ marginTop: 0 }}>Voice input</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Voice input uses your browser's built-in speech recognition. Your audio may be
              processed by your browser vendor (e.g. Google Chrome, Microsoft Edge) according to
              their privacy policy. This app never records or stores your audio.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>
              {' · '}
              <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noreferrer">Microsoft Privacy Policy</a>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setStatus('idle')}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', background: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                ref={consentAcceptRef}
                onClick={handleConsentAccept}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#1a73e8', color: '#fff', cursor: 'pointer' }}
              >
                Got it, continue
              </button>
            </div>
          </div>
        </div>
      )}

      <span
        aria-live="assertive"
        aria-atomic="true"
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      >
        {announcement}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={status === 'listening' ? 'Stop recording' : 'Start voice input'}
          aria-pressed={status === 'listening'}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${status === 'listening' ? '#e53935' : '#ccc'}`,
            background: status === 'listening' ? '#fde8e8' : 'none',
            color: status === 'listening' ? '#c62828' : '#444',
            fontSize: '0.95rem',
          }}
        >
          <span aria-hidden="true">{status === 'listening' ? '⏹' : '🎙'}</span>
          {status === 'listening' ? 'Stop recording' : 'Use voice'}
        </button>

        {status === 'listening' && interimText && (
          <p aria-live="polite" style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', margin: 0 }}>
            {interimText}
          </p>
        )}

        {status === 'error' && (
          <p role="alert" style={{ fontSize: '0.85rem', color: '#c62828', margin: 0 }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  )
}
