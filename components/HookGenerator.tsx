import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Sparkles, 
  Zap, 
  Layers, 
  Globe 
} from 'lucide-react';
import { Button } from './Button';
import { HookRequest, GeneratedHook, Language, AgeGroup, VideoType, Platform, LengthCategory } from '../types';
import { generateHooks } from '../services/geminiService';

const CATEGORIES = [
  "AI", "Future Machines", "Technologies", "School", "Agriculture", 
  "Electrical", "Girls / Women", "Educational", "India", "Psychology", 
  "Business", "Job & Career", "Finance", "Motivation", "Marketing", 
  "Startups", "Social Media", "Entertainment"
];

const AGE_GROUPS: AgeGroup[] = ["Kids (5–12)", "Teens (13–19)", "Youth (20–35)", "Adults (35–60)", "Seniors (60+)"];
const VIDEO_TYPES: VideoType[] = ["Short", "Medium", "Long", "Reels", "YouTube Short", "TikTok style"];
const PLATFORMS: Platform[] = ["YouTube", "Instagram", "Snapchat", "Twitter", "Facebook", "TikTok", "LinkedIn", "Custom"];
const LENGTHS: LengthCategory[] = ["Mini (0–10 sec)", "Short (10–30 sec)", "Medium (30–60 sec)", "Long (60+ sec)"];
const LANGUAGES: Language[] = ["Hinglish", "Hindi", "Gujarati", "English"];

export const HookGenerator: React.FC = () => {
  const [formData, setFormData] = useState<HookRequest>({
    topic: '',
    category: '',
    ageGroup: 'Youth (20–35)',
    videoType: 'Reels',
    platform: 'Instagram',
    length: 'Short (10–30 sec)',
    language: 'English',
    thunderMode: false
  });

  const [customCategory, setCustomCategory] = useState('');
  const [hooks, setHooks] = useState<GeneratedHook[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!formData.language) {
      alert("Please select a language first.");
      return;
    }
    if (!formData.topic) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateHooks({
        ...formData,
        category: customCategory || formData.category
      });
      setHooks(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate hooks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleThunderMode = () => {
    setFormData(prev => ({ ...prev, thunderMode: !prev.thunderMode }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Form Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8 relative overflow-hidden transition-all duration-500">
        
        {/* Thunder Mode Background Effect */}
        {formData.thunderMode && (
          <div className="absolute inset-0 bg-yellow-50/50 pointer-events-none z-0 animate-pulse" />
        )}

        {/* Header with Thunder Toggle */}
        <div className="flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold text-gray-900">Configure Hooks</h2>
          <button
            onClick={toggleThunderMode}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              formData.thunderMode 
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50 scale-105' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Zap className={`w-4 h-4 mr-2 ${formData.thunderMode ? 'fill-black' : ''}`} />
            THUNDER PULSE {formData.thunderMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Language & Topic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Language
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFormData({...formData, language: lang})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.language === lang 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-2" /> Topic
            </label>
            <input 
              type="text" 
              placeholder="e.g. AI Revolution in 2025"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3 relative z-10">
          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
            <Layers className="w-4 h-4 mr-2" /> Category
          </label>
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setFormData({...formData, category: cat}); setCustomCategory(''); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  formData.category === cat && !customCategory
                    ? 'bg-yellow-400 text-black shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
             <input 
              type="text" 
              placeholder="Custom..."
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all w-32 outline-none border ${
                customCategory ? 'border-yellow-400 ring-2 ring-yellow-400 ring-opacity-50' : 'border-gray-200'
              }`}
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setFormData({...formData, category: e.target.value});
              }}
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          
          {/* Age Group */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Age Group</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400"
              value={formData.ageGroup}
              onChange={(e) => setFormData({...formData, ageGroup: e.target.value as AgeGroup})}
            >
              {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400"
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value as Platform})}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400"
              value={formData.videoType}
              onChange={(e) => setFormData({...formData, videoType: e.target.value as VideoType})}
            >
              {VIDEO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Length */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Length</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400"
              value={formData.length}
              onChange={(e) => setFormData({...formData, length: e.target.value as LengthCategory})}
            >
              {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

        </div>

        <div className="pt-4 relative z-10">
          <Button 
            variant="thunder" 
            className={`w-full text-lg py-4 shadow-xl ${formData.thunderMode ? 'shadow-yellow-400/50 ring-2 ring-yellow-400 ring-offset-2' : 'shadow-yellow-400/30'}`}
            onClick={handleGenerate}
            isLoading={loading}
            icon={<Zap className={`w-5 h-5 ${formData.thunderMode ? 'fill-black' : 'fill-black'}`} />}
          >
            {formData.thunderMode ? 'GENERATE HIGH VOLTAGE HOOKS ⚡' : 'GENERATE VIRAL HOOKS'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {hooks.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500 mr-2" />
              Generated Hooks
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-xs py-2 px-3 h-auto" onClick={() => setHooks([])}>Clear</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hooks.map((hook, idx) => (
              <div key={idx} className={`group relative bg-white p-6 rounded-2xl border transition-all duration-300 ${
                formData.thunderMode 
                  ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/10' 
                  : 'border-gray-100 hover:border-yellow-400 hover:shadow-lg'
              }`}>
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleCopy(hook.text, idx)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-yellow-100 text-gray-600 hover:text-yellow-700"
                    title="Copy"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-start justify-between mb-2">
                   <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                     formData.thunderMode ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                   }`}>
                    {hook.type}
                  </span>
                </div>
                
                <p className={`text-xl font-medium text-gray-900 leading-relaxed font-sans mb-3 ${formData.thunderMode ? 'font-bold' : ''}`}>
                  "{hook.text}"
                </p>
                
                {hook.explanation && (
                  <p className="text-sm text-gray-500 italic border-l-2 border-yellow-200 pl-3">
                    Why it works: {hook.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};