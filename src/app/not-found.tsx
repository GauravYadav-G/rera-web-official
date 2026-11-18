import { PrimaryLink } from "@/components/ui/primary-link";
export default function NotFound() {
  return <main id="main-content" className="not-found container"><span className="mono muted">404 / AN EMPTY FILE</span><h1 className="display-l">Nothing built<br /><em>here. Yet.</em></h1><p className="body-copy">This page doesn’t exist. Let’s get you back to the beginning.</p><PrimaryLink href="/">Back to the beginning</PrimaryLink></main>;
}
