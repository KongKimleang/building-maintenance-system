import React from 'react';

function InputPromptModal({
  isOpen,
  title,
  message,
  value,
  onChange,
  onCancel,
  onConfirm,
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  placeholder = 'Type here...',
  loading = false,
  allowEmptyValue = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {message && <p className="mt-2 text-slate-600">{message}</p>}

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows="4"
          placeholder={placeholder}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary"
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || (!allowEmptyValue && !value.trim())}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Submitting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPromptModal;