import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/campaign/` + id)
      .then((res) => res.json())
      .then((data) => {
        setCampaign(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Campaign not found
      </div>
    );

  const percent =
    campaign.Goal > 0
      ? Math.min(Math.round((campaign.Raised / campaign.Goal) * 100), 100)
      : 0;

  const isClosed =
    campaign.Status === "Closed" || campaign.Raised >= campaign.Goal;

  const handleDonateClick = () => {
    if (!profile) navigate("/login");
    else navigate("/donate/" + campaign._id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">

          <div className="rounded-2xl overflow-hidden bg-gray-100 h-64 relative">
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
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-bold bg-black px-5 py-2 rounded-full">
                  Campaign Closed
                </span>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mt-6">{campaign.Title}</h1>

          <section className="mt-6 bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Story</h2>
            <p className="mt-2 text-gray-700">{campaign.Description}</p>
          </section>

        </div>

        <aside className="bg-white rounded-2xl border p-5 shadow-sm h-fit">

          <div className="text-sm text-gray-600">Goal</div>
          <div className="text-2xl font-bold mt-1">
            ₹{campaign.Goal?.toLocaleString()}
          </div>

          <div className="mt-4">

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-black"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>₹{campaign.Raised}</span>
              <span>{percent}%</span>
            </div>

          </div>

          {isClosed ? (
            <div className="mt-5 space-y-2">
              <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg text-center">
                Donations Closed
              </div>

              <Link
                to="/explore"
                className="block text-center border py-2 rounded-lg"
              >
                Explore other campaigns
              </Link>
            </div>
          ) : (
            <button
              onClick={handleDonateClick}
              className="mt-5 w-full bg-black text-white py-3 rounded-lg"
            >
              {profile ? "Donate Now" : "Login to Donate"}
            </button>
          )}

        </aside>

      </main>
    </div>
  );
};

export default CampaignDetail;