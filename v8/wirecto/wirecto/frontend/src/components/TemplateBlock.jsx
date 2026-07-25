import { useEffect, useState } from "react";
import api from "../api/axios.js";

/**
 * Renders a Template document (imported from any REST API, or created manually)
 * by its `key`. Usage: <TemplateBlock templateKey="home-hero-alt" />
 *
 * - type "html"  -> rendered as raw HTML (admin-controlled content only)
 * - type "json"  -> rendered as a simple key/value block (customize as needed)
 */
export default function TemplateBlock({ templateKey }) {
  const [template, setTemplate] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/templates/by-key/${templateKey}`)
      .then((res) => setTemplate(res.data.data))
      .catch(() => setNotFound(true));
  }, [templateKey]);

  if (notFound || !template) return null;

  if (template.type === "html") {
    return <div className="template-block" dangerouslySetInnerHTML={{ __html: template.content }} />;
  }

  return (
    <div className="template-block template-block-json">
      <pre>{JSON.stringify(template.content, null, 2)}</pre>
    </div>
  );
}
