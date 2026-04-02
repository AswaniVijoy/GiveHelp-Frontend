import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Latest");
  const [statusFilter, setStatusFilter] = useState("All");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/campaign`)
      .then(res => res.json())
      .then(data => {
        setCampaigns(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...campaigns];

    if (category !== "All") {
      result = result.filter(c => c.Category === category);
    }

    if (statusFilter === "Active") {
      result = result.filter(c => c.Status === "Active");
    }

    if (statusFilter === "Closed") {
      result = result.filter(c => c.Status === "Closed");
    }

    if (sort === "Most Funded") {
      result.sort((a, b) => (b.Raised || 0) - (a.Raised || 0));
    } else {
      result.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    }

    setFiltered(result);
  }, [category, sort, statusFilter, campaigns]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Explore Campaigns</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} campaign{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">

            <select
              className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Animals">Animals</option>
              <option value="Disaster Relief">Disaster Relief</option>
              <option value="Community">Community</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="Latest">Latest</option>
              <option value="Most Funded">Most Funded</option>
            </select>

          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-12 text-center text-gray-500">
            Loading campaigns...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">
            No campaigns found.
          </div>
        ) : (

          /* Campaign Grid */
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map(c => {

              const pct =
                c.Goal > 0
                  ? Math.min(Math.round((c.Raised / c.Goal) * 100), 100)
                  : 0;

              const isClosed = c.Status === "Closed";

              return (

                <article
                  key={c._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >

                  {/* Image */}
                  <div className="h-44 bg-gray-100 relative">

                    {c.Image ? (
                      <img
                        src={`${API}/campaign/image/${encodeURIComponent(c.Title)}`}
                        alt={c.Title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}

                    {/* Funding Percentage */}
                    {pct > 0 && (
                      <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                        {pct}% Funded
                      </span>
                    )}

                    {/* Closed Badge */}
                    {isClosed && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                        Closed
                      </span>
                    )}

                    {/* Goal Achieved Badge */}
                    {pct === 100 && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                        Goal Achieved
                      </span>
                    )}

                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {c.Category || "General"}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(c.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {c.Title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {c.Description}
                    </p>

                    {/* Progress */}
                    <div className="mt-4">

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-black rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Funding Details */}
                      <div className="mt-3 flex items-center justify-between text-sm">

                        <div>
                          <span className="font-semibold text-gray-900">
                            ₹{c.Raised?.toLocaleString()}
                          </span>

                          {c.Goal > 0 && (
                            <span className="text-gray-400">
                              {" "} / ₹{c.Goal?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <Link to={`/campaign/${c._id}`}>
                          <button
                            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition cursor-pointer"
                          >
                            {isClosed ? "View Details" : "Donate"}
                          </button>
                        </Link>

                      </div>

                    </div>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        © 2025 GiveHelp
      </footer>

    </div>
  );
};

export default Explore;