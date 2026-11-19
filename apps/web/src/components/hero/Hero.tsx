"use client";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EarlyBird } from "@/components/ui/EarlyBird";
import { SCENE_MARKUP } from "./scene-markup";
import { useHeroScroll } from "./useHeroScroll";

/**
 * Cinematic Lamp hero. A tall "stage" holds one pinned (sticky) scene; scrolling through the stage
 * scrubs the lamp, light, notebook and camera. All copy is real HTML text (docs/03, section 1).
 * The scene itself is decorative (aria-hidden); the lamp's state is also written as a text label.
 */
export function Hero() {
  const stage = useRef<HTMLElement>(null);
  useHeroScroll(stage);

  return (
    <section className="stage" id="top" ref={stage} aria-label="Stilldesk">
      <div className="pin">
        <div className="scene" aria-hidden="true" dangerouslySetInnerHTML={{ __html: SCENE_MARKUP }} />

        <div className="copy">
          <p className="badge"><i aria-hidden="true" />Launching soon on Android</p>
          <h1><span>Plan it.</span><span>Sit down.</span><span>Study.</span></h1>
          <p className="sub">Stilldesk catches your plan the moment you think of it, hands it back when you reach your desk, and keeps distractions away only while you study.</p>
          <div className="cta">
            <ButtonLink href="/#waitlist">Join the waitlist</ButtonLink>
            <ButtonLink href="/#loop" variant="text">See how it works</ButtonLink>
          </div>
          <p className="micro">
            Free to join. People on the list get <EarlyBird />. For college students aged 18 and over. Android first, iPhone later.
          </p>
        </div>

        <p className="lamp-label"><i aria-hidden="true" /><span id="lbl">Ready</span></p>
        <div className="cue" aria-hidden="true"><span>Scroll</span><b /></div>
      </div>
    </section>
  );
}
