import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Scores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) return;

    fetch(`${API_URL}/api/scores/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setScores(data.data);
      });
  }, []);

  return (
    <div className="container-fluid bg-dark text-white min-vh-100 py-4">
      <h2 className="mb-4 text-center">My Scores</h2>

      {scores.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered text-center align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={i}>
                  <td>{score.user_id?.username || "Unknown"}</td>
                  <td>{score.score}</td>
                  <td>{score.time}s</td>
                  <td>{new Date(score.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No scores to display.</p>
      )}
    </div>
  );
};

export default Scores;
