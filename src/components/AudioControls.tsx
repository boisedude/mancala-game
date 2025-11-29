// Audio controls component for muting/unmuting game sounds

import { Button } from '@/components/ui/button'
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'

interface AudioControlsProps {
  isMuted: boolean
  onToggleMute: () => void
}

export function AudioControls({ isMuted, onToggleMute }: AudioControlsProps) {
  return (
    <Button
      onClick={onToggleMute}
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <SpeakerOffIcon className="h-5 w-5" />
      ) : (
        <SpeakerLoudIcon className="h-5 w-5" />
      )}
    </Button>
  )
}
