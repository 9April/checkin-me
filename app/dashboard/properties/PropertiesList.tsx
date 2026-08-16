'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, Plus, Settings2, Power, PowerOff } from 'lucide-react';
import { togglePropertyStatus, createNewProperty } from './actions';
import { setActiveProperty } from '@/lib/property-actions';

export default function PropertiesList({ initialProperties }: { initialProperties: any[] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    await togglePropertyStatus(id, !currentStatus);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      await createNewProperty(newName);
      router.push('/dashboard/settings');
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  };

  const goToSettings = async (id: string) => {
    await setActiveProperty(id);
    router.push('/dashboard/settings');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Add New Property</label>
          <input 
            type="text" 
            placeholder="e.g. Seaside Villa" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059]"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>
        <button 
          onClick={handleCreate}
          disabled={isCreating || !newName.trim()}
          className="px-6 py-2 bg-[#B08D43] text-white rounded-xl font-bold hover:bg-[#9A7B39] transition-colors disabled:opacity-50 flex items-center gap-2 h-[42px] shrink-0"
        >
          <Plus size={18} />
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className={`bg-white rounded-3xl border ${property.isActive ? 'border-[#E5E7EB]' : 'border-gray-200 opacity-75'} shadow-sm overflow-hidden flex flex-col`}>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${property.isActive ? 'bg-[#F4EBD0] text-[#B08D43]' : 'bg-gray-100 text-gray-400'}`}>
                  <Building size={24} />
                </div>
                <button 
                  onClick={() => handleToggle(property.id, property.isActive)}
                  className={`p-2 rounded-lg transition-colors ${property.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                  title={property.isActive ? "Disable Property" : "Enable Property"}
                >
                  {property.isActive ? <Power size={20} /> : <PowerOff size={20} />}
                </button>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{property.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{property.isActive ? 'Active' : 'Disabled'}</p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <button 
                onClick={() => goToSettings(property.id)}
                disabled={!property.isActive}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Settings2 size={16} />
                Manage Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
