import React, { useEffect, useMemo, useState } from 'react';
import { HelpCircle, Search, ChevronDown, PackageCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useFaq } from '../../../features/faq/useFaq';

export const FaqPage: React.FC = () => {
  const { items: faqs, error, fetchFaq } = useFaq();
  const [category, setCategory] = useState('All questions');
  const [search, setSearch] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const categories = useMemo(() => ['All questions', ...Array.from(new Set(faqs.map((faq) => faq.category)))], [faqs]);

  useEffect(() => {
    const request = fetchFaq();
    return () => request.abort();
  }, [fetchFaq]);

  useEffect(() => {
    if (!openQuestion && faqs.length) setOpenQuestion(faqs[0].question);
  }, [faqs, openQuestion]);

  const visibleFaqs = useMemo(() => faqs.filter((faq) =>
    (category === 'All questions' || faq.category === category)
    && `${faq.question} ${faq.answer}`.toLowerCase().includes(search.trim().toLowerCase()),
  ), [category, search]);

  return (
    <main className="min-h-screen bg-white text-primary">
      <Helmet>
        <title>Frequently Asked Questions | Twelve Clothing</title>
        <meta name="description" content="Find answers about orders, delivery, payment, and products at Twelve Clothing." />
      </Helmet>
      <header className="border-b border-borderLight bg-gray-50 px-4 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cardHeader/10 text-cardHeader"><HelpCircle size={25} /></span>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cardHeader">Here to help</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-wide sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">Quick answers about shopping with Twelve Clothing.</p>
          <label className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-xl border border-borderLight bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
          </label>
        </div>
      </header>

      {error && <p role="status" className="mx-auto mt-4 max-w-4xl px-4 text-center text-xs text-gray-500">Showing the available FAQ content; the latest version could not be loaded.</p>}

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-14">
        <nav aria-label="FAQ categories" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors ${category === item ? 'bg-cardAccent text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              {item}
            </button>
          ))}
        </nav>

        <section className="space-y-3" aria-live="polite">
          {visibleFaqs.length ? visibleFaqs.map((faq) => {
            const isOpen = openQuestion === faq.question;
            return (
              <article key={faq.question} className="overflow-hidden rounded-xl border border-borderLight bg-white">
                <button aria-expanded={isOpen} onClick={() => setOpenQuestion(isOpen ? null : faq.question)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6">
                  <span><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-cardHeader">{faq.category}</span><span className="font-semibold text-primary">{faq.question}</span></span>
                  <ChevronDown size={19} className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="border-t border-borderLight px-5 py-4 text-sm leading-relaxed text-gray-600 sm:px-6">{faq.answer}</p>}
              </article>
            );
          }) : <div className="rounded-xl border border-dashed border-borderLight px-6 py-12 text-center text-sm text-gray-500">No matching questions found. Try another search.</div>}
          <div className="mt-8 rounded-2xl bg-gray-50 p-6 sm:p-8">
            <h2 className="font-heading text-lg font-bold text-primary">Still need help?</h2>
            <p className="mt-1 text-sm text-gray-500">Our team can help with your order, delivery, or product questions.</p>
            <a href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cardHeader px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"><PackageCheck size={16} /> Contact us</a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FaqPage;
