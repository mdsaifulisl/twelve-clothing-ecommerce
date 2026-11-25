import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Save, Eye, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { showAlertModal } from '../../../features/alert/alertSlice';
import { useTermsPage } from '../../../features/terms/useTermsPage';
import type { TermsPageContent } from '../../../features/terms/termsType';
import { useAuth } from '../../../features/auth/useAuth';

interface TermsSectionDraft {
  id: string;
  heading: string; 
  body: string;
}

export const TermsSettings: React.FC = () => {
  const { isAdmin } = useAuth(); 
  const dispatch = useAppDispatch();
  const { content, isLoading, isSaving, hasLoaded, error, fetchContent, saveContent } = useTermsPage();
  const [draft, setDraft] = useState<TermsPageContent | null>(null);
  const formData = draft ?? content;
  const sections: TermsSectionDraft[] = formData.sections.map((section, index) => ({
    ...section,
    id: `section-${index}`,
  }));

  useEffect(() => {
    const request = fetchContent();
    return () => request.abort();
  }, []);

  const changeField = (field: 'title' | 'introduction' | 'effectiveDate', value: string) => {
    if (!isAdmin) return;
    setDraft((current) => ({ ...(current ?? content), [field]: value }));
  };

  const updateSection = (index: number, field: 'heading' | 'body', value: string) => {
    if (!isAdmin) return;
    setDraft((current) => {
      const next = { ...(current ?? content), sections: [...(current ?? content).sections] };
      next.sections[index] = { ...next.sections[index], [field]: value };
      return next;
    });
  };

  const addSection = () => {
    if (!isAdmin) return;
    setDraft((current) => ({
      ...(current ?? content),
      sections: [...(current ?? content).sections, { heading: '', body: '' }],
    }));
  };

  const removeSection = (index: number) => {
    if (!isAdmin) return;
    setDraft((current) => ({
      ...(current ?? content),
      sections: (current ?? content).sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return;
    try {
      await saveContent(formData);
      setDraft(null);
      dispatch(showAlertModal({ message: 'Terms & Conditions saved successfully.', type: 'success', isToast: true }));
    } catch (cause) {
      dispatch(showAlertModal({ message: String(cause), type: 'error', isToast: true }));
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {isAdmin ? 'Terms & Conditions Manager' : 'Terms & Conditions Preview'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin 
              ? 'Edit the legal information shown on your public Terms page.' 
              : 'View the current terms and conditions displayed on the storefront.'}
          </p>
        </div>
        <Link to="/terms" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-xl border border-borderLight bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface">
          <Eye className="h-4 w-4" /> View public page
        </Link>
      </div>

      {!isAdmin && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>You are viewing this section in read-only mode. Only administrators can modify or save Terms & Conditions content.</p>
        </div>
      )}

      {isAdmin && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <p>Terms content loads from and saves to the server. Seller updates are available only through the server's configured development access until seller authentication is implemented.</p>
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500">Loading saved Terms content…</p>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {/* 🟢 যদি Admin হয়, তবে ফর্ম ও প্রিভিউ দুটোই দেখাবে। Admin না হলে শুধু প্রিভিউ প্যানেল পুরো স্ক্রিন জুড়ে দেখাবে। */}
      {isAdmin ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-borderLight bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-borderLight pb-3">
              <FileText className="h-4 w-4 text-cardHeader" />
              <h2 className="text-sm font-bold text-primary">Page details</h2>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Page title *</label>
              <input required maxLength={191} value={formData.title} onChange={(event) => changeField('title', event.target.value)} className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Introduction *</label>
              <textarea required maxLength={20000} rows={3} value={formData.introduction} onChange={(event) => changeField('introduction', event.target.value)} className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Effective date</label>
              <input type="date" required value={formData.effectiveDate} onChange={(event) => changeField('effectiveDate', event.target.value)} className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
            </div>

            <div className="flex items-center justify-between border-b border-borderLight pb-3 pt-2">
              <h2 className="text-sm font-bold text-primary">Terms sections</h2>
              <button type="button" onClick={addSection} disabled={sections.length >= 40} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-cardHeader hover:bg-cardHeader/10 disabled:opacity-50">
                <Plus className="h-4 w-4" /> Add section
              </button>
            </div>

            {sections.map((section, index) => (
              <div key={section.id} className="space-y-3 rounded-xl border border-borderLight p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Section {index + 1}</span>
                  <button type="button" onClick={() => removeSection(index)} aria-label={`Remove section ${index + 1}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input required maxLength={191} value={section.heading} onChange={(event) => updateSection(index, 'heading', event.target.value)} placeholder="Section heading" className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
                <textarea required maxLength={20000} rows={4} value={section.body} onChange={(event) => updateSection(index, 'body', event.target.value)} placeholder="Section text" className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
              </div>
            ))}

            <div className="flex justify-end border-t border-borderLight pt-4">
              <button type="submit" disabled={!hasLoaded || isLoading || isSaving || sections.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-cardHeader px-5 py-2.5 text-sm font-semibold text-white hover:bg-cardAccent disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-4 w-4" /> {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          <section className="h-fit rounded-2xl border border-borderLight bg-white p-6 shadow-xs xl:sticky xl:top-6">
            <div className="mb-5 flex items-center gap-2 border-b border-borderLight pb-3">
              <Eye className="h-4 w-4 text-cardHeader" />
              <h2 className="text-sm font-bold text-primary">Draft preview</h2>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-gray-600">
              <div className="border-b border-borderLight pb-5 text-center">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cardHeader">Please Read Before Ordering</p>
                <h3 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-primary">{formData.title || 'Terms & Conditions'}</h3>
                <p className="mt-2 text-xs text-gray-500">{formData.introduction}</p>
                <p className="mt-2 text-[11px] text-gray-400">Effective: {formData.effectiveDate || 'Not set'}</p>
              </div>
              {sections.map((section, index) => (
                <article key={section.id} className="space-y-2">
                  <h4 className="font-heading font-bold uppercase tracking-wide text-primary">{index + 1}. {section.heading || 'Untitled section'}</h4>
                  <p className="whitespace-pre-wrap">{section.body || 'Section content will appear here.'}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto rounded-2xl border border-borderLight bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-2 border-b border-borderLight pb-3">
            <Eye className="h-4 w-4 text-cardHeader" />
            <h2 className="text-sm font-bold text-primary">Storefront Terms Preview</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-gray-600">
            <div className="border-b border-borderLight pb-5 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cardHeader">Please Read Before Ordering</p>
              <h3 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-primary">{formData.title || 'Terms & Conditions'}</h3>
              <p className="mt-2 text-xs text-gray-500">{formData.introduction}</p>
              <p className="mt-2 text-[11px] text-gray-400">Effective: {formData.effectiveDate || 'Not set'}</p>
            </div>
            {sections.map((section, index) => (
              <article key={section.id} className="space-y-2">
                <h4 className="font-heading font-bold uppercase tracking-wide text-primary">{index + 1}. {section.heading || 'Untitled section'}</h4>
                <p className="whitespace-pre-wrap">{section.body || 'Section content will appear here.'}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsSettings;