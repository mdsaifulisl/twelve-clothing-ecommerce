import React, { useState } from 'react';
import { Save, UploadCloud, Link as LinkIcon, CheckCircle2, Eye, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { showAlertModal } from '../../../features/alert/alertSlice';
import { useAboutSection } from '../../../features/aboutSection/useAboutSection';
import type { AboutSection } from '../../../features/aboutSection/aboutSectionType';
import { useAuth } from '../../../features/auth/useAuth';

export const AboutSettings: React.FC = () => {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const { content, isLoading, isSaving, error, fetchContent, saveContent } = useAboutSection();
  const [draft, setDraft] = useState<AboutSection | null>(null);
  const formData = draft ?? content;

  const [isSaved, setIsSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const request = fetchContent();
    return () => request.abort();
  }, [fetchContent]);

  const changeField = (field: keyof AboutSection, value: string) => {
    setDraft((previous) => ({ ...(previous ?? content), [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveContent({
        title: formData.title,
        paragraph1: formData.paragraph1,
        paragraph2: formData.paragraph2,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        ...(selectedFile ? { image: selectedFile } : {}),
      });
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setDraft(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 3000);
      dispatch(showAlertModal({ message: 'About section saved successfully.', type: 'success', isToast: true }));
    } catch (cause) {
      dispatch(showAlertModal({ message: String(cause), type: 'error', isToast: true }));
    }
  };

  // ইমেজ ফাইল সিলেক্ট ও প্রিভিউ অপশন
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      dispatch(showAlertModal({ message: 'Please upload a valid image file (JPG, PNG, WEBP).', type: 'error', isToast: true }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {isAdmin ? "About Section Manager" : "About Section Preview"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin 
              ? "Manage title, descriptions, CTA button and upload store images" 
              : "View the current storefront About section"}
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>About section saved successfully!</span>
          </div>
        )}
      </div>

      {isLoading && <p className="text-xs text-gray-500">Loading saved About content…</p>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {/* 🟢 যদি ইউজার Admin হয়, তবে ফর্ম ও প্রিভিউ দুটোই দেখাবে। আর না হলে শুধু প্রিভিউ প্যানেল দেখাবে। */}
      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editor Form */}
          <form onSubmit={handleSave} className="lg:col-span-6 bg-white rounded-2xl border border-borderLight p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-primary border-b border-borderLight pb-2">Edit Content</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Main Heading *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => changeField('title', e.target.value)}
                className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1 *</label>
              <textarea
                required
                rows={4}
                value={formData.paragraph1}
                onChange={(e) => changeField('paragraph1', e.target.value)}
                className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2</label>
              <textarea
                rows={3}
                value={formData.paragraph2}
                onChange={(e) => changeField('paragraph2', e.target.value)}
                className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => changeField('buttonText', e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-cardHeader" />
                  <span>Button Target URL</span>
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => changeField('buttonLink', e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>
            </div>

            {/* Drag and Drop Image File Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Upload Banner Image</label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-borderLight rounded-2xl p-6 text-center hover:border-cardHeader transition-colors bg-surface/50 cursor-pointer relative"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-cardHeader mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">
                  Click or drag & drop image to upload
                </p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800">
                  <span className="truncate max-w-[200px]">📁 {selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-borderLight flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving…' : 'Save Changes'}</span>
              </button>
            </div>
          </form>

          {/* Live Preview Panel (Admin view) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-cardHeader" />
              <span>Live Storefront Preview</span>
            </div>

            <div className="bg-white rounded-2xl border border-borderLight p-6 shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase text-primary">
                    {formData.title || "Heading Title"}
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {formData.paragraph1}
                  </p>
                  {formData.paragraph2 && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {formData.paragraph2}
                    </p>
                  )}
                  {formData.buttonText && (
                    <div className="pt-2">
                      <span className="inline-block bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                        {formData.buttonText}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-gray-100">
                  <img
                    src={previewUrl ?? formData.imageUrl}
                    alt="About Section Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 🟢 যদি Admin না হয়, তবে শুধু প্রিভিউ প্যানেল পুরো স্ক্রিন জুড়ে দেখাবে */
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-cardHeader" />
            <span>Storefront Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-borderLight p-6 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase text-primary">
                  {formData.title || "Heading Title"}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {formData.paragraph1}
                </p>
                {formData.paragraph2 && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {formData.paragraph2}
                  </p>
                )}
                {formData.buttonText && (
                  <div className="pt-2">
                    <span className="inline-block bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                      {formData.buttonText}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-gray-100">
                <img
                  src={previewUrl ?? formData.imageUrl}
                  alt="About Section Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSettings;