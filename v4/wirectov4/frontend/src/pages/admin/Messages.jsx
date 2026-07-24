import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/contact").then((r) => setMessages(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await api.delete(`/contact/${id}`);
    load();
  };

  return (
    <div>
      <h1>Contact Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Read</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.message}</td>
                  <td>{m.isRead ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    {!m.isRead && (
                      <button className="btn btn-sm" onClick={() => markRead(m._id)}>Mark Read</button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => remove(m._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!messages.length && (
                <tr><td colSpan={5}>No messages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
