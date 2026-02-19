"use client";

import { useRef, useState } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  initials: string;
}

export function AvatarUpload({ initials }: AvatarUploadProps) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentImage = previewUrl || session?.user?.image || undefined;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du téléchargement.");
      }

      await updateUser({ image: data.url });

      toast.success("Photo de profil mise à jour", {
        description: "Votre nouvelle photo est maintenant visible.",
      });
    } catch (err) {
      setPreviewUrl(null);
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      });
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="relative group w-fit">
      <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
        <AvatarImage src={currentImage} alt={session?.user?.name || "Avatar"} />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Online indicator */}
      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
        <Sparkles className="h-3 w-3 text-white" aria-hidden="true" />
      </div>

      {/* Upload overlay */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "absolute inset-0 rounded-full flex items-center justify-center",
          "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isUploading && "opacity-100 cursor-not-allowed"
        )}
        aria-label="Changer la photo de profil"
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" aria-hidden="true" />
        ) : (
          <Camera className="h-6 w-6 text-white" aria-hidden="true" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Sélectionner une photo de profil"
      />
    </div>
  );
}
