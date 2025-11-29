import { Link } from 'react-router-dom'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 py-12 text-foreground dark:from-stone-900 dark:via-stone-800 dark:to-amber-950">
      <div className="mx-auto max-w-4xl space-y-8 px-6">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold text-amber-900 dark:text-amber-100">
            The History of Mancala
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">
            One of the oldest known board games in human history
          </p>
        </div>

        <div className="space-y-8 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          {/* Ancient Origins */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Ancient Origins
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Mancala is believed to be one of the oldest board games in the world, with evidence
              suggesting it has been played for thousands of years. The name "mancala" comes from
              the Arabic word <em>naqala</em> (نقلة), meaning "to move."
            </p>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Archaeological evidence indicates that mancala-style games were played in ancient
              Africa as early as the 6th or 7th century CE. Stone boards with carved pits have been
              discovered in Ethiopia, Eritrea, and other parts of East Africa, with some estimates
              dating certain boards to even earlier periods.
            </p>
          </section>

          {/* Spread Across Continents */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Spread Across Continents
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              From its African origins, mancala spread across the ancient world through trade
              routes, migration, and cultural exchange:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-6 text-stone-700 dark:text-stone-300">
              <li>
                <strong>Africa:</strong> The game developed into hundreds of regional variants
                across the continent, including Oware (West Africa), Bao (East Africa), and Kalah
                (North Africa).
              </li>
              <li>
                <strong>Middle East:</strong> Arab traders brought mancala games throughout the
                Middle East, where variants like Mangala and Congkak became popular.
              </li>
              <li>
                <strong>Asia:</strong> The game reached South and Southeast Asia, evolving into
                local versions like Congklak (Indonesia) and Chongkak (Malaysia).
              </li>
              <li>
                <strong>Caribbean:</strong> African diaspora communities brought mancala traditions
                to the Americas, where it's known as Warri or Ayò in some regions.
              </li>
            </ul>
          </section>

          {/* Cultural Significance */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Cultural Significance
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Mancala games hold deep cultural significance in many societies. They were not merely
              entertainment but served important social and educational functions:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-6 text-stone-700 dark:text-stone-300">
              <li>Teaching mathematical concepts like counting and strategic thinking</li>
              <li>Serving as a social gathering point for communities</li>
              <li>Used in traditional ceremonies and rituals in some cultures</li>
              <li>Preserving oral histories and cultural traditions</li>
              <li>Developing patience, foresight, and planning skills</li>
            </ul>
          </section>

          {/* Game Variations */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Hundreds of Variations
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              The mancala family encompasses over 200 distinct games, each with unique rules,
              board configurations, and cultural contexts. Some notable variants include:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-amber-50 p-4 dark:bg-stone-800">
                <h3 className="mb-2 font-semibold text-amber-900 dark:text-amber-200">
                  Oware (Warri)
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Popular in West Africa, features a 2×6 board with capturing rules and strategic
                  depth.
                </p>
              </div>
              <div className="rounded-md bg-amber-50 p-4 dark:bg-stone-800">
                <h3 className="mb-2 font-semibold text-amber-900 dark:text-amber-200">Bao</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Complex East African variant using a 4×8 board, considered one of the most
                  challenging mancala games.
                </p>
              </div>
              <div className="rounded-md bg-amber-50 p-4 dark:bg-stone-800">
                <h3 className="mb-2 font-semibold text-amber-900 dark:text-amber-200">Kalah</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Modern American variant invented in the 1940s, the version implemented in this
                  game with its "capture" and "extra turn" rules.
                </p>
              </div>
              <div className="rounded-md bg-amber-50 p-4 dark:bg-stone-800">
                <h3 className="mb-2 font-semibold text-amber-900 dark:text-amber-200">Congklak</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Indonesian/Malaysian version played with shells or seeds, featuring unique sowing
                  patterns.
                </p>
              </div>
            </div>
          </section>

          {/* Modern Era */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Modern Era
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              In the 20th and 21st centuries, mancala has experienced a renaissance:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-6 text-stone-700 dark:text-stone-300">
              <li>
                <strong>1940s:</strong> Kalah was invented by William Julius Champion Jr., making
                mancala popular in America
              </li>
              <li>
                <strong>1960s-70s:</strong> Commercial board game versions brought mancala to
                Western markets
              </li>
              <li>
                <strong>1990s-2000s:</strong> Computer implementations allowed AI research and
                competitive play
              </li>
              <li>
                <strong>Today:</strong> Digital versions preserve the tradition while making the
                game accessible worldwide
              </li>
            </ul>
          </section>

          {/* Mathematical Interest */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Mathematical and Strategic Depth
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Despite its simple rules, mancala presents fascinating mathematical properties and
              strategic complexity. Computer scientists and mathematicians have studied mancala for:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-6 text-stone-700 dark:text-stone-300">
              <li>Game theory and optimal strategy analysis</li>
              <li>Algorithm development for AI opponents</li>
              <li>Combinatorial mathematics and move sequence analysis</li>
              <li>Educational applications in teaching computational thinking</li>
            </ul>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Some variants like Kalah have been "solved" mathematically, with perfect play
              determined. However, more complex variants like Oware and Bao remain unsolved,
              continuing to challenge players and researchers alike.
            </p>
          </section>

          {/* Legacy */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
              Enduring Legacy
            </h2>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">
              Today, mancala continues to be played by millions of people worldwide. Its endurance
              across millennia and cultures is a testament to the universal appeal of its elegant
              design: simple materials, straightforward rules, and infinite strategic depth. Whether
              played with stones in carved wooden boards or implemented in digital form, mancala
              remains a living connection to our shared human heritage of games and play.
            </p>
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-6 text-center">
          <Link
            to="/"
            className="inline-block rounded-md bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            Play Mancala
          </Link>
          <Link
            to="/about"
            className="inline-block rounded-md border-2 border-amber-600 px-6 py-3 font-semibold text-amber-600 transition-colors hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-stone-800"
          >
            About This Project
          </Link>
        </div>
      </div>
    </div>
  )
}
