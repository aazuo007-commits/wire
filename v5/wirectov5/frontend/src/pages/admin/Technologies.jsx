import ResourceManager from "../../components/ResourceManager.jsx";

export default function Technologies() {
  return (
    <ResourceManager
      resource="technologies"
      title="Technology"
      emptyItem={{ name: "", category: "", logoUrl: "", order: 0, isActive: true }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category (Frontend/Backend/Mobile/Database)", type: "text" },
        { name: "logoUrl", label: "Logo", type: "image", required: true },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name", "category"]}
    />
  );
}
