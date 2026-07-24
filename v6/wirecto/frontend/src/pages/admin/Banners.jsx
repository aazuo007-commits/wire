import ResourceManager from "../../components/ResourceManager.jsx";

export default function Banners() {
  return (
    <ResourceManager
      resource="banners"
      title="Banners"
      emptyItem={{
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "Find Out More",
        buttonLink: "/services",
        order: 0,
        isActive: true,
      }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "subtitle", label: "Subtitle", type: "textarea" },
        { name: "imageUrl", label: "Banner Image", type: "image", required: true },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title", "order"]}
    />
  );
}
