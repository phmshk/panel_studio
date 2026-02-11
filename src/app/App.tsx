import { SurfaceCanvas } from "@/modules/SurfaceCanvas";
import { Sidebar } from "@/modules/Sidebar";
import { Toaster } from "@/shared/components/ui/sonner";
import { useInputAutoScroll } from "@/shared/utils";
import { OnboardingModal } from "@/modules/Modal/Modal";
import { useSetOnboardingCompleted } from "./store/selectors";
import { HelpCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function App() {
  useInputAutoScroll();
  const setOnboardingCompleted = useSetOnboardingCompleted();

  return (
    <main className="bg-background relative flex min-h-screen w-full flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      <OnboardingModal />
      <aside className="border-border/40 bg-background/80 order-2 flex w-full flex-col border-r backdrop-blur-xl transition-all lg:order-1 lg:h-full lg:w-150 lg:shadow-xl">
        <div className="flex h-full flex-col p-4 lg:p-6">
          <header className="mb-4 flex items-center gap-3 lg:mb-8">
            <div className="bg-primary ring-primary/20 h-3 w-3 rounded-full ring-4" />
            <h1 className="text-foreground/80 text-lg font-semibold tracking-tight">
              Panel<span className="text-primary">Studio</span>
            </h1>
            <Button
              variant="ghost"
              onClick={() => setOnboardingCompleted(false)}
              className="group text-muted-foreground hover:text-primary p-1 transition-colors"
              title="Show onboarding tutorial"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </header>

          <div className="flex-1 lg:overflow-hidden">
            <Sidebar />
          </div>
        </div>
      </aside>

      <section className="bg-secondary/30 order-1 flex h-screen min-h-[50vh] flex-col lg:order-2 lg:h-full lg:flex-1 lg:p-6">
        <div className="border-border/50 bg-background relative flex h-full w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border shadow-sm transition-all">
          <SurfaceCanvas />
        </div>
      </section>

      <Toaster duration={3000} expand />
    </main>
  );
}

export default App;
