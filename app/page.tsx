'use client';
import { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { saveBooking } from './actions';

export default function Home() {
  const [country, setCountry] = useState<'MA' | 'OTHER'>('MA');
  const [noCIN, setNoCIN] = useState(false);
  const sigRef = useRef<SignaturePad>(null);
  const [sigData, setSigData] = useState('');

  const isPassport = country === 'OTHER' || noCIN;

  const clearSig = () => {
    sigRef.current?.clear();
    setSigData('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signatureData = sigRef.current?.getTrimmedCanvas().toDataURL('image/png') || '';
    setSigData(signatureData);

    const formData = new FormData(e.currentTarget);
    formData.set('signature', signatureData);
    saveBooking(formData);
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Pre-check-in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="guestName" placeholder="Full name" required className="input" />
        <input name="guestEmail" type="email" placeholder="Email" required className="input" />
        <input name="checkin" type="date" required className="input" />

        <label className="block font-medium">Country of document issue</label>
        <select
          name="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value as 'MA' | 'OTHER');
            setNoCIN(false);
          }}
          className="input"
        >
          <option value="MA">Morocco</option>
          <option value="OTHER">Outside Morocco</option>
        </select>

        {/* ----------  MOROCCO ONLY  ---------- */}
        {country === 'MA' && (
          <>
            <div className="flex items-center gap-2">
              <input
                name="noCIN"
                id="noCIN"
                type="checkbox"
                checked={noCIN}
                onChange={(e) => setNoCIN(e.target.checked)}
              />
              <label htmlFor="noCIN" className="text-sm">
                Je n&apos;ai pas de CIN / I don&apos;t have a CIN
              </label>
            </div>

            {/* CIN fields – only when noCIN is false */}
            {!noCIN && (
              <div className="space-y-2">
                <label className="block font-medium">CIN recto (front)</label>
                <input name="cinFront" type="file" accept="image/*" required />

                <label className="block font-medium">CIN verso (back)</label>
                <input name="cinBack" type="file" accept="image/*" required />

                <label className="block font-medium">CIN number</label>
                <input
                  name="idNumber"
                  type="text"
                  placeholder="AA000000"
                  required
                  className="input"
                />
              </div>
            )}
          </>
        )}

        {/* ----------  PASSPORT (outside OR no-CIN)  ---------- */}
        <div className={`space-y-2 ${!isPassport ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block font-medium">
            {country === 'OTHER' ? 'Passport photo page' : 'Passport (photo page)'}
          </label>
          <input name="passport" type="file" accept="image/*" required={isPassport} disabled={!isPassport} />

          <label className="block font-medium">Passport number</label>
          <input
            name="idNumber"
            type="text"
            placeholder="A00000000"
            required={isPassport}
            disabled={!isPassport}
            className="input"
          />
        </div>

        <label className="block font-medium">Signature</label>
        <div className="border rounded">
          <SignaturePad ref={sigRef} canvasProps={{ width: 700, height: 200, className: 'sigCanvas' }} penColor="black" />
        </div>
        <button type="button" onClick={clearSig} className="text-sm underline">
          Clear
        </button>
        <input type="hidden" name="signature" value={sigData} />

        <button className="btn">Submit</button>
      </form>
    </main>
  );
}