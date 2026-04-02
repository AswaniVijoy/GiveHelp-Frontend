import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API}/admin/campaigns`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(data => {
        setCampaigns(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this campaign?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/admin/campaign/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.msg);

        setCampaigns(prev =>
          prev.map(c =>
            c._id === id
              ? { ...c, isDeleted: true, Status: "Archived" }
              : c
          )
        );
      } else {
        toast.error(data.msg || "Archive failed");
      }

    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Campaigns</h1>

        <Link
          to="/admin/create-campaign"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition text-sm"
        >
          + New Campaign
        </Link>
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No campaigns yet.</div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Goal</th>
                  <th className="p-3 text-center">Raised</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {campaigns.map(c => (

                  <tr
                    key={c._id}
                    className={
                      "border-t hover:bg-gray-50" +
                      (c.isDeleted ? " bg-gray-50" : "")
                    }
                  >

                    <td className="p-3 font-medium flex items-center gap-2">
                      {c.Title}

                      {c.isDeleted && (
                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                          Archived
                        </span>
                      )}

                    </td>

                    <td className="p-3 text-center text-gray-500">
                      {c.Category || "-"}
                    </td>

                    <td className="p-3 text-center">
                      Rs.{c.Goal?.toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      Rs.{c.Raised?.toLocaleString()}
                    </td>

                    <td className="p-3 text-center">

                      <span
                        className={
                          "font-medium " +
                          (c.Status === "Active"
                            ? "text-green-600"
                            : c.Status === "Archived"
                            ? "text-gray-500"
                            : "text-orange-500")
                        }
                      >
                        {c.Status}
                      </span>

                    </td>

                    <td className="p-3 text-center space-x-2">

                      {!c.isDeleted ? (
                        <>
                          <Link
                            to={`/admin/edit-campaign/${c._id}`}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(c._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition"
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No actions
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminCampaigns;