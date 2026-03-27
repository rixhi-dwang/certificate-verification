import { useState } from 'react';
import { verifyCertificate } from '../services/api';

function getField(data, keys, fallback = '-') {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }

  return fallback;
}

export default function VerifyCard() {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleVerify(event) {
    event.preventDefault();

    const cleanId = certificateId.trim();
    if (!cleanId) {
      setError('Certificate ID is required.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyCertificate(cleanId);

      if (response?.status === 'valid' && response?.data) {
        setResult({
          type: 'valid',
          payload: response.data,
        });
      } else {
        setResult({
          type: 'invalid',
          message: response?.message || 'Invalid Certificate',
        });
      }
    } catch {
      setError('Failed to verify certificate. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const validData = result?.type === 'valid' ? result.payload : null;

  return (
    <section className="glass-card card-hover rounded-2xl p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white sm:text-xl">Certificate Verification</h2>
        <p className="mt-1 text-sm text-slate-300/80">Verify participant certificates instantly using Certificate ID.</p>
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleVerify}>
        <input
          value={certificateId}
          onChange={(event) => setCertificateId(event.target.value)}
          placeholder="Enter Certificate ID"
          className="input-base flex-1"
          maxLength={120}
        />
        <button type="submit" disabled={loading} className="btn-primary min-w-44">
          {loading ? 'Verifying...' : 'Verify Certificate'}
        </button>
      </form>

      {error ? <div className="mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

      {loading ? (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-900 border-t-cyan-300" />
        </div>
      ) : null}

      {result?.type === 'valid' && validData ? (
        <div className="result-enter mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-emerald-50">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Certificate Found</h3>
            <span className="rounded-full border border-emerald-200/50 bg-emerald-400/20 px-3 py-1 text-xs font-medium">
              {'Verified \u2705'}
            </span>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/20 bg-black/10 p-3">
              <p className="text-emerald-200/80">Name</p>
              <p className="mt-1 font-medium text-white">{getField(validData, ['name', 'full_name'])}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/20 bg-black/10 p-3">
              <p className="text-emerald-200/80">Certificate ID</p>
              <p className="mt-1 font-medium text-white">{getField(validData, ['certificate_no', 'certificate_id', 'id'])}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/20 bg-black/10 p-3">
              <p className="text-emerald-200/80">Event</p>
              <p className="mt-1 font-medium text-white">{getField(validData, ['event', 'event_name'])}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/20 bg-black/10 p-3">
              <p className="text-emerald-200/80">College</p>
              <p className="mt-1 font-medium text-white">{getField(validData, ['college', 'institution'])}</p>
            </div>
          </div>
        </div>
      ) : null}

      {result?.type === 'invalid' ? (
        <div className="result-enter mt-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-rose-100">
          <h3 className="text-base font-semibold">Invalid Certificate</h3>
          <p className="mt-1 text-sm">{result.message || 'Invalid Certificate'}</p>
        </div>
      ) : null}
    </section>
  );
}
