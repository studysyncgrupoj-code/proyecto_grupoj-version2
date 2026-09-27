'use client';

import { Button } from '@/components/ui/Button';
import { AppIcon } from '@/lib/iconMap';
import { getInitials } from '@/utilities/avatar';
import { useRef, useState, type ChangeEvent } from 'react';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProfileAvatarSettingsProps {
  name: string;
  email: string;
  roleLabel: string;
  image?: string | null;
}

export function ProfileAvatarSettings({
  name,
  email,
  roleLabel,
  image,
}: ProfileAvatarSettingsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState(image ?? null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initials = getInitials(name);
  const displayImage = pendingPreview ?? currentImage;
  const hasPendingChange = !!pendingFile;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no soportado. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('La imagen no puede superar los 4 MB.');
      return;
    }

    setError(null);
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    // TODO [Needs Work]: recorte de imagen (crop) sin implementar todavía.
    // Acá debería abrirse el editor antes de habilitar "Guardar".
  };

  const handleCancel = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview(null);
    setPendingFile(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!pendingFile) return;
    setIsSaving(true);
    setError(null);
    try {
      // TODO [API]: POST /api/user/avatar (multipart/form-data, requiere sesión
      // autenticada) — subir y persistir la nueva foto en el backend.
      // TODO [Needs Work]: se guarda el archivo tal cual se seleccionó; falta
      // aplicar el recorte (crop) antes de subirlo.
      setCurrentImage(pendingPreview);
      handleCancel();
    } catch {
      setError('No se pudo guardar la foto. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // TODO [API]: DELETE /api/user/avatar (requiere sesión autenticada) —
      // elimina la foto persistida y el usuario vuelve al avatar por defecto.
      setCurrentImage(null);
    } catch {
      setError('No se pudo eliminar la foto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="border-border bg-surface rounded-3xl border p-6 sm:p-8">
      <header className="mb-6">
        <h2 className="text-foreground text-lg font-semibold">
          Foto de perfil
        </h2>
        <p className="text-foreground-muted mt-1 text-sm">
          Se muestra en tus salas de estudio, tus mensajes y el menú lateral.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
        {/* Columna 1: avatar y acciones */}
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={
                currentImage ? 'Cambiar foto de perfil' : 'Subir foto de perfil'
              }
              className="group border-border bg-background focus-visible:ring-primary relative size-32 overflow-hidden rounded-full border focus-visible:ring-2 focus-visible:outline-none"
            >
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- preview local (blob) o URL persistida
                <img
                  src={displayImage}
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="bg-primary text-primary-foreground flex size-full items-center justify-center text-4xl font-bold"
                >
                  {initials}
                </span>
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
                {isSaving ? 'Guardando...' : 'Guardar foto'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
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
                {currentImage ? 'Cambiar foto' : 'Subir foto'}
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
                  Eliminar
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

          <p className="text-foreground-subtle text-center text-xs sm:text-left">
            JPG, PNG o WEBP · máx. 4 MB
          </p>
        </div>

        {/* Columna 2: vista previa, igual al bloque real del sidebar */}
        <div className="border-border flex flex-col gap-3 border-t pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
          <span className="text-foreground-muted text-xs font-semibold">
            Así se ve en StudySync
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
              >
                {initials}
              </span>
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
            Solo visible para usuarios con sesión iniciada en StudySync.
          </p>
        </div>
      </div>
    </section>
  );
}
