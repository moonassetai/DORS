# @dors/voice

Voice pipeline for DORS — local-first speech I/O.

**Status:** Planned for v0.2.0

## Architecture

```
User speaks → Whisper STT (local) → Text → LLM → Text → Piper TTS (local) → User hears
```

## Components

- **STT:** OpenAI Whisper (local via whisper.cpp or openai-whisper)
- **TTS:** Piper (free, local, multiple voices)
- **VAD:** Voice Activity Detection for push-to-talk and wake word
- **Stream:** Real-time audio capture and playback

## Dependencies

- whisper.cpp or openai-whisper (Python)
- Piper TTS
- Node.js audio bindings (portaudio or Web Audio API in Tauri)
