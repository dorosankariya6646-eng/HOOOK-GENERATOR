import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Wand2, Download, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { editImage } from '../services/geminiService';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;
    setLoading(true);
    try {
      const editedBase64 = await editImage(selectedImage, prompt);
      setResultUrl(editedBase64);
    } catch (e) {
      console.error(e);
      alert("Failed to edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left: Input */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <ImageIcon className="w-6 h-6 mr-2 text-yellow-500" />
              Source Image
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${
                previewUrl ? 'border-yellow-400 bg-yellow-50/20' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
              ) : (
                <div className="text-center p-6">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Magic Instruction
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro filter', 'Make it cyber-punk'"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            <Button 
              variant="thunder" 
              className="w-full"
              disabled={!selectedImage || !prompt}
              onClick={handleEdit}
              isLoading={loading}
              icon={<Wand2 className="w-4 h-4" />}
            >
              APPLY MAGIC
            </Button>
          </div>

          {/* Right: Output */}
          <div className="flex-1 space-y-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <h2 className="text-2xl font-bold flex items-center justify-between">
              <span>Result</span>
              {resultUrl && (
                <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </h2>

            <div className="border border-gray-100 bg-gray-50 rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden">
               {loading ? (
                 <div className="text-center animate-pulse">
                   <Wand2 className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
                   <p className="text-gray-500 font-medium">Gemini is painting...</p>
                 </div>
               ) : resultUrl ? (
                 <img src={resultUrl} alt="Edited Result" className="w-full h-full object-contain" />
               ) : (
                 <p className="text-gray-400 text-sm">Edited image will appear here</p>
               )}
            </div>
            
            {resultUrl && (
               <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm flex items-center">
                 <Sparkles className="w-4 h-4 mr-2" />
                 Generated using Gemini 2.5 Flash Image
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );