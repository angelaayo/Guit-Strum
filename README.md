GuitStrum 🎸

A web app that helps guitar players practice chords through a real-time recognition game — play a chord on a real guitar, and a trained ML model listens through your browser's microphone and tells you if you got it right.

Status: actively in development. Core chord recognition pipeline is live and working end-to-end (browser mic → live audio stream → ML classification → real-time feedback). Cloud deployment, chord library UI, and account/progress tracking are in progress.

What's working right now
🎤 Live chord recognition — streams raw audio from the browser via the Web Audio API over a WebSocket connection to a Python backend
🧠 Custom-trained ML model — an SVM classifier trained on melspectrogram features from real guitar recordings, served through a FastAPI microservice
🎯 "Play the Chord" mini-game loop — a target chord is shown on screen, the app listens continuously, and correctly matching the chord advances you to the next one
🃏 Chord diagrams — data-driven SVG fretboard diagrams (including barre chord rendering) generated from a typed chord dataset, no static images
🗄️ Postgres + Prisma — chord data is served from a real database rather than hardcoded, with mode-based filtering (Beginner / Intermediate-Advanced / All)
Tech stack

Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Web Audio API (AudioWorklet) Backend (game/data): Next.js API routes, Prisma, PostgreSQL Backend (recognition): Python, FastAPI, WebSockets, librosa, scikit-learn

How the recognition pipeline works
The browser captures raw microphone audio via an AudioWorklet, streaming small chunks over a WebSocket connection as you play
A FastAPI server buffers incoming audio and continuously watches for onset events (i.e., an actual strum, not background noise)
Once a strum is detected, a window of audio is resampled, converted into a mel-spectrogram, and passed through a trained SVM classifier
The predicted chord is sent back over the same WebSocket connection and checked against the game's current target chord in real time
Coming soon
Cloud deployment (FastAPI recognizer + Next.js app)
Full chord library with browsing/detail pages
Account creation + persistent progress tracking across sessions
Song recommendations based on chord strength/mastery
Running it locally
bash
npm install
npm run dev

Open http://localhost:3000 to view it. The recognition service (/guitstrum-recognizer) runs separately via uvicorn main:app --reload — see that folder's setup for details.

Built as a personal project to actually get better at guitar — and to learn a full audio ML pipeline end to end along the way.
