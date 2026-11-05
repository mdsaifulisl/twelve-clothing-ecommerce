import React, { useEffect } from 'react';
import { BadgeCheck, CreditCard, Mail, PackageCheck, ShieldAlert, ShoppingBag, Truck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePublicSettings } from '../../../features/settings/usePublicSettings';
import { useTermsPage } from '../../../features/terms/useTermsPage';

const sectionIcons = [BadgeCheck, ShoppingBag, PackageCheck, Truck, CreditCard, ShieldAlert];

export const TermsPage: React.FC = () => {
  const { settings } = usePublicSettings();
  const { content, error, fetchContent } = useTermsPage();
  const storeName = settings?.general.storeName || 'Twelve Clothing';
  const contactEmail = settings?.general.contactEmail;
  const contactPhone = settings?.general.contactPhone;

  useEffect(() => {
    const request = fetchContent();
    return () => request.abort();
  }, [fetchContent]);

  const formattedDate = content.effectiveDate
    ? new Date(`${content.effectiveDate}T00:00:00`).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="bg-white text-primary">
      <Helmet>
        {/* <title>{content.title} | {storeName}</title> */}
        <meta name="description" content={`${content.title} for shopping with ${storeName}.`} />
      </Helmet>

      <div className="bg-gray-50 py-12 sm:py-16 border-b border-borderLight text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-cardHeader mb-2 inline-block">Please Read Before Ordering</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading uppercase tracking-wide">{content.title}</h1>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-light">{content.introduction}</p>
          {formattedDate && <p className="mt-2 text-[11px] text-gray-400">Effective: {formattedDate}</p>}
        </div>
      </div>

      {error && <p role="status" className="mx-auto mt-4 max-w-4xl px-4 text-center text-xs text-gray-500">Showing the available Terms content; the latest version could not be loaded.</p>}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-sm leading-relaxed text-gray-600 font-light">
        {content.sections.map((section, index) => {
          const Icon = sectionIcons[index % sectionIcons.length];
          return (
            <section key={`${section.heading}-${index}`} className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Icon size={24} className="text-cardHeader" />
                <h2 className="text-lg font-bold font-heading uppercase tracking-wide">{index + 1}. {section.heading}</h2>
              </div>
              {section.body.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="whitespace-pre-wrap">{paragraph}</p>
              ))}
            </section>
          );
        })}

        <section className="bg-gray-50 p-8 rounded-lg border border-borderLight space-y-3">
          <div className="flex items-center gap-3 text-primary"><Mail size={22} className="text-cardHeader" /><h2 className="font-heading font-bold text-base uppercase tracking-wide">Questions about these terms?</h2></div>
          <p className="text-xs sm:text-sm text-gray-600">Contact the store using the details below. For information about personal data, please also read our Privacy Policy.</p>
          <p className="text-xs sm:text-sm font-semibold text-primary flex flex-wrap gap-x-4 gap-y-1">
            {contactEmail && <span>Email: <a href={`mailto:${contactEmail}`} className="text-cardHeader hover:underline">{contactEmail}</a></span>}
            {contactPhone && <span>Phone: <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="text-cardHeader hover:underline">{contactPhone}</a></span>}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
