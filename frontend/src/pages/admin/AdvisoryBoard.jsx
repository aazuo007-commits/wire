import ResourceManager from "../../components/ResourceManager.jsx";

export default function AdvisoryBoard() {
  return (
    <ResourceManager
      resource="advisory-board"
      title="Advisory Board"
      emptyItem={{
        name: "",
        designation: "",
        photo: "",
        bio: "",
        linkedinUrl: "",
        twitterUrl: "",
        email: "",
        order: 0,
        isActive: true,
        showOnHomepage: false,
      }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "designation", label: "Designation (e.g. Chairman, Advisory Board)", type: "text" },
        { name: "photo", label: "Photo", type: "image" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "linkedinUrl", label: "LinkedIn URL", type: "url" },
        { name: "twitterUrl", label: "X / Twitter URL", type: "url" },
        { name: "email", label: "Email", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "showOnHomepage", label: "Show On Homepage", type: "checkbox" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name", "designation"]}
    />
  );
}
