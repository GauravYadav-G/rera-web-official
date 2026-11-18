"use client";
import { Fragment, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { InterfaceContent } from "@/components/build-stack/interface-content";
import { IntelligenceContent } from "@/components/build-stack/intelligence-content";
import { RegistrationMarks } from "@/components/ui";
import { services } from "@/data/services";

function RequestFlow() {
  return <div className="request-preview"><svg viewBox="0 0 460 300" fill="none" aria-hidden="true"><g className="diagram-connectors"><path d="M89 118H160M254 118H321V61H350M321 118V190H350M208 145V248H350"/><path d="M30 265H427" strokeDasharray="3 5" opacity=".3"/></g><g className="diagram-boxes"><rect x="5" y="92" width="84" height="52"/><rect x="160" y="92" width="94" height="52"/><rect x="350" y="35" width="104" height="52"/><rect x="350" y="164" width="104" height="52"/><rect x="350" y="232" width="104" height="33"/></g><g className="diagram-text"><text x="47" y="123" textAnchor="middle">CLIENT</text><text x="207" y="123" textAnchor="middle">API / EDGE</text><text x="402" y="66" textAnchor="middle">POSTGRESQL</text><text x="402" y="195" textAnchor="middle">QUEUE</text><text x="402" y="253" textAnchor="middle">LOGS</text><text x="107" y="104" className="diagram-small">HTTPS</text><text x="268" y="104" className="diagram-small">SQL</text><text x="72" y="35" className="diagram-small">ONE REQUEST. A CONSIDERED SYSTEM.</text><text x="20" y="288" className="diagram-small">VALIDATE → PROCESS → PERSIST → RESPOND</text></g></svg></div>;
}
function WalletPreview() {
  return <div className="wallet-preview"><div className="mono muted" style={{ fontSize: 9 }}>VERIFIABLE BY DESIGN.</div><div className="linked-blocks">{["GENESIS", "BLOCK 001", "BLOCK 002"].map((block, index) => <Fragment key={block}>{index > 0 && <i/>}<div>{block}<span>{["0x71c…9a2f", "0xa82…1b04", "0x3f6…c901"][index]}</span></div></Fragment>)}</div><div className="wallet-state"><div><strong>Wallet connected</strong><small>0x71c4…9a2f · illustrative account</small></div><span>CONNECTED</span></div><span className="mono muted" style={{ fontSize: 7 }}>SHARED RECORDS / TRANSPARENT VERIFICATION</span></div>;
}
function DesignPreview() {
  return <div className="design-preview"><div className="mono muted" style={{ fontSize: 8 }}>A SYSTEM. NOT JUST A SCREEN.</div><div className="design-specimen"><span>Aa<em>Aa</em></span><div className="mono">GEIST<br/>INSTRUMENT SERIF<br/>THOUGHTFUL BY DEFAULT</div></div><div className="design-swatches"><i/><i/><i/><i/></div><div className="design-component-states">{["DEFAULT", "HOVER", "FOCUS", "DISABLED"].map((state) => <div key={state}><span>Continue ↗</span>{state}</div>)}</div></div>;
}
export function ServicePreview({ index = 0 }: { index?: number }) {
  const [phone, setPhone] = useState(false);
  const selected = Math.max(0, Math.min(services.length - 1, index));
  const service = services[selected];
  return <div className="preview-plate" data-preview-service={service.slug}><RegistrationMarks/>
    <div className="preview-plate-header mono"><span>{service.number} / {service.discipline}</span><span>SOFTWARE, MADE VISIBLE.</span></div>
    <div className="preview-stage"><div className={`preview-canvas ${selected === 0 && phone ? "is-phone" : ""}`} role="img" aria-label={`Illustrative ${service.name.toLowerCase()} software preview`}><div className="preview-artwork" aria-hidden="true" key={service.slug}>
      {selected === 0 && <InterfaceContent/>}
      {selected === 1 && <div className="custom-preview"><InterfaceContent/><div className="custom-module-row"><span>AUTH</span><i/><span>WORKFLOWS</span><i/><span>DATA</span></div></div>}
      {selected === 2 && <IntelligenceContent/>}
      {selected === 3 && <WalletPreview/>}
      {selected === 4 && <DesignPreview/>}
      {selected === 5 && <RequestFlow/>}
    </div></div></div>
    <div className="preview-controls"><span className="mono">{selected === 0 ? "ONE EXPERIENCE. EVERY SCREEN." : "A CONSIDERED TECHNICAL FOUNDATION."}</span>{selected === 0 ? <><button type="button" aria-label="Preview desktop layout" aria-pressed={!phone} onClick={() => setPhone(false)}><Monitor size={16} strokeWidth={1.5}/></button><button type="button" aria-label="Preview mobile layout" aria-pressed={phone} onClick={() => setPhone(true)}><Smartphone size={16} strokeWidth={1.5}/></button></> : <span className="preview-tools-caption mono">FIG. {service.number}</span>}</div>
    <div className="preview-plate-footer mono"><span>{service.technology}</span><span>ILLUSTRATIVE</span></div>
  </div>;
}
