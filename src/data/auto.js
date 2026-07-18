export const SLIDES = [
  {
    id: 'golden-hour-vows',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Real Wedding',
    title: 'Vows Written in Golden Light',
    subtitle: 'A sunset ceremony overlooking the vineyard hills',
  },
  {
    id: 'first-dance',
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Reception Moments',
    title: 'Every Dance Tells a Story',
    subtitle: 'Intimate celebrations designed around your song',
  },
  {
    id: 'garden-ceremony',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Venue Spotlight',
    title: 'Say Yes Among the Blooms',
    subtitle: 'Botanical garden weddings, curated end to end',
  },
  {
    id: 'ring-exchange',
    image:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'The Details',
    title: 'Two Rings, One Forever',
    subtitle: 'Every detail planned so nothing is left to chance',
  },
  {
    id: 'grand-ballroom',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Signature Events',
    title: 'Ballrooms Built for Forever',
    subtitle: 'Grand celebrations with a personal, warm touch',
  },
]

export const getSlideById = (id) => SLIDES.find((s) => s.id === id)