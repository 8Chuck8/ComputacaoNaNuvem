import { useEffect } from "react";
import DataTableComponent from "./DataTable";
import { useScoreApi } from "../api/scores.api"

const ScoresComponent = () => {
  const { getScores, scores } = useScoreApi();

  useEffect(() => {
      const fetchData = async () => {
          await getScores();
      };
      fetchData();
  }, []);

  const contentHeaders = scores.length > 0
        ? ["username", "score", "time", "date"]
        : [];

  const scores_data = scores.map((score) => ({
      username: score.user_id.username,
      score: score.score,
      time: score.time,
      date: score.createdAt
  }));

  return (
      <>
          {scores_data.length > 0 ? (
              <div className="table-responsive w-100">
                  <DataTableComponent
                      content_data={scores_data}
                      content_headers={contentHeaders}
                  />
              </div>
          ) : (
              <h3>Loading scores...</h3>
          )}
      </>
  );
}

export default ScoresComponent;