import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/campaign`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Explore Campaigns</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {campaigns.map((campaign) => {

          const percent =
            campaign.Goal > 0
              ? Math.min(
                  Math.round((campaign.Raised / campaign.Goal) * 100),
                  100
                )
              : 0;

          const isClosed =
            campaign.Status === "Closed" ||
            campaign.Raised >= campaign.Goal;

          return (
            <div
              key={campaign._id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                isClosed ? "opacity-80" : ""
              }`}
            >
              <div className="h-48 bg-gray-200 relative">

                {campaign.Image ? (
                  <img
                    src={`${API}/campaign/image/${encodeURIComponent(
                      campaign.Title
                    )}`}
                    alt={campaign.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}

                {isClosed && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-semibold bg-black px-4 py-2 rounded-full">
                      Campaign Closed
                    </span>
                  </div>
                )}

              </div>

              <div className="p-4">

                <h2 className="font-semibold text-lg">
                  {campaign.Title}
                </h2>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {campaign.Description}
                </p>

                <div className="mt-3">

                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 bg-black rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mt-2 text-gray-600">
                    <span>₹{campaign.Raised}</span>
                    <span>{percent}%</span>
                  </div>

                </div>

                <Link
                  to={`/campaign/${campaign._id}`}
                  className="block mt-4 text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  View Details
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