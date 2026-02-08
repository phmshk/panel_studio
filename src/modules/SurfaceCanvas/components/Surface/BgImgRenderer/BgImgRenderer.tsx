import { useBgImgUrl } from "@/app/store/selectors";
import imgbg from "@/shared/assets/img/bg.webp";
import { MAX_SURFACE_WIDTH } from "@/shared/constants";

interface BgImgRendererProps {
  totalWidth: number;
  maxHeight: number;
  surfaceHeight: number;
  surfaceX: number;
  surfaceWidth: number;
  surfaceId: string;
}

export const BgImgRenderer = (props: BgImgRendererProps) => {
  const {
    totalWidth,
    surfaceHeight,
    maxHeight,
    surfaceX,
    surfaceWidth,
    surfaceId,
  } = props;

  const bgImgUrl = useBgImgUrl();

  // "Example: 400cm width = [img] + [mirrored img]" implies 50/50 split of the total width.
  const isMirrored = totalWidth > MAX_SURFACE_WIDTH;

  // if mirrored => 2 segments (normal + mirrored) we split the total width into two segments: [Normal] + [Mirrored]
  // each segment takes half of space => totalWidth/2
  // if not mirrored => use one full width segment
  const segmentWidth = isMirrored ? totalWidth / 2 : totalWidth;
  // surface is bottom aligned, so the top of this surface is at (maxHeight - surfaceHeight) in global coords.
  // image should be drawen at
  const yCoord = -(maxHeight - surfaceHeight);

  const clipId = `clip-for-surface-${surfaceId}`;

  const activeUrl = bgImgUrl || imgbg;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect width={surfaceWidth} height={surfaceHeight} />
        </clipPath>
      </defs>

      {/* fallback color if image load failed */}
      {!activeUrl && (
        <rect
          width={surfaceWidth}
          height={surfaceHeight}
          className="fill-white"
        />
      )}

      <g clipPath={`url(#${clipId})`} className="pointer-events-none">
        <image
          href={activeUrl}
          x={-surfaceX}
          y={yCoord}
          width={segmentWidth}
          height={maxHeight}
          preserveAspectRatio="xMidYMid slice" // crop always begins from the center
        />

        {isMirrored && (
          <image
            href={activeUrl}
            x={segmentWidth - surfaceX}
            y={yCoord}
            width={segmentWidth}
            height={maxHeight}
            preserveAspectRatio="xMidYMid slice" // crop always begins from the center
            className="origin-center scale-x-[-1] transform-fill"
          />
        )}
      </g>
    </g>
  );
};
