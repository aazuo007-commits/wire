import ResourceManager from "../../components/ResourceManager.jsx";

export default function ParentMenus() {
  return (
    <ResourceManager
      resource="parent-menus"
      title="Parent Menus"
      emptyItem={{
        title: "",
        slug: "",
        icon: "",
        order: 0,
        isActive: true,
        showInHeader: true,
        showInFooter: false,
      }}
      fields={[
        { name: "title", label: "Title (e.g. Expertise, Industries, Technology, Partners)", type: "text", required: true },
        { name: "slug", label: "Slug (leave blank to auto-generate from title)", type: "text" },
        { name: "icon", label: "Icon (optional class name or emoji)", type: "text" },
        { name: "order", label: "Display Order", type: "number" },
        { name: "showInHeader", label: "Show In Header Menu", type: "checkbox" },
        { name: "showInFooter", label: "Show In Footer Menu", type: "checkbox" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title", "slug", "order"]}
    />
  );
}
