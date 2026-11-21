// Section 2 (docs/03): the problem, in words. Its visual payoff is the <Spark /> scene that follows.
// Lightly tightened for length; the story and the order are unchanged (DEVIATIONS.md #2).
const HEADLINE = "You made a plan. Then you walked to your room.";

export function Problem() {
  return (
    <section className="problem" id="problem" aria-labelledby="problem-h">
      <div className="wrap">
        <p className="eyebrow rv">Why Stilldesk</p>
        <h2 id="problem-h" className="rv d1">
          {HEADLINE.split(" ").map((w, i) => (
            <span key={i}><span className="w"><span style={{ ["--i" as string]: i }}>{w}</span></span>{" "}</span>
          ))}
        </h2>
        <div className="body">
          <p className="rv" style={{ transitionDelay: ".35s" }}>In a lecture or a free period you think: tonight I will do the DBMS assignment, revise physics chapter 3, and buy a notebook. It feels easy.</p>
          <p className="rv" style={{ transitionDelay: ".55s" }}>Then the walk back happens. By your room, the plan has gone soft. You open your phone “just for a minute,” and an hour disappears.</p>
        </div>
      </div>
    </section>
  );
}
