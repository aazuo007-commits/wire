import ResourceManager from "../../components/ResourceManager.jsx";

export default function BlogCategories() {
  return (
    <ResourceManager
      resource="blog-categories"
      title="Blog Categories"
      emptyItem={{ name: "", slug: "", order: 0, isActive: true }}
      fields={[
        { name: "name", label: "Category Name", type: "text", required: true },
        { name: "slug", label: "Slug (leave blank to auto-generate from name)", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name", "slug"]}
    />
  );
}
