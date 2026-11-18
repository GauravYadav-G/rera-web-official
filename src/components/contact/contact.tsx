import { story } from "@/data/story";
import { site } from "@/data/site";
import { SectionLabel, TextLink } from "@/components/ui";
import { PrimaryLink } from "@/components/ui/primary-link";
import { BriefForm } from "./brief-form";
import { ChapterTransition } from "@/components/dither-seam";

export function Contact() {
  return <><ChapterTransition to="ink" /><section id="contact" className="section contact-section motion-section"><div className="container"><SectionLabel number="06" suffix="BACK TO AN EMPTY FILE">WHAT COMES NEXT</SectionLabel><div className="contact-grid"><div className="contact-copy"><h2 className="display-l reveal">The next<br />big idea could<br />start with <em>you.</em></h2><div className="body-copy">{story.contact.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="contact-actions"><PrimaryLink href="#brief" focusBrief>Start a project</PrimaryLink>{site.contactEmail && <TextLink href={`mailto:${site.contactEmail}`}>Let’s have a conversation</TextLink>}</div></div><BriefForm /></div><div className="contact-bottom mono"><span>ONE IDEA. ONE CONVERSATION. A NEW BEGINNING.</span><span>INDEPENDENT IN SPIRIT. OPEN TO POSSIBILITY.</span></div></div></section></>;
}
