
export default function Hero() {
  const src = '/assets/hero.jpeg';
  const props = {};

  return <img className="hero-image" src={src} alt="Hero" {...props} />
}
