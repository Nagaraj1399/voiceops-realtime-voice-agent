# VoiceOps AI 🎙️⚡

> **Real-time voice intelligence for business operations. Turn natural conversations into verified business actions.**

VoiceOps AI bridges real-time duplex voice conversations directly to structured enterprise business workflows. Rather than forcing callers through rigid numeric menus (IVRs), VoiceOps AI listens naturally, understands customer intent in real time, executes verified tool calls against live business APIs, and speaks back confirmation with sub-500ms latency and full barge-in interruption support.

---

## 📌 Repository Information

- **Repository Name**: `voiceops-ai` *(or `voiceops-realtime-voice-agent`)*
- **Short Description**: Real-time voice intelligence for business operations. Turn natural spoken conversations into verified business actions.
- **GitHub Topics / Tags**: `voice-ai`, `assemblyai`, `speech-to-text`, `neural-vad`, `barge-in`, `tool-calling`, `enterprise-ops`, `react`, `typescript`, `cloud-run`
- **License**: MIT

---

## ✨ Core Highlights & Capabilities

1. **Sub-500ms Real-Time Voice Duplex**:
   - Streaming speech recognition powered by AssemblyAI's Universal-3.5 Pro ASR model.
   - Low-latency PCM16 audio processing via Web Audio API.

2. **Neural Turn-Taking & Barge-In Interruption**:
   - Neural Voice Activity Detection (VAD) detects conversational cadence and natural pauses.
   - Immediate **barge-in interruption**: when a caller interrupts or changes their mind mid-sentence, the agent halts speech synthesis instantly (< 180ms) and adapts to the new direction.

3. **Autonomous Business Tool Execution**:
   - Built-in schema-validated tools for:
     - `check_availability`: Real-time calendar slot lookups.
     - `create_booking`: Commit verified appointment entries to dispatch databases.
     - `cancel_booking`: Audit and process service cancellations.
     - `get_customer`: Instant CRM phone/profile verification.
     - `escalate_to_human`: Seamless handoff to live specialist queues.

4. **Multi-Platform Dynamic Responsive UI**:
   - Full desktop 3-column operator studio with real-time waveform visualizers, active JSON payload inspect, and live transcripts.
   - Mobile-adaptive viewport with dynamic bottom navigation, slide-over drawer, and touch-optimized controls.
   - Built-in theme palette (Obsidian Space, Midnight Navy, Cyber Slate, OLED Pure Black, Clean Studio Light) with zero white overscroll flashes.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Voice & Speech Engine** | AssemblyAI Universal ASR, Web Audio API `AnalyserNode`, SpeechRecognition fallback |
| **Backend & API** | Node.js (v22), Express, TypeScript (`tsx`), JSON Schema Tool Registry |
| **Frontend Framework** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Radix UI |
| **Deployment Target** | Google Cloud Run, Docker-compatible Node server |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- Optional: AssemblyAI API Key (`ASSEMBLYAI_API_KEY`) for streaming duplex

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/voiceops-ai.git
cd voiceops-ai

# Install dependencies
npm install

# Configure environment variables (optional)
cp .env.example .env

# Run local development server
npm run dev
```

Visit `http://localhost:3000` to access the VoiceOps AI workspace.

### Production Build

```bash
npm run build
npm start
```

---

## 📊 Available Scripts

- `npm run dev`: Starts the full-stack development server with Vite middleware on port 3000.
- `npm run build`: Bundles the React application with Vite into `/dist`.
- `npm run start`: Boots the production Express server serving `/dist` assets and API routes.
- `npm run lint`: Runs TypeScript validation (`tsc --noEmit`).

---

## 📄 License
This project is open-source and licensed under the MIT License.
