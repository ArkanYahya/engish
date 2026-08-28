import { useNavigate } from "react-router-dom";
import { LEVELS } from "../levels/index.js";

// Fixed row of level pills under the Vocabulary/Grammar header — switches which level's
// content is shown in place. Deliberately just a route swap: it must never touch
// QuizContext/selectLevel, since merely browsing another level's word list or grammar
// rules shouldn't change which level is "active" for the quiz back on Home.
export default function LevelPills({ activeLevelId, basePath }) {
  const navigate = useNavigate();

  return (
    <div className="level-pills">
      {LEVELS.map((level) => (
        <button
          key={level.id}
          type="button"
          className={`level-pill ${level.id === activeLevelId ? "active" : ""}`}
          onClick={() => navigate(`/quiz/${level.id}/${basePath}`, { replace: true })}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
