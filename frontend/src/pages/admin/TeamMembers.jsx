import ResourceManager from "../../components/ResourceManager.jsx";

export default function TeamMembers() {
  return (
    <ResourceManager
      resource="team-members"
      title="Team Members"
      emptyItem={{
        name: "",
        designation: "",
        department: "",
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
        { name: "designation", label: "Designation (e.g. Lead Frontend Developer)", type: "text" },
        { name: "department", label: "Department (e.g. Engineering, Design)", type: "text" },
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
