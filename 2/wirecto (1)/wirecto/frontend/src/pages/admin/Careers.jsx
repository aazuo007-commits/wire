import ResourceManager from "../../components/ResourceManager.jsx";

export default function Careers() {
  return (
    <ResourceManager
      resource="careers"
      title="Careers"
      emptyItem={{
        title: "",
        slug: "",
        department: "",
        location: "",
        jobType: "Full-time",
        experience: "",
        description: "",
        requirements: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        { name: "title", label: "Job Title", type: "text", required: true },
        { name: "slug", label: "Slug (leave blank to auto-generate from title)", type: "text" },
        { name: "department", label: "Department", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "jobType", label: "Job Type (Full-time/Part-time/Contract/Internship/Remote)", type: "text" },
        { name: "experience", label: "Experience Required (e.g. 2-4 years)", type: "text" },
        { name: "description", label: "Job Description", type: "textarea" },
        { name: "requirements", label: "Requirements", type: "textarea" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["title", "location"]}
    />
  );
}
