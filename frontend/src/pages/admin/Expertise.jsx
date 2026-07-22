import ResourceManager from "../../components/ResourceManager.jsx";

export default function Expertise() {
  return (
    <ResourceManager
      resource="expertise"
      title="Expertise"
      emptyItem={{ title: "", description: "", icon: "", order: 0, isActive: true }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icon (class name or emoji)", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title"]}
    />
  );
}
