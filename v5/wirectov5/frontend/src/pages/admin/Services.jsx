import ResourceManager from "../../components/ResourceManager.jsx";

export default function Services() {
  return (
    <ResourceManager
      resource="services"
      title="Services"
      emptyItem={{
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        brochureUrl: "",
        icon: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug (leave blank to auto-generate from title)", type: "text" },
        { name: "shortDescription", label: "Short Description", type: "textarea" },
        { name: "description", label: "Full Description", type: "textarea" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "videoUrl", label: "Intro/Demo Video (optional)", type: "file" },
        { name: "brochureUrl", label: "Brochure / Spec Sheet PDF or DOC (optional)", type: "file" },
        { name: "icon", label: "Icon (class name or emoji)", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title", "slug"]}
    />
  );
}
