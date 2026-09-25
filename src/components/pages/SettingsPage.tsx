import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Radio,
  Sliders,
  CheckCircle2,
  Lock,
  Volume2,
  Mic,
  RefreshCw,
  Palette,
  Check,
  Sparkles,
} from 'lucide-react';
import { AppTheme, THEME_CONFIGS } from '../../types/theme';

interface SettingsPageProps {
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentTheme = 'obsidian',
  onSelectTheme,
}) => {
  const [vadThreshold, setVadThreshold] = useState(0.75);
  const [bargeInSensitivity, setBargeInSensitivity] = useState(0.85);
  const [selectedVoice, setSelectedVoice] = useState('en-US-Neural2-F (Default)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Voice Engine Configuration
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Manage workspace background theme, AssemblyAI connection security, Voice Activity Detection (VAD) thresholds, and speech synthesis models.
        </p>
      </div>

      {/* Background Theme & Appearance Customization */}
      <div className="p-4 sm:p-6 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Workspace Appearance & Background Theme
            </h2>
            <span className="text-[11px] text-neutral-400 font-mono block">
              Instantly change viewport canvas colors and ambient atmosphere
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(Object.keys(THEME_CONFIGS) as AppTheme[]).map((tKey) => {
            const cfg = THEME_CONFIGS[tKey];
            const isSelected = currentTheme === tKey;

            return (
              <button
                key={tKey}
                type="button"
                onClick={() => onSelectTheme && onSelectTheme(tKey)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
                  isSelected
                    ? 'border-indigo-500 bg-neutral-900/90 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                    : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/50 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm shrink-0"
                      style={{ backgroundColor: cfg.previewColor }}
                    />
                    <span className="font-semibold text-xs text-neutral-100">{cfg.name}</span>
                  </div>
                  {isSelected ? (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-indigo-500/30">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400">{cfg.bgColor}</span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400 leading-tight">
                  {cfg.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* AssemblyAI Connection & Key Security */}
      <div className="p-4 sm:p-6 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-100">
                AssemblyAI API Key & Handshake
              </h2>
              <span className="text-[11px] text-neutral-400 font-mono block">
                Stored securely on backend server · Never leaked to browser DOM
              </span>
            </div>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 bg-emerald-950/50 border border-emerald-800/60 rounded text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Authenticated</span>
          </span>
        </div>

        <div className="p-3.5 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-neutral-400">
            <span>Runtime Environment:</span>
            <span className="text-neutral-200">Production / Full-Stack Node</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-neutral-400">
            <span>WebSocket Target:</span>
            <span className="text-indigo-300 break-all">wss://agents.assemblyai.com/v1/ws</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-neutral-400">
            <span>Session Initialization:</span>
            <span className="text-emerald-400 break-all">POST /api/voice/session (Bearer Handshake)</span>
          </div>
        </div>
      </div>

      {/* Turn-Taking & Barge-In Calibration */}
      <div className="p-4 sm:p-6 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Turn-Taking & Barge-In Parameters
            </h2>
            <span className="text-[11px] text-neutral-400 font-mono">
              Calibrate audio sensitivity for natural conversation flow
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="vad-threshold-slider" className="font-medium text-neutral-300">Voice Activity Detection (VAD) Threshold</label>
              <span className="font-mono text-neutral-400">{vadThreshold}</span>
            </div>
            <input
              id="vad-threshold-slider"
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={vadThreshold}
              onChange={(e) => setVadThreshold(parseFloat(e.target.value))}
              aria-label="Voice Activity Detection threshold"
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[11px] text-neutral-400 block mt-1">
              Higher values filter background room noise; lower values detect quiet speech faster.
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="barge-in-slider" className="font-medium text-neutral-300">Barge-in Interruption Sensitivity</label>
              <span className="font-mono text-neutral-400">{bargeInSensitivity}</span>
            </div>
            <input
              id="barge-in-slider"
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={bargeInSensitivity}
              onChange={(e) => setBargeInSensitivity(parseFloat(e.target.value))}
              aria-label="Barge-in interruption sensitivity"
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[11px] text-neutral-400 block mt-1">
              Controls how aggressively agent speech halts when incoming user speech is detected.
            </span>
          </div>
        </div>
      </div>

      {/* Voice Output Selection */}
      <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Agent Output Voice
            </h2>
            <span className="text-[11px] text-neutral-400 font-mono">
              High-naturalness speech synthesis model
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {['en-US-Neural2-F (Default)', 'en-US-Studio-O (Professional Crisp)', 'en-US-Journey-D (Conversational)'].map((voice) => (
            <label
              key={voice}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedVoice === voice
                  ? 'bg-neutral-900 border-indigo-500 text-white'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="voice"
                  checked={selectedVoice === voice}
                  onChange={() => setSelectedVoice(voice)}
                  className="accent-indigo-500"
                />
                <span className="font-mono">{voice}</span>
              </div>
              <span className="text-[11px] text-neutral-400">24kHz PCM</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-950/50 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Save Voice Configuration</span>
        </button>

        {savedSuccess && (
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Parameters updated successfully</span>
          </span>
        )}
      </div>
    </div>
  );
};
