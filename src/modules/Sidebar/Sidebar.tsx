import { useBreakpoint } from "@/shared/utils/hooks/useBreakpoint";
import { SidebarDesktop } from "./components/step/SidebarDesktop";
import { SidebarMobile } from "./components/step/SidebarMobile";
import { useSidebarSteps } from "./components/step/useSidebarSteps";

export const Sidebar = () => {
  const isMobile = useBreakpoint();
  const steps = useSidebarSteps();

  if (isMobile) {
    return <SidebarMobile steps={steps} />;
  }

  return <SidebarDesktop steps={steps} />;
};
