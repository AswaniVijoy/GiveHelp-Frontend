import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaign/" + id)
      .then((res) => res.json())
      .then((data) => { setCampaign(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!campaign) return <div className="min-h-screen flex items-center justify-center text-gray-500">Campaign not found.</div>;

  const percent = campaign.Goal > 0 ? Math.min(Math.round((campaign.Raised / campaign.Goal) * 100), 100) : 0;
  const isCompleted = campaign.Goal > 0 && campaign.Raised >= campaign.Goal;
  const isClosed = campaign.Status === "Closed";
  const canDonate = !isCompleted && !isClosed;

  const handleDonateClick = () => {
    if (!profile) navigate("/login");
    else navigate("/donate/" + campaign._id);
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-64 relative">
            {campaign.Image ? (
              <img src={`/api/campaign/image/${encodeURIComponent(campaign.Title)}`} alt={campaign.Title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
            {isCompleted && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-bold tracking-wide bg-black px-5 py-2 rounded-full">🎉 Goal Reached!</span>
              </div>
            )}
            {isClosed && !isCompleted && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-lg font-bold tracking-wide bg-gray-700 px-5 py-2 rounded-full">🔒 Campaign Closed</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-6">{campaign.Title}</h1>
          <p className="text-gray-600 mt-3">Your donation makes a direct impact.</p>

          {isClosed && !isCompleted && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
              This campaign has been closed by the admin and is no longer accepting donations. All previous contributions are recorded and appreciated.
            </div>
          )}

          <section className="mt-6 bg-white border border-gray-300 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Story</h2>
            <p className="text-gray-700 mt-2 leading-relaxed">{campaign.Description}</p>
          </section>
          <section className="mt-6 bg-white border border-gray-300 shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium">{campaign.Category || "General"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Created by</span><span className="font-medium">{campaign.CreatedBy}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={"font-medium " + (isCompleted ? "text-green-600" : isClosed ? "text-orange-500" : "text-green-600")}>
                  {isCompleted ? "Completed" : isClosed ? "Closed" : "Active"}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Created on</span><span className="font-medium">{new Date(campaign.CreatedAt).toLocaleDateString()}</span></div>
            </div>
          </section>
        </div>

        <aside className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit sticky top-24">
          <div className="text-sm text-gray-600">Goal</div>
          <div className="text-2xl font-bold text-black mt-1">Rs.{campaign.Goal?.toLocaleString()}</div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 rounded-full transition-all bg-black" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Rs.{campaign.Raised?.toLocaleString()} raised</span>
              <span>{percent}%</span>
            </div>
          </div>

          {isCompleted ? (
            <div className="mt-5 space-y-2">
              <div className="w-full bg-black text-white py-3 rounded-lg font-medium text-center">🎉 Goal Reached!</div>
              <Link to="/explore" className="block w-full text-center py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Explore other campaigns →</Link>
            </div>
          ) : isClosed ? (
            <div className="mt-5 space-y-2">
              <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg font-medium text-center text-sm">🔒 Donations Closed</div>
              <Link to="/explore" className="block w-full text-center py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Explore other campaigns →</Link>
            </div>
          ) : (
            <button onClick={handleDonateClick} className="mt-5 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
              {profile ? "Donate Now" : "Login to Donate"}
            </button>
          )}

          <div className="mt-5 border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Raised</span><span className="font-medium text-black">Rs.{campaign.Raised?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Goal</span><span className="font-medium text-black">Rs.{campaign.Goal?.toLocaleString()}</span></div>
            <div className="flex justify-between">
              <span>{isCompleted ? "Surplus" : "Remaining"}</span>
              <span className={`font-medium ${isCompleted ? "text-red-800" : "text-black"}`}>Rs.{Math.abs(campaign.Goal - campaign.Raised)?.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </main>
      <footer className="py-8 text-center text-sm text-gray-600 border-t">&copy; 2025 GiveHelp</footer>
    </div>
  );
};

export default CampaignDetail;
