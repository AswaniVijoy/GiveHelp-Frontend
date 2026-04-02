import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/campaigns`)
      .then(res => res.json())
      .then(data => {
        // hide archived campaigns
        const visibleCampaigns = data.filter(c => !c.isDeleted);
        setCampaigns(visibleCampaigns);
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

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No campaigns available.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold mb-8">Explore Campaigns</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {campaigns.map((c) => {

            const percent =
              c.Goal > 0
                ? Math.min(Math.round((c.Raised / c.Goal) * 100), 100)
                : 0;

            const isCompleted = c.Goal > 0 && c.Raised >= c.Goal;
            const isClosed = c.Status === "Closed";
            const isFinished = isCompleted || isClosed;

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >

                {/* IMAGE */}
                <div className="h-44 bg-gray-100 relative">

                  {c.Image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/campaign/image/${encodeURIComponent(
                        c.Title
                      )}`}
                      alt={c.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* SAME UI FOR CLOSED + GOAL REACHED */}
                  {isFinished && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold bg-black px-4 py-1.5 rounded-full">
                        🚫 Campaign Closed
                      </span>
                    </div>
                  )}

                </div>

                {/* CONTENT */}
                <div className="p-4">

                  <h2 className="font-semibold text-lg line-clamp-2">
                    {c.Title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {c.Category || "General"}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-black"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Rs.{c.Raised?.toLocaleString()} raised</span>
                      <span>{percent}%</span>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="mt-4">

                    {isFinished ? (
                      <div className="w-full text-center py-2.5 rounded-lg bg-gray-200 text-gray-600 text-sm font-medium">
                        🚫 Campaign Closed
                      </div>
                    ) : (
                      <Link
                        to={`/campaign/${c._id}`}
                        className="block text-center bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
                      >
                        View Campaign
                      </Link>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Explore;