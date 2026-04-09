'use client';

import { useState } from 'react';
import { Save, Eye, Code, CheckCircle, AlertCircle, X, Loader2, Info } from 'lucide-react';
import { updatePdfTemplate, generatePdfPreview } from './actions';

interface PdfEditorProps {
  propertyId: string;
  propertyName: string;
  houseRules: string;
  initialTemplate: string;
  initialFooter: string;
  logoUrl?: string | null;
}

const DEFAULT_PDF_TEMPLATE = `
<h1 style="text-align: center; color: #C5A059;">{{propertyName}}</h1>
<p style="text-align: center; color: #B08D43;"><b>GUEST STAY AGREEMENT</b></p>
<hr/>
<br/>

<table>
  <tr>
    <td style="color: #6B7280;"><b>PRIMARY GUEST</b></td>
    <td style="color: #6B7280;"><b>STAY PERIOD</b></td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{guestName}}</b></td>
    <td style="color: #1A1A1A;"><b>{{checkinDate}} to {{checkoutDate}}</b></td>
  </tr>
</table>

<br/>
<hr/>
<br/>

<h3 style="color: #C5A059;">PROPERTY RULES & CONDITIONS</h3>
<p>{{houseRules}}</p>

[PAGE_BREAK]

<h3 style="color: #C5A059;">GUEST ACKNOWLEDGEMENT</h3>
<p>I confirm that I have read the house rules and I agree to respect them entirely during my stay at <b>{{propertyName}}</b>.</p>

<br/>
<br/>
<p style="text-align: right; color: #B08D43;"><b>GUEST SIGNATURE</b></p>
{{signature}}
`;

