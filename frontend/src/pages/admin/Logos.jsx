import ResourceManager from "../../components/ResourceManager.jsx";

export default function Logos() {
  return (
    <ResourceManager
      resource="logos"
      title="Logo"
      emptyItem={{ name: "Wirecto", imageUrl: "",faviconUrl: "", isActive: true }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "imageUrl", label: "Logo Image", type: "image", required: true },
        {
          name: "faviconUrl",
          label: "Favicon",
          type: "image",
          required: false,
        },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name"]}
    />
  );
}
