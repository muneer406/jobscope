import { VIEW_MODES } from "../utils/jobSelectors";

export function ViewToggle({ onShowAllJobs, onShowSavedJobs, viewMode }) {
  return (
    <div className="view-toggle" aria-label="Job list view mode">
      <button
        className={
          viewMode === VIEW_MODES.ALL ? "toggle-button active" : "toggle-button"
        }
        type="button"
        onClick={onShowAllJobs}
      >
        All Jobs
      </button>

      <button
        className={
          viewMode === VIEW_MODES.SAVED
            ? "toggle-button active"
            : "toggle-button"
        }
        type="button"
        onClick={onShowSavedJobs}
      >
        Saved Jobs
      </button>
    </div>
  );
}
