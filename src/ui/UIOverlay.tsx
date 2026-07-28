import '../styles/UIOverlay.css';
import Filter from "./Filter";
import Topbar from "./Topbar";
import DetailsPanel from "./Panel";

function UI() {
  return (
    <div className="overlay">
      <Topbar />
      <Filter />
      <DetailsPanel />
    </div>
  );
}

export default UI
