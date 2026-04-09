'use client';

import { useState } from 'react';
import { Save, Eye, Code, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { updatePrivacyPolicy } from './actions';

interface PrivacyEditorProps {
  propertyId: string;
  initialContent: string;
}

export default function PrivacyEditor({ propertyId, initialContent }: PrivacyEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updatePrivacyPolicy(propertyId, content);
      if (result.success) {
        setStatus({ type: 'success', message: 'Privacy policy updated successfully!' });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to save.' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {status && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-500 min-w-[320px] max-w-md ${
          status.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="text-green-500" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
          <div className="flex flex-col flex-1">
            <span className="font-bold text-sm tracking-tight">{status.type === 'success' ? 'Changes Saved' : 'Action Required'}</span>
            <span className="text-xs opacity-80 leading-relaxed font-medium">{status.message}</span>
          </div>
          <button onClick={() => setStatus(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-[#F4EBD0]/50 sticky top-24 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPreview(false)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${!showPreview ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'text-[#6B635C] hover:bg-[#FDFCF9]'}`}
          >
            <Code size={14} />
            Editor
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${showPreview ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'text-[#6B635C] hover:bg-[#FDFCF9]'}`}
          >
            <Eye size={14} />
            Live Preview
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 min-h-[70vh]">
        {!showPreview ? (
          <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">HTML / Document Content</span>
              <span className="text-[10px] font-mono text-[#C5A059]">{content.length.toLocaleString()} characters</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-8 font-mono text-sm leading-relaxed outline-none focus:ring-0 resize-none bg-white text-[#1A1A1A]"
              placeholder="Paste your HTML privacy policy here..."
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="bg-[#FDFCF9] rounded-[2.5rem] border border-[#F4EBD0]/50 shadow-sm overflow-hidden flex flex-col">
             <div className="p-4 border-b border-[#F4EBD0]/30 bg-[#F9F7F2] flex items-center">
              <span className="text-[10px] font-bold text-[#B08D43] uppercase tracking-[0.2em]">Luxury Theme Preview</span>
            </div>
            <div className="flex-1 min-h-[80vh] bg-white rounded-[2.5rem] border border-[#F4EBD0]/50 shadow-inner overflow-hidden">
               <iframe 
                title="Privacy Policy Preview"
                className="w-full h-full border-0"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Montserrat:wght@100..900&display=swap" rel="stylesheet">
                      <style>
                        body {
                          font-family: 'Montserrat', sans-serif;
                          color: #1A1A1A;
                          padding: 40px;
                          line-height: 1.6;
                          background-color: #FDFCF9;
                        }
                        h1 {
                          color: #C5A059;
                          font-size: 2.25rem;
                          font-weight: 800;
                          margin-bottom: 2rem;
                          font-family: 'Fraunces', serif;
                          font-style: italic;
                          text-align: center;
                        }
                        h2 {
                          color: #B08D43;
                          font-size: 1.5rem;
                          font-weight: 700;
                          margin-top: 2.5rem;
                          margin-bottom: 1.25rem;
                          border-bottom: 1px solid #F4EBD0;
                          padding-bottom: 0.75rem;
                        }
                        p {
                          color: #4B5563;
                          margin-bottom: 1.25rem;
                          font-size: 0.9375rem;
                        }
                        ul {
                          margin-bottom: 1.5rem;
                          padding-left: 1.5rem;
                        }
                        li {
                          color: #4B5563;
                          margin-bottom: 0.5rem;
                          list-style-type: none;
                          position: relative;
                        }
                        ul li::before {
                          content: "•";
                          color: #C5A059;
                          font-weight: bold;
                          position: absolute;
                          left: -1.25rem;
                        }
                        hr {
                          border: 0;
                          border-top: 1px solid #F4EBD0;
                          margin: 3rem 0;
                        }
                      </style>
                    </head>
                    <body>
                      ${content}
                    </body>
                  </html>
                `}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
