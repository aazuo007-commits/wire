import ResourceManager from "../../components/ResourceManager.jsx";

export default function Partners() {
  return (
    <ResourceManager
      resource="partners"
      title="Partners"
      emptyItem={{ name: "", logoUrl: "", websiteUrl: "", order: 0, isActive: true }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "logoUrl", label: "Logo", type: "image", required: true },
        { name: "websiteUrl", label: "Website URL", type: "url" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name"]}
    />
  );
}
