import { useBgImgUrl, useProjectActions } from "@/app/store/selectors";
import { Button } from "@/shared/components/ui/button";
import { processImage } from "@/shared/utils/processImage";
import { ImagePlus, Trash2, OctagonX, Loader2, ScanLine } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";

export const BgImgSettings = () => {
  const bgImgUrl = useBgImgUrl();
  const { setBgImgUrl } = useProjectActions();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.custom(() => (
        <div className="bg-background flex items-start gap-2 rounded-md border border-red-600 px-2 py-4 text-red-600 shadow-sm">
          <OctagonX />
          <h3 className="text-sm font-medium">
            An error occurred. Please try again
          </h3>
        </div>
      ));

      return;
    }

    try {
      setIsProcessing(true);

      const optimizedImage = await processImage(file);

      setBgImgUrl(optimizedImage);
    } catch (error) {
      console.error(error);

      toast.custom(() => (
        <div className="bg-background flex items-start gap-2 rounded-md border border-red-600 px-2 py-4 text-red-600 shadow-sm">
          <OctagonX />
          <h3 className="text-sm font-medium">
            An error occurred. Please try again
          </h3>
        </div>
      ));
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  return (
    <div className="group border-border/40 bg-secondary/10 hover:bg-secondary/20 hover:border-primary/20 relative flex h-16 w-full items-center justify-between rounded-2xl border px-3 transition-all">
      {!bgImgUrl && (
        <input
          type="file"
          className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isProcessing}
          title="Upload custom image"
        />
      )}
      <div className="flex items-center gap-3">
        <div className="border-border/20 bg-background relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border shadow-sm">
          {isProcessing ? (
            <Loader2 className="text-primary h-5 w-5 animate-spin" />
          ) : bgImgUrl ? (
            <img
              src={bgImgUrl}
              alt="Reference"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <ScanLine className="text-muted-foreground/60 h-5 w-5" />
          )}
        </div>

        <span className="text-foreground text-sm font-semibold">
          {bgImgUrl ? "Uploaded Image" : "Select your image"}
        </span>
      </div>

      <div className="z-20 cursor-pointer">
        {bgImgUrl ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full transition-colors"
            onClick={() => setBgImgUrl(null)}
            title="Remove image"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="bg-background hover:bg-background hover:text-primary pointer-events-none h-9 rounded-xl shadow-sm"
          >
            <ImagePlus className="mr-2 h-3.5 w-3.5" />
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};
