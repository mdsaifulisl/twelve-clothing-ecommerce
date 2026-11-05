import React, { useEffect, useState } from 'react';
import { Eye, HelpCircle, Info, Plus, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { showAlertModal } from '../../../features/alert/alertSlice';
import { useFaq } from '../../../features/faq/useFaq';
import { DEFAULT_FAQ_ITEMS } from '../../../features/faq/faqType';
import type { FaqItem } from '../../../features/faq/faqType';

interface FaqDraft {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const FaqSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, isSaving, hasLoaded, error, fetchFaq, saveFaq } = useFaq();
  const [faqs, setFaqs] = useState<FaqDraft[]>(() => DEFAULT_FAQ_ITEMS.map((item, index) => ({ ...item, id: `faq-${index}` })));

  useEffect(() => {
    const request = fetchFaq();
    return () => request.abort();
  }, [fetchFaq]);

  useEffect(() => {
    if (hasLoaded) setFaqs(items.map((item, index) => ({ ...item, id: `faq-${index}-${makeId()}` })));
  }, [hasLoaded, items]);

  const updateFaq = (id: string, field: 'category' | 'question' | 'answer', value: string) => {
    setFaqs((current) => current.map((faq) => faq.id === id ? { ...faq, [field]: value } : faq));
  };
  const addFaq = () => setFaqs((current) => [...current, { id: makeId(), category: '', question: '', answer: '' }]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const savedItems = await saveFaq(faqs.map(({ category, question, answer }): FaqItem => ({ category, question, answer })));
      setFaqs(savedItems.map((item, index) => ({ ...item, id: `faq-saved-${index}-${makeId()}` })));
      dispatch(showAlertModal({ message: 'FAQ content saved successfully.', type: 'success', isToast: true }));
    } catch (cause) {
      dispatch(showAlertModal({ message: String(cause), type: 'error', isToast: true }));
    }
  };

  return (
    <div className="space-y-6 pb-10 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">FAQ Manager</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the questions and answers shown on the public FAQ page.</p>
        </div>
        <Link to="/faq" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-xl border border-borderLight bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface">
          <Eye className="h-4 w-4" /> View FAQ page
        </Link>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <p>FAQ content is saved on the server. Seller updates require the server's configured local development access until seller authentication is implemented.</p>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading saved FAQ content…</p>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-borderLight bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-borderLight pb-3">
            <div className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-cardHeader" /><h2 className="text-sm font-bold text-primary">Questions and answers</h2></div>
            <button type="button" onClick={addFaq} disabled={faqs.length >= 100} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-cardHeader hover:bg-cardHeader/10 disabled:opacity-50"><Plus className="h-4 w-4" /> Add FAQ</button>
          </div>

          {faqs.map((faq, index) => (
            <article key={faq.id} className="space-y-3 rounded-xl border border-borderLight p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Question {index + 1}</span>
                <button type="button" onClick={() => setFaqs((current) => current.filter((item) => item.id !== faq.id))} aria-label={`Remove question ${index + 1}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
              <input required value={faq.category} onChange={(event) => updateFaq(faq.id, 'category', event.target.value)} maxLength={80} placeholder="Category (e.g. Orders)" className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
              <input required value={faq.question} onChange={(event) => updateFaq(faq.id, 'question', event.target.value)} maxLength={250} placeholder="Question" className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
              <textarea required value={faq.answer} onChange={(event) => updateFaq(faq.id, 'answer', event.target.value)} maxLength={5000} rows={3} placeholder="Answer" className="w-full rounded-xl border border-borderLight bg-surface px-3.5 py-2 text-sm outline-none focus:border-cardHeader" />
            </article>
          ))}

          <div className="flex justify-end border-t border-borderLight pt-4">
            <button type="submit" disabled={!hasLoaded || isLoading || isSaving || faqs.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-cardHeader px-5 py-2.5 text-sm font-semibold text-white hover:bg-cardAccent disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" /> {isSaving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>

        <section className="h-fit rounded-2xl border border-borderLight bg-white p-6 shadow-xs xl:sticky xl:top-6">
          <div className="mb-5 flex items-center gap-2 border-b border-borderLight pb-3"><Eye className="h-4 w-4 text-cardHeader" /><h2 className="text-sm font-bold text-primary">Draft preview</h2></div>
          <div className="space-y-4">
            {faqs.map((faq) => <article key={faq.id} className="rounded-xl border border-borderLight p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-cardHeader">{faq.category || 'Category'}</p><h3 className="mt-1 text-sm font-semibold text-primary">{faq.question || 'Question'}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{faq.answer || 'Answer'}</p></article>)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaqSettings;
