import { useEffect, useState } from "react";
import api from "../api/axios.js";

const SOCIAL_LABELS = {
  facebook: "Facebook",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

export default function TopStrip() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data)).catch(() => setSettings(null));
  }, []);

  const email = settings?.contactEmail;
  const phone = settings?.contactPhone;
  const socialEntries = Object.entries(settings?.social || {}).filter(([, url]) => url);

  if (!email && !phone && !socialEntries.length) return null;

  return (
    <div className="top-strip">
      <div className="container top-strip-inner">
        <div className="top-strip-contact">
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {phone && <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>}
        </div>
        {!!socialEntries.length && (
          <div className="top-strip-social">
            {socialEntries.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" title={SOCIAL_LABELS[key] || key}>
                {(SOCIAL_LABELS[key] || key).charAt(0).toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
