import { useEffect } from "react";
import { useScoreApi } from "../api/scores.api";
import DataTableComponent from "../components/DataTable";

const Scores = (props) => {
    const { getScoresByUserId, scores } = useScoreApi();
    
      useEffect(() => {
          const fetchData = async () => {
              await getScoresByUserId(props.user._id);
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
            <div className='d-flex justify-content-center align-items-center shadow m-4 p-4 rounded'>
                {scores_data.length > 0 ? (
                    <div className="table-responsive w-100">
                        <DataTableComponent
                            content_data={scores_data}
                            content_headers={contentHeaders}
                        />
                    </div>
                ) : (
                    <h3>There are no scores yet</h3>
                )}
            </div>
          </>
      );
}

export default Scores;