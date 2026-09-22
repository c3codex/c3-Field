const VIDEO_URL = "/api/free-media?asset=c3_field_public_intro_million_dollar_mission_v1"
const BACKDROP_URL = "/api/free-media?asset=c3_field_connect_hero_backdrop_v1"

export default function MillionDollarMissionLanding() {
  return (
    <main className="mdm-page">
      <header className="mdm-header">
        <a className="mdm-brand" href="/" aria-label="c3 Community Partners home">
          <span className="mdm-brand-mark">c3</span>
          <span>Community Partners</span>
        </a>
        <nav className="mdm-nav" aria-label="Primary">
          <a href="#mission">MISSION</a>
          <a href="/community-potential">THE MODEL</a>
          <a className="mdm-nav-cta" href="/connect">CONNECT</a>
        </nav>
      </header>

      <section className="mdm-hero">
        <div className="mdm-hero-copy">
          <p className="mdm-kicker">THE MILLION DOLLAR MISSION</p>
          <h1>What if one small town could prove collective action still works?</h1>
          <p className="mdm-hero-lead">
            A live test of the c3 model: connect the people, resources, places, and possibilities already in a community — then see what they can create together.
          </p>
          <div className="mdm-actions">
            <a className="mdm-button mdm-button-primary" href="/connect">CONNECT TO THE MISSION <span aria-hidden="true">↗</span></a>
            <a className="mdm-button mdm-button-quiet" href="#film">WATCH THE STORY</a>
          </div>
        </div>

        <div className="mdm-video-shell" id="film">
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="The Million Dollar Mission"
          >
            Your browser does not support this video.
          </video>
        </div>
      </section>

      <section className="mdm-question" id="mission">
        <p className="mdm-kicker">THE QUESTION</p>
        <h2>Can significant capital become more useful when a community can see what it already has?</h2>
        <p>
          The Million Dollar Mission is an applied test of c3 Community Partners. The goal is not to drop money into a place and call it transformation. The goal is to organize people, resources, responsibilities, and outcomes so value can stay connected to the community that helps create it.
        </p>
      </section>

      <section className="mdm-c3-grid" aria-label="The c3 model">
        <article>
          <span>01</span>
          <h3>CONNECT</h3>
          <p>Make people, needs, skills, places, relationships, and resources visible to one another.</p>
        </article>
        <article>
          <span>02</span>
          <h3>CONTRIBUTE</h3>
          <p>Give people a clear way to bring time, knowledge, money, tools, labor, property, creativity, or care into a shared effort.</p>
        </article>
        <article>
          <span>03</span>
          <h3>CREATE</h3>
          <p>Turn connected contributions into useful outcomes that can be seen, reviewed, and carried forward.</p>
        </article>
      </section>

      <section className="mdm-backdrop" style={{backgroundImage:`linear-gradient(90deg,rgba(11,13,14,.92),rgba(11,13,14,.25)),url("${BACKDROP_URL}")`}}>
        <div className="mdm-backdrop-copy">
          <p className="mdm-kicker">ONE TOWN. ONE TEST. REAL OUTCOMES.</p>
          <h2>The resource is not just the money. The resource is the community.</h2>
          <p>
            c3 begins with the premise that potential already exists. The work is to create enough structure for that potential to become visible, connected, useful, and shared.
          </p>
          <a className="mdm-button mdm-button-primary" href="/connect">I WANT IN <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="mdm-outcomes">
        <div className="mdm-outcomes-intro">
          <p className="mdm-kicker">WHAT WE ARE TRYING TO PROVE</p>
          <h2>Not activity. Outcomes people can actually see.</h2>
        </div>
        <div className="mdm-outcome-list">
          <div><strong>Visible participation</strong><span>People can see where they fit and what is happening.</span></div>
          <div><strong>Meaningful contribution</strong><span>What people bring does not disappear inside the system.</span></div>
          <div><strong>Local benefit</strong><span>Resources connect to people and places in ways that matter locally.</span></div>
          <div><strong>Retained value</strong><span>More of what gets created can remain connected to the community.</span></div>
          <div><strong>Verifiable outcomes</strong><span>Progress is recorded clearly enough to review, learn from, and repeat.</span></div>
        </div>
      </section>

      <section className="mdm-final">
        <p className="mdm-kicker">CONNECT · CONTRIBUTE · CREATE</p>
        <h2>Bring a person. Bring a place. Bring a resource. Bring a question.</h2>
        <p>The mission starts by making what already exists visible.</p>
        <a className="mdm-button mdm-button-primary" href="/connect">CONNECT TO THE MISSION <span aria-hidden="true">↗</span></a>
      </section>

      <footer className="mdm-footer">
        <div>
          <strong>c3 Community Partners</strong>
          <span>© 2026 c3 Community Partners DAO, LLC. All rights reserved.</span>
          <span>c3 Field is operated by c3 Community Partners DAO, LLC.</span>
        </div>
        <nav aria-label="Footer">
          <a href="/community-potential">Community Potential</a>
          <a href="https://measuresregistry.com/governed-environments">Governed Environments</a>
          <a href="https://measuresregistry.com/privacy">Privacy</a>
          <a href="https://measuresregistry.com/terms">Terms</a>
          <a href="mailto:stephanie.joanne@c3field.com">Contact</a>
        </nav>
      </footer>
    </main>
  )
}