export default function PdfEditor({ propertyId, propertyName, houseRules, initialTemplate, initialFooter, logoUrl }: PdfEditorProps) {
  const defaultAgreement = "I confirm that I have read and agree to respect the rules during my stay.";
  
  const extractAgreement = (html: string) => {
    const match = html.match(/<!-- AGREEMENT_TEXT_START -->([\s\S]*?)<!-- AGREEMENT_TEXT_END -->/);
    return match ? match[1].trim() : defaultAgreement;
  };

  const generateTemplate = (text: string) => `
<table style="width: 100%; border-bottom: 0.5px solid #C5A059; padding-bottom: 20px;">
  <tr>
    <td style="width: 80px; vertical-align: middle;">
      <!-- LOGO AREA (Automatically placed top-left) -->
    </td>
    <td style="padding-left: 20px; vertical-align: middle;">
      <h1 style="color: #C5A059; margin: 0; padding: 0; line-height: 1;">{{propertyName}}</h1>
      <h3 style="color: #4B5563; margin: 0; padding: 0; font-size: 10px; font-weight: normal; letter-spacing: 1px;">GUEST STAY AGREEMENT</h3>
    </td>
  </tr>
</table>

<br/>

<table style="width: 100%;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">GUEST</td>
    <td style="color: #6B7280; font-size: 8px; text-align: right;">STAY PERIOD</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{guestName}}</b></td>
    <td style="color: #1A1A1A; text-align: right;"><b>{{checkinDate}} to {{checkoutDate}}</b></td>
  </tr>
</table>

<br/>
<hr style="color: #C5A059; height: 0.5px;"/>
<br/>

<h3 style="color: #C5A059; text-align: center; letter-spacing: 2px;">ACKNOWLEDGEMENT AND CONDITIONS</h3>
<br/>
<small style="color: #4B5563;">
{{houseRules}}
</small>
<br/>
<p style="text-align: center; color: #1A1A1A; font-style: italic;">
  <!-- AGREEMENT_TEXT_START -->
  ${text}
  <!-- AGREEMENT_TEXT_END -->
</p>

<br/><br/>

<table style="width: 100%; border-top: 0.5px solid #E5E7EB; padding-top: 20px;">
  <tr>
    <td style="color: #6B7280; font-size: 8px;">DATE OF ARRIVAL:</td>
  </tr>
  <tr>
    <td style="color: #1A1A1A;"><b>{{checkinDate}}</b></td>
  </tr>
</table>

<br/>
<!-- SIGNATURE ENGINE BLOCK -->
{{signature}}
`;

  const [agreementText, setAgreementText] = useState(extractAgreement(initialTemplate || ""));
  const [footer, setFooter] = useState(initialFooter || `© 2026 ${propertyName} • Secure Digital Registration`);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const finalTemplate = generateTemplate(agreementText);
      const result = await updatePdfTemplate(propertyId, finalTemplate, footer);
      if (result.success) {
        setStatus({ type: 'success', message: 'Agreement updated successfully!' });
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

  const handleFetchPreview = async () => {
    setIsGeneratingPdf(true);
    try {
      const finalTemplate = generateTemplate(agreementText);
      const url = await generatePdfPreview(propertyName, finalTemplate, houseRules, footer, logoUrl);
      setPdfPreviewUrl(url);
      setShowPreview(true);
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to generate PDF.' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const placeholders = [
    { tag: '{{guestName}}', desc: "Guest's full name" },
    { tag: '{{guestEmail}}', desc: "Guest's email address" },
    { tag: '{{propertyName}}', desc: "Official property name" },
    { tag: '{{checkinDate}}', desc: "Check-in date" },
    { tag: '{{checkoutDate}}', desc: "Check-out date" },
    { tag: '{{signature}}', desc: "Guest's signature image" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {status && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-500 min-w-[320px] max-w-md ${
          status.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="text-green-500" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
          <div className="flex flex-col flex-1">
            <span className="font-bold text-sm tracking-tight">{status.type === 'success' ? 'Saved' : 'Action Required'}</span>
            <span className="text-xs opacity-80 leading-relaxed font-medium">{status.message}</span>
          </div>
          <button onClick={() => setStatus(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor/Preview Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-3xl border border-gray-100 sticky top-24 z-10">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPreview(false)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${!showPreview ? 'bg-[#C5A059] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Code size={14} />
                Content Editor
              </button>
              <button 
                onClick={handleFetchPreview}
                disabled={isGeneratingPdf}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 ${showPreview ? 'bg-[#C5A059] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {isGeneratingPdf ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                Real PDF Preview
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Design'}
            </button>
          </div>

          <div className="min-h-[70vh]">
            {!showPreview ? (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[70vh]">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <Code size={14} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> Guest Acknowledgement Text</span>
                   </div>
                </div>
                <textarea
                  value={agreementText}
                  onChange={(e) => setAgreementText(e.target.value)}
                  className="flex-1 w-full p-8 text-sm leading-relaxed outline-none focus:ring-0 resize-none bg-white text-gray-900"
                  placeholder="e.g. I confirm that I have read and agree to respect the house rules..."
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-[2.5rem] border border-gray-200 shadow-inner overflow-hidden flex justify-center h-[75vh] w-full relative">
                 {pdfPreviewUrl ? (
                   <iframe 
                    title="Real PDF Preview"
                    className="w-full h-full border-0 absolute inset-0"
                    src={pdfPreviewUrl}
                  />
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                     <Loader2 size={32} className="animate-spin text-[#C5A059]" />
                     <p className="text-sm font-medium tracking-wide">Generating pixel-perfect PDF...</p>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4EBD0] rounded-2xl flex items-center justify-center text-[#B08D43]">
                <Info size={20} />
              </div>
              <h3 className="text-sm font-bold tracking-tight text-gray-900">Placeholders</h3>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
              Use these tags in your HTML design. They will be replaced with real guest data.
            </p>
            <div className="space-y-3 pt-2">
              {placeholders.map((p) => (
                <div key={p.tag} className="group">
                  <code className="text-[10px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2 py-1 rounded-md border border-[#F4EBD0] block w-fit mb-1 group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                    {p.tag}
                  </code>
                  <span className="text-[10px] text-gray-400 font-medium ml-1">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-gray-200">
            <h3 className="text-xs font-black uppercase tracking-[0.3em]">PDF Footer</h3>
            <textarea
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="w-full h-32 bg-white/10 border border-white/20 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:border-[#C5A059] resize-none"
              placeholder="e.g. Property License Number, Address..."
            />
            <p className="text-[10px] opacity-60 font-medium leading-relaxed">
              This text will appear at the bottom of every generated page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
