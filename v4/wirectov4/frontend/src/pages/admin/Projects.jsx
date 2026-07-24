import ResourceManager from "../../components/ResourceManager.jsx";

export default function Projects() {
  return (
    <ResourceManager
      resource="projects"
      title="Projects"
      emptyItem={{
        title: "",
        client: "",
        category: "",
        description: "",
        imageUrl: "",
        projectUrl: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "client", label: "Client", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "imageUrl", label: "Image", type: "image", required: true },
        { name: "projectUrl", label: "Project URL", type: "url" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title", "client"]}
    />
  );
}
