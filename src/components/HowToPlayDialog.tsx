// How to play dialog: rules, strategy and a short history, as plain text

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface HowToPlayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartTutorial?: () => void
  /** When provided (first-visit welcome), shows a primary "Start playing" action. */
  onStartPlaying?: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </section>
  )
}

export function HowToPlayDialog({ open, onOpenChange, onStartTutorial, onStartPlaying }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">How to play</DialogTitle>
          <DialogDescription>
            Finish with more stones in your store than your opponent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <Section title="The board">
            <p>
              Each player has six pits and one store. Every pit starts with four stones. Your pits are
              the bottom row and your store is the tall oval on the right. Your opponent has the top
              row and the store on the left. You go first.
            </p>
          </Section>

          <Section title="On your turn">
            <p>
              Pick any pit on your side that has stones. You lift all of them and drop one in each pit
              moving counter-clockwise: to the right along your row, into your store, then along the
              opponent's row. Skip your opponent's store.
            </p>
            <p>After your last stone lands, play passes to your opponent, unless a special rule applies.</p>
          </Section>

          <Section title="Go again">
            <p>
              If your last stone lands in your own store, you move again. Count ahead to chain several
              of these in a row.
            </p>
          </Section>

          <Section title="Capture">
            <p>
              If your last stone lands in an empty pit on your side and the pit opposite has stones,
              you take both: your last stone and everything opposite go to your store.
            </p>
          </Section>

          <Section title="How the game ends">
            <p>
              The game ends when all six pits on one side are empty. Stones left on the other side go
              to the store of the player who owns that side. The bigger store wins.
            </p>
          </Section>

          <Section title="Tips">
            <ul className="list-disc space-y-1 pl-5">
              <li>Count where your last stone will land before you move.</li>
              <li>Hover over a pit to preview whether the move gives a capture or another turn.</li>
              <li>Do not leave an empty pit facing a full one on your side.</li>
              <li>Emptying your side first lets you collect what is left on the other.</li>
            </ul>
          </Section>

          <Section title="A short history">
            <p>
              Mancala is among the oldest board games in the world. The name comes from the Arabic
              naqala, "to move." Stone boards with carved pits have been found in Ethiopia, Eritrea and
              elsewhere in East Africa, dating back at least to the 6th or 7th century.
            </p>
            <p>
              The game spread along trade routes across Africa, the Middle East and Asia. Hundreds of
              variants exist today, including Oware, Bao, Kalah and Congklak. This version follows
              Kalah.
            </p>
          </Section>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {onStartTutorial && (
            <Button
              variant="outline"
              className="h-11"
              onClick={() => {
                onOpenChange(false)
                onStartTutorial()
              }}
            >
              Interactive tutorial
            </Button>
          )}
          <Button variant={onStartPlaying ? 'ghost' : 'outline'} className="h-11" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onStartPlaying && (
            <Button className="h-11" onClick={onStartPlaying}>
              Start playing
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
