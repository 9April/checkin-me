'use client';
import { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { saveBooking } from './actions';
import DatePicker from './components/DatePicker';
import CameraCapture from './components/CameraCapture';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const sigRef = useRef<SignaturePad>(null);
  const [sigData, setSigData] = useState('');
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  // Traveler document states - default to passport mode (no country selected, passport mode)
  const [travelers, setTravelers] = useState<Array<{
    country: 'MA' | 'OTHER' | '';
    noCIN: boolean;
  }>>([{ country: '', noCIN: true }]);

  // Update travelers array when adults/kids change
  useEffect(() => {
    const totalTravelers = adults + kids;
    setTravelers(prev => {
      const newTravelers = [...prev];
      while (newTravelers.length < totalTravelers) {
        newTravelers.push({ country: '', noCIN: true }); // Default to passport mode
      }
      return newTravelers.slice(0, totalTravelers);
    });
  }, [adults, kids]);

  const clearSig = () => {
    sigRef.current?.clear();
    setSigData('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate signature
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert('Please provide a signature before submitting.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const signatureData = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      if (!signatureData || signatureData === 'data:,') {
        throw new Error('Invalid signature. Please sign again.');
      }
      setSigData(signatureData);

      const formData = new FormData(e.currentTarget);
      formData.set('signature', signatureData);
      
      // Add selfie file if captured from camera
      if (selfieFile) {
        formData.set('selfie', selfieFile);
      }
      
      await saveBooking(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pre-check-in</h1>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing your submission...</h2>
            <p className="text-gray-600">Please wait while we process your documents and generate your PDF.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full name</label>
              <input name="guestName" placeholder="Enter your full name" required className="input" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input name="guestEmail" type="email" placeholder="Enter your email" required className="input" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in date</label>
              <DatePicker
                name="checkin"
                required
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Travelers Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Number of Travelers</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Adults</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={isLoading || adults <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  −
                </button>
                <input
                  name="adults"
                  type="number"
                  min="1"
                  max="20"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  required
                  className="input flex-1 text-center"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(20, adults + 1))}
                  disabled={isLoading || adults >= 20}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kids (under 18)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setKids(Math.max(0, kids - 1))}
                  disabled={isLoading || kids <= 0}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  −
                </button>
                <input
                  name="kids"
                  type="number"
                  min="0"
                  max="20"
                  value={kids}
                  onChange={(e) => setKids(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                  required
                  className="input flex-1 text-center"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setKids(Math.min(20, kids + 1))}
                  disabled={isLoading || kids >= 20}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Total travelers: <span className="font-semibold">{adults + kids}</span>
          </p>
        </div>

        {/* Document Information - One per Traveler */}
        {travelers.map((traveler, index) => {
          const isPassport = traveler.country === 'OTHER' || traveler.country === '' || traveler.noCIN;
          const travelerType = index < adults ? 'Adult' : 'Kid';
          const travelerNumber = index + 1;
          
          return (
            <div key={index} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                Document Information - Traveler {travelerNumber} ({travelerType})
              </h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Country of document issue</label>
                <div className="relative">
                  <select
                    name={`traveler_${index}_country`}
                    value={traveler.country}
                    onChange={(e) => {
                      const newTravelers = [...travelers];
                      const selectedCountry = e.target.value as 'MA' | 'OTHER' | '';
                      newTravelers[index].country = selectedCountry;
                      // If Morocco is selected, uncheck noCIN (show CIN fields)
                      // If World or empty is selected, set noCIN to true (show passport)
                      if (selectedCountry === 'MA') {
                        newTravelers[index].noCIN = false;
                      } else {
                        newTravelers[index].noCIN = true;
                      }
                      setTravelers(newTravelers);
                    }}
                    className="input appearance-none bg-white pr-10 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    disabled={isLoading}
                    required
                  >
                    <option value="">Select country</option>
                    <option value="MA">Morocco</option>
                    <option value="OTHER">World</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ----------  MOROCCO ONLY  ---------- */}
              {traveler.country === 'MA' && !traveler.noCIN && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      name={`traveler_${index}_noCIN`}
                      id={`noCIN_${index}`}
                      type="checkbox"
                      checked={traveler.noCIN}
                      onChange={(e) => {
                        const newTravelers = [...travelers];
                        newTravelers[index].noCIN = e.target.checked;
                        setTravelers(newTravelers);
                      }}
                      disabled={isLoading}
                    />
                    <label htmlFor={`noCIN_${index}`} className="text-sm">
                      Je n&apos;ai pas de CIN / I don&apos;t have a CIN
                    </label>
                  </div>

                  {/* CIN fields – only when noCIN is false */}
                  {!traveler.noCIN && (
                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">CIN recto (front)</label>
                        <input name={`traveler_${index}_cinFront`} type="file" accept="image/*" required disabled={isLoading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">CIN verso (back)</label>
                        <input name={`traveler_${index}_cinBack`} type="file" accept="image/*" required disabled={isLoading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">CIN number</label>
                        <input
                          name={`traveler_${index}_idNumber`}
                          type="text"
                          placeholder="AA000000"
                          required={!isLoading}
                          className="input"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ----------  PASSPORT (default mode, outside OR no-CIN)  ---------- */}
              {isPassport && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Passport photo page
                    </label>
                    <input name={`traveler_${index}_passport`} type="file" accept="image/*" required disabled={isLoading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Passport number</label>
                    <input
                      name={`traveler_${index}_idNumber`}
                      type="text"
                      placeholder="A00000000"
                      required
                      disabled={isLoading}
                      className="input"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Verification */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Verification</h2>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Face selfie (for verification)</label>
            <CameraCapture
              name="selfie"
              required
              disabled={isLoading}
              onCapture={(file) => setSelfieFile(file)}
            />
          </div>
        </div>

        {/* Signature */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">Signature</h2>
          <div className="space-y-2">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white" style={{ minHeight: '200px' }}>
              <SignaturePad 
                ref={sigRef} 
                canvasProps={{ 
                  width: 600, 
                  height: 200, 
                  className: 'sigCanvas',
                  style: { 
                    pointerEvents: isLoading ? 'none' : 'auto',
                    display: 'block',
                    width: '100%',
                    maxWidth: '100%',
                    height: '200px',
                    backgroundColor: 'white'
                  }
                }} 
                penColor="black" 
                backgroundColor="white"
              />
            </div>
            <button type="button" onClick={clearSig} className="text-sm underline text-gray-600 hover:text-gray-800" disabled={isLoading}>
              Clear signature
            </button>
            <input type="hidden" name="signature" value={sigData} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button className="btn w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}