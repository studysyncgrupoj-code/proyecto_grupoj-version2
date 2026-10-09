'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from '@/i18n/navigation';
import { AppIcon } from '@/lib/iconMap';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProfileAvatarSettingsProps {
  name: string;
  email: string;
  roleLabel: string;
  image?: string | null;
  messages: {
    title: string;
    description: string;
    changeAria: string;
    uploadAria: string;
    save: string;
    saving: string;
    cancel: string;
    change: string;
    upload: string;
    remove: string;
    limit: string;
    previewTitle: string;
    visibility: string;
    saved: string;
    removed: string;
    errors: {
      unsupportedType: string;
      fileTooLarge: string;
      uploadFailed: string;
      removeFailed: string;
    };
  };
}

export function ProfileAvatarSettings({
  name,
  email,
  roleLabel,
  image,
  messages,
}: ProfileAvatarSettingsProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPreviewRef = useRef<string | null>(null);
  const retainedPreviewRef = useRef<string | null>(null);
  const [currentImage, setCurrentImage] = useState(image ?? null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const displayImage = pendingPreview ?? currentImage;
  const hasPendingChange = !!pendingFile;

  useEffect(
    () => () => {
      const urls = new Set([
        pendingPreviewRef.current,
        retainedPreviewRef.current,
      ]);
      urls.forEach((url) => url && URL.revokeObjectURL(url));
    },
    [],
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      pendingPreviewRef.current = null;
      setPendingPreview(null);
      setPendingFile(null);
      setFeedback(null);
      setError(messages.errors.unsupportedType);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      pendingPreviewRef.current = null;
      setPendingPreview(null);
      setPendingFile(null);
      setFeedback(null);
      setError(messages.errors.fileTooLarge);
      return;
    }

    setError(null);
    setFeedback(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(file);
    const preview = URL.createObjectURL(file);
    pendingPreviewRef.current = preview;
    setPendingPreview(preview);
  };

  const handleCancel = () => {
    if (pendingPreview && pendingPreview !== currentImage) {
      URL.revokeObjectURL(pendingPreview);
    }
    pendingPreviewRef.current = null;
    setPendingPreview(null);
    setPendingFile(null);
    setError(null);
    setFeedback(null);
  };

  const handleSave = async () => {
    if (!pendingFile) return;
    setIsSaving(true);
    setError(null);
    try {
      // TODO: Reemplazar por la mutación de URQL para actualizar el avatar/perfil
      setCurrentImage(pendingPreview);
      if (retainedPreviewRef.current) {
        URL.revokeObjectURL(retainedPreviewRef.current);
        retainedPreviewRef.current = null;
      }
      handleCancel();
      setFeedback(messages.saved);
      router.refresh();
    } catch {
      setError(messages.errors.uploadFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // TODO: Reemplazar por la mutación de URQL para remover el avatar
      setCurrentImage(null);
      if (retainedPreviewRef.current) {
        URL.revokeObjectURL(retainedPreviewRef.current);
        retainedPreviewRef.current = null;
      }
      setFeedback(messages.removed);
      router.refresh();
    } catch {
      setError(messages.errors.removeFailed);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="border-border bg-surface rounded-3xl border p-6 sm:p-8">
      <header className="mb-6">
        <h2 className="text-foreground text-lg font-semibold">
          {messages.title}
        </h2>
        <p className="text-foreground-muted mt-1 text-sm">
          {messages.description}
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={
                currentImage ? messages.changeAria : messages.uploadAria
              }
              className="group border-border bg-background focus-visible:ring-primary relative size-32 overflow-hidden rounded-full border focus-visible:ring-2 focus-visible:outline-none"
            >
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage}
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="bg-primary text-primary-foreground flex size-full items-center justify-center text-4xl font-bold"
                ></span>
              )}
              <span className="bg-foreground/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <AppIcon
                  category="ui"
                  name="camera"
                  className="text-background size-6"
                />
              </span>
            </button>

            {currentImage && (
              <span
                aria-hidden="true"
                className="bg-success text-success-foreground border-surface absolute right-0.5 bottom-0.5 flex size-6 items-center justify-center rounded-full border-2"
              >
                <AppIcon
                  category="ui"
                  name="checkCircle"
                  className="size-3.5"
                />
              </span>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={handleFileChange}
          />

          {hasPendingChange ? (
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? messages.saving : messages.save}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                {messages.cancel}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button
                variant="social"
                size="sm"
                icon="upload"
                onClick={() => inputRef.current?.click()}
              >
                {currentImage ? messages.change : messages.upload}
              </Button>
              {currentImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="trash"
                  onClick={handleRemove}
                  disabled={isSaving}
                  className="hover:bg-danger/10 hover:text-danger"
                >
                  {messages.remove}
                </Button>
              )}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="text-danger text-center text-xs leading-relaxed"
            >
              {error}
            </p>
          )}

          {feedback && !error && (
            <p role="status" className="text-success text-center text-xs">
              {feedback}
            </p>
          )}

          <p className="text-foreground-subtle text-center text-xs sm:text-left">
            {messages.limit}
          </p>
        </div>

        <div className="border-border flex flex-col gap-3 border-t pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
          <span className="text-foreground-muted text-xs font-semibold">
            {messages.previewTitle}
          </span>

          <div className="border-border bg-background flex items-center gap-3 rounded-xl border p-3">
            {displayImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImage}
                alt=""
                className="border-border size-10 shrink-0 rounded-full border object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              ></span>
            )}
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm leading-tight font-bold">
                {name}
              </p>
              <p className="text-foreground-subtle truncate text-xs">{email}</p>
              <p className="text-foreground-muted truncate text-xs font-medium">
                {roleLabel}
              </p>
            </div>
          </div>

          <p className="text-foreground-subtle flex items-center gap-1.5 text-xs">
            <AppIcon
              category="ui"
              name="lockOpen"
              className="size-3.5 shrink-0"
            />
            {messages.visibility}
          </p>
        </div>
      </div>
    </section>
  );
}
