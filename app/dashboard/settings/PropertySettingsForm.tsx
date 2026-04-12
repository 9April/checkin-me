'use client';

import { useState } from 'react';
import { Save, Info, ListTodo, Clock, CheckCircle, AlertCircle, X, Palette, Layout } from 'lucide-react';
import { updateProperty } from './actions';

interface PropertySettingsFormProps {
  property: {
    id: string;
    name: string;
    adminEmail?: string | null;
    checkinTime: string;
    checkoutTime: string;
    houseRules?: string | null;
    privacyPolicy?: string | null;
    formTitle?: string | null;
    formSubtitle?: string | null;
    primaryColor?: string | null;
    showWhatsApp: boolean;
    requireSelfie: boolean;
    requireIdPhotos: boolean;
  };
  initialRules: string;
}

export default function PropertySettingsForm({ property, initialRules }: PropertySettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [primaryColor, setPrimaryColor] = useState(property.primaryColor || '#FF385C');

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const adminEmail = formData.get('adminEmail') as string;
    
    if (!name || !adminEmail) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSaving(true);
    setStatus(null);
    try {
      const result = await updateProperty(formData);
      if (result.success) {
        setStatus({ type: 'success', message: 'Settings saved successfully!' });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to save settings.' });
      }
    } catch (error) {
      console.error('Action failed:', error);
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 text-[#111827] pb-12">
      <input type="hidden" name="propertyId" value={property.id} />

      {status && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-500 min-w-[320px] max-w-md ${
          status.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="text-green-500" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
          <div className="flex flex-col flex-1">
            <span className="font-bold text-sm tracking-tight">{status.type === 'success' ? 'Changes Saved' : 'Action Required'}</span>
            <span className="text-xs opacity-80 leading-relaxed font-medium">{status.message}</span>
          </div>
          <button 
            type="button"
            onClick={() => setStatus(null)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Property Info & Branding Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden text-black">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Info size={20} />
              </div>
              <h2 className="text-lg font-bold">General Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#374151]">Property Name</label>
                <input 
                  name="name"
                  defaultValue={property.name}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#374151]">Admin Email</label>
                <input 
                  name="adminEmail"
                  type="email"
                  defaultValue={property.adminEmail || ''}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#374151]">Check-in Time</label>
                  <input name="checkinTime" defaultValue={property.checkinTime} className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#374151]">Check-out Time</label>
                  <input name="checkoutTime" defaultValue={property.checkoutTime} className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden text-black">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Layout size={20} />
              </div>
              <h2 className="text-lg font-bold">Form Customization</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#374151]">Form Main Title</label>
                  <input 
                    name="formTitle" 
                    placeholder="e.g. Pre-check-in"
                    defaultValue={property.formTitle || ''} 
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#374151]">Form Subtitle</label>
                  <input 
                    name="formSubtitle" 
                    placeholder="e.g. Welcome to our villa"
                    defaultValue={property.formSubtitle || ''} 
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#374151]">Field Visibility & Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium">Show WhatsApp Field</span>
                    <input type="hidden" name="showWhatsApp" value={property.showWhatsApp ? 'true' : 'false'} />
                    <button 
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input.value = input.value === 'true' ? 'false' : 'true';
                        e.currentTarget.classList.toggle('bg-blue-600');
                        e.currentTarget.classList.toggle('bg-gray-300');
                        (e.currentTarget.firstChild as HTMLElement).classList.toggle('translate-x-5');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${property.showWhatsApp ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${property.showWhatsApp ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium">Require Selfie Verification</span>
                    <input type="hidden" name="requireSelfie" value={property.requireSelfie ? 'true' : 'false'} />
                    <button 
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input.value = input.value === 'true' ? 'false' : 'true';
                        e.currentTarget.classList.toggle('bg-blue-600');
                        e.currentTarget.classList.toggle('bg-gray-300');
                        (e.currentTarget.firstChild as HTMLElement).classList.toggle('translate-x-5');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${property.requireSelfie ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${property.requireSelfie ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium">Require ID Document Photos</span>
                    <input type="hidden" name="requireIdPhotos" value={property.requireIdPhotos ? 'true' : 'false'} />
                    <button 
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input.value = input.value === 'true' ? 'false' : 'true';
                        e.currentTarget.classList.toggle('bg-blue-600');
                        e.currentTarget.classList.toggle('bg-gray-300');
                        (e.currentTarget.firstChild as HTMLElement).classList.toggle('translate-x-5');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${property.requireIdPhotos ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${property.requireIdPhotos ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden text-black">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                <Palette size={20} />
              </div>
              <h2 className="text-lg font-bold">Brand Color</h2>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  name="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-0 cursor-pointer overflow-hidden p-0"
                />
                <div className="flex-1">
                  <input 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-mono"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['#FF385C', '#E31C5F', '#3B82F6', '#10B981', '#111827', '#222222'].map((c) => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${primaryColor === c ? 'border-gray-500 shadow-sm' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-xs text-[#6B7280]">Used for buttons and highlight colors.</p>
            </div>
          </section>
        </div>
      </div>

      {/* House Rules Section */}
      <section className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden text-black">
        <div className="p-6 border-b border-[#E5E7EB] flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <ListTodo size={20} />
          </div>
          <h2 className="text-lg font-bold">House Rules</h2>
        </div>
        <div className="p-8 space-y-4">
          <textarea 
            name="houseRules"
            defaultValue={initialRules}
            rows={10}
            className="w-full px-5 py-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#EF4444] outline-none transition-all font-mono text-sm leading-relaxed"
            placeholder="Enter each rule on a new line..."
          />
          <p className="text-xs text-[#6B7280]">Enter each rule on a new line. These will appear in the guest agreement.</p>
        </div>
      </section>

      <div className="sticky bottom-8 z-30 flex justify-end">
        <button 
          type="submit"
          disabled={isSaving}
          style={{ backgroundColor: primaryColor }}
          className={`px-10 py-5 text-white font-bold rounded-2xl shadow-2xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isSaving ? 'Saving Changes...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  );
}
