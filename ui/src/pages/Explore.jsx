import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/campaigns`)
      .then(res => res.json())
      .then(data => {
        // show only active campaigns
        const activeCampaigns = data.filter(
          c => !c.isDeleted && c.Status === "Active"
        );

        setCampaigns(activeCampaigns);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading campaigns...
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No campaigns available.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Explore Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {campaigns.map(c => {

          const progress = Math.min(
            Math.round((c.Raised / c.Goal) * 100),
            100
          );

          return (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >

              <img
                src={c.Image || "/placeholder.jpg"}
                alt={c.Title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">

                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {c.Title}
                </h2>

                <p className="text-sm text-gray-500 mb-3">
                  {c.Category || "General"}
                </p>

                <div className="text-sm text-gray-600 mb-2">
                  ₹{c.Raised?.toLocaleString()} raised of ₹{c.Goal?.toLocaleString()}
                </div>

                {/* progress bar */}

                <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <Link
                  to={`/campaign/${c._id}`}
                  className="block text-center bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition"
                >
                  View Campaign
                </Link>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Explore;