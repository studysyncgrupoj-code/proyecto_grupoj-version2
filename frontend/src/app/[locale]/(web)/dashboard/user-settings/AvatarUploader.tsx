'use client';

import { Button } from '@/components/ui/Button';
import { getInitials } from '@/utilities/avatar';
import { useRef, useState, type ChangeEvent } from 'react';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface AvatarUploaderProps {
  name: string;
  image?: string | null;
}

export function AvatarUploader({ name, image }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState(image ?? null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initials = getInitials(name);
  const displayImage = pendingPreview ?? currentImage;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo

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
    // TODO: acá se abre el editor de recorte antes de habilitar "Guardar"
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
      // TODO: reemplazar por la llamada real cuando exista el endpoint
      // const formData = new FormData();
      // formData.append('avatar', pendingFile);
      // const res = await fetch('/api/user/avatar', { method: 'POST', body: formData });
      // if (!res.ok) throw new Error();
      // const { url } = await res.json();
      // setCurrentImage(url);
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
      // TODO: DELETE /api/user/avatar
      setCurrentImage(null);
    } catch {
      setError('No se pudo eliminar la foto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <Avatar image={displayImage} initials={initials} size={80} />

        {/* Vista previa: cómo se ve en el menú lateral */}
        <div className="text-foreground-muted flex items-center gap-2 text-xs">
          <Avatar image={displayImage} initials={initials} size={32} />
          Así se ve en el menú lateral
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />

        {pendingFile ? (
          <div className="flex flex-wrap gap-2.5">
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
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="social"
              size="sm"
              icon="camera"
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
                className="hover:text-danger"
              >
                Eliminar
              </Button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="text-danger text-xs leading-relaxed">
            {error}
          </p>
        )}

        <p className="text-foreground-subtle text-xs">
          JPG, PNG o WEBP. Máximo 4 MB.
        </p>
      </div>
    </div>
  );
}

function Avatar({
  image,
  initials,
  size,
}: {
  image: string | null;
  initials: string;
  size: number;
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- preview local (blob) además de URL persistida
    return (
      <img
        src={image}
        alt=""
        style={{ width: size, height: size }}
        className="border-border shrink-0 rounded-full border object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      className="bg-primary text-primary-foreground flex shrink-0 items-center justify-center rounded-full font-bold"
    >
      {initials}
    </span>
  );
}
