import ResourceManager from "../../components/ResourceManager.jsx";

export default function Testimonials() {
  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      emptyItem={{
        name: "",
        designation: "",
        company: "",
        photo: "",
        rating: 5,
        message: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        { name: "name", label: "Client Name", type: "text", required: true },
        { name: "designation", label: "Designation (e.g. CTO)", type: "text" },
        { name: "company", label: "Company", type: "text" },
        { name: "photo", label: "Photo", type: "image" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "message", label: "Testimonial Message", type: "textarea", required: true },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name", "company"]}
    />
  );
}
