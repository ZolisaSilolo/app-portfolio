/**
 * Decorative page-length photo background: a top image that cross-fades into
 * an optional bottom image toward the end of the page.
 *
 * `tone` tells the CSS how to blend each photo with the theme:
 *  - "night": dark photo with lights (screen-blended in dark mode)
 *  - "day":   bright photo (dimmed in dark mode, near full colour in light mode)
 *
 * Render as the first child of a `relative isolate overflow-hidden` container
 * so the -z-10 layer stays behind that container's content.
 */
type Tone = 'night' | 'day';

export type SceneryImage = {
  src: string;
  tone: Tone;
  /** CSS object-position, e.g. "center 65%" */
  position?: string;
};

type PageSceneryProps = {
  top: SceneryImage;
  bottom?: SceneryImage;
};

export const PageScenery = ({ top, bottom }: PageSceneryProps) => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <div className={`scenery-layer ${bottom ? 'scenery-top' : 'scenery-full'} scenery-${top.tone}`}>
      <img src={top.src} alt="" loading="lazy" decoding="async" style={{ objectPosition: top.position }} />
    </div>
    {bottom && (
      <div className={`scenery-layer scenery-bottom scenery-${bottom.tone}`}>
        <img src={bottom.src} alt="" loading="lazy" decoding="async" style={{ objectPosition: bottom.position ?? 'center bottom' }} />
      </div>
    )}
    <div className="scenery-scrim" />
  </div>
);
