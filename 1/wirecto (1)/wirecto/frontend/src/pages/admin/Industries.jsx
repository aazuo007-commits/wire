import ResourceManager from "../../components/ResourceManager.jsx";

export default function Industries() {
  return (
    <ResourceManager
      resource="industries"
      title="Industries"
      emptyItem={{ title: "", description: "", icon: "", imageUrl: "", order: 0, isActive: true }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icon (class name or emoji)", type: "text" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title"]}
    />
  );
}
