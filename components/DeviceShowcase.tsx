import Image from "next/image";

/**
 * A looping showcase: each project turns in from the left, settles in the
 * middle, then turns away to the right as the next device arrives.
 *
 * Driven entirely by CSS keyframes rather than JS. Every pass shares one
 * timeline and is offset by a negative delay, so the devices can never drift
 * out of step with each other, and nothing stalls when the tab is
 * backgrounded — the same reason the screenshot strip is CSS-driven.
 */

type Pass = {
  device: "laptop" | "phone";
  /** Path under /public. Desktop captures are 16:10, phone captures 375:812. */
  src: string;
  name: string;
  note: string;
};

// Display order. Add or remove entries freely — the timing divides itself
// across however many are listed.
const passes: Pass[] = [
  {
    device: "laptop",
    src: "/previews/the-forever-note.webp",
    name: "The Forever Note",
    note: "Storefront, payments and a print pipeline",
  },
  {
    device: "phone",
    src: "/previews/mobile/die-bestemming.webp",
    name: "Die Bestemming",
    note: "Phone-first ordering for a family takeaway",
  },
  {
    device: "laptop",
    src: "/previews/koolstoof.webp",
    name: "Koolstoof Delivery",
    note: "Menu, cart and a four-stage order board",
  },
  {
    device: "phone",
    src: "/previews/mobile/the-forever-note.webp",
    name: "The Forever Note",
    note: "The same storefront on a phone",
  },
];

/** Seconds one device spends entering, holding and leaving. */
const SLOT = 4;

/**
 * Code drifting across the back of the stage. Fragments are taken from the
 * projects on show rather than invented, so a developer reading it recognises
 * real work. Each one sits at its own depth: the stage's perspective does the
 * rest, shrinking the far ones and giving the field parallax for free.
 *
 * Every z is negative, which keeps the whole field behind a device standing
 * at the centre without needing to fight over z-index.
 */
type Fragment = {
  text: string;
  /** Percent down the stage. */
  top: number;
  /** Depth in px. Further back reads smaller and fainter. */
  z: number;
  /** Seconds for one crossing. */
  dur: number;
  /** Negative, so the field is already in motion on the first frame. */
  delay: number;
  size: number;
  opacity: number;
  /** A handful in violet, so the blue never reads as a single flat wash. */
  violet?: boolean;
};

const fragments: Fragment[] = [
  { text: "public async Task<IActionResult> Create(OrderDto dto)", top: 6, z: -120, dur: 26, delay: -3, size: 0.76, opacity: 0.5 },
  { text: "const { data } = await supabase.from(\"orders\")", top: 14, z: -300, dur: 34, delay: -19, size: 0.66, opacity: 0.34, violet: true },
  { text: "await _db.SaveChangesAsync();", top: 22, z: -200, dur: 29, delay: -11, size: 0.72, opacity: 0.42 },
  { text: "@app.route(\"/agents/<int:agent_id>\")", top: 31, z: -390, dur: 38, delay: -25, size: 0.62, opacity: 0.28 },
  { text: "type ProjectStatus = \"live\" | \"deployed\";", top: 39, z: -90, dur: 24, delay: -14, size: 0.78, opacity: 0.46 },
  { text: "SELECT * FROM slips WHERE truck_reg = @reg", top: 47, z: -340, dur: 36, delay: -6, size: 0.64, opacity: 0.3 },
  { text: "return NextResponse.json({ ok: true });", top: 55, z: -170, dur: 28, delay: -21, size: 0.73, opacity: 0.44, violet: true },
  { text: "services.AddDbContext<ApplicationDbContext>();", top: 63, z: -260, dur: 32, delay: -9, size: 0.68, opacity: 0.36 },
  { text: "git push origin main", top: 70, z: -410, dur: 40, delay: -31, size: 0.62, opacity: 0.26 },
  { text: "<OrderLine qty={line.quantity} />", top: 77, z: -140, dur: 25, delay: -17, size: 0.75, opacity: 0.45 },
  { text: "if (!ModelState.IsValid) return View(dto);", top: 85, z: -320, dur: 35, delay: -2, size: 0.65, opacity: 0.3 },
  { text: "export default async function Home()", top: 93, z: -220, dur: 30, delay: -27, size: 0.7, opacity: 0.4, violet: true },
];

function CodeDrift() {
  return (
    <div className="dv-code" aria-hidden="true">
      {fragments.map((f) => (
        <span
          key={f.text}
          className={f.violet ? "dv-violet" : undefined}
          style={{
            ["--top" as string]: `${f.top}%`,
            ["--z" as string]: `${f.z}px`,
            ["--dur" as string]: `${f.dur}s`,
            ["--delay" as string]: `${f.delay}s`,
            ["--size" as string]: `${f.size}rem`,
            ["--o" as string]: f.opacity,
          }}
        >
          {f.text}
        </span>
      ))}
    </div>
  );
}

function Laptop({
  src,
  name,
  priority,
}: {
  src: string;
  name: string;
  /**
   * The pass that is on screen at load. The other three must still load
   * eagerly: they spend most of the cycle at opacity 0 and translated off
   * screen, so a lazy image never enters the viewport as far as the loader
   * is concerned and the device arrives with a blank screen.
   */
  priority?: boolean;
}) {
  return (
    <div className="dv-laptop">
      <div className="dv-lid">
        <Image
          src={src}
          alt={`The ${name} site`}
          width={800}
          height={504}
          sizes="(max-width: 768px) 80vw, 560px"
          priority={priority}
          loading={priority ? undefined : "eager"}
          className="block w-full h-auto"
        />
      </div>
      <div className="dv-base" />
    </div>
  );
}

function Phone({
  src,
  name,
  priority,
}: {
  src: string;
  name: string;
  priority?: boolean;
}) {
  return (
    <div className="dv-phone">
      <div className="dv-shell">
        <span className="dv-island" aria-hidden="true" />
        <Image
          src={src}
          alt={`The ${name} site on a phone`}
          width={500}
          height={1083}
          sizes="(max-width: 768px) 38vw, 180px"
          priority={priority}
          loading={priority ? undefined : "eager"}
          className="block w-full h-auto"
        />
      </div>
    </div>
  );
}

export default function DeviceShowcase() {
  return (
    /*
      Decorative: every project here appears again in full, with links and
      write-ups, in the Builds section. A 16-second rotation is nothing but
      noise to a screen reader, so it is hidden from one rather than
      announced four times over.
    */
    <div
      aria-hidden="true"
      className="dv-stage"
      style={{ ["--cycle" as string]: `${SLOT * passes.length}s` }}
    >
      <CodeDrift />

      {passes.map((pass, i) => (
        <div
          key={`${pass.device}-${pass.src}`}
          className="dv-pass"
          style={{
            ["--i" as string]: i,
            ["--n" as string]: passes.length,
          }}
        >
          {pass.device === "laptop" ? (
            <Laptop src={pass.src} name={pass.name} priority={i === 0} />
          ) : (
            <Phone src={pass.src} name={pass.name} priority={i === 0} />
          )}

          <p className="dv-caption">
            <span className="text-paper">{pass.name}</span>
            <span className="text-muted"> — {pass.note}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
