import '../styles/Filter.css';
import { useContext, useEffect, useRef, useState, type RefObject } from "react";
import Group from "./Group";
import { AppContext } from "../App";

const groupNames = [
  "Earth Observation", "Communication", "Navigation", "Science & Research", "Miscellaneous"
]


const onClick = (groups: RefObject<Map<string, any[][]>>, workerRef: any) => {
  groupNames.forEach(group => {
    let groupTypes: any[]  = groups.current.get(group)!;
    groupTypes.forEach((type: any[]) => {
      type[4] = true;
    });
  })

  workerRef.current.postMessage({
    type: "updateGroups",
    groups: groups.current
  });
};

function Filter() {
  const context = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(true);

  if (!context) return;
  if (!context.filterRef.current)
    return <></>

  const total = useRef(0);

  useEffect(() => {
    if (total.current == 0) {
      groupNames.forEach(group => {
        total.current += context.filterRef.current.get(group)![0][2];        
      });
    }
  }, []);

  return (
    <div className={`filter-container ${collapsed ? "collapsed" : ""}`}>
      <div className={`filter-panel`}>
          <div className="panel-header">
              <h3>Satellites</h3>

              <div className="filter-actions">
                  <button onClick={() => {
                    if (!context) return;
                    onClick(context.filterRef, context.workerRef)
                    context.resetFilterRef.current = true;
                  }}>
                  Toggle All - {total.current}</button>
              </div>
          </div>

          <div className="category">

            {groupNames.map((name, i) => <Group key={i} name={name} />)}

          </div>
      </div>

    <button
        className="collapse-button"
        onClick={() => {
          if (!collapsed) {
            groupNames.map(name => {
              let currentList: any[] = context.filterRef.current.get(name)!;
            currentList.forEach((type: any[]) => {
              type[5] = false;
            });
            })
          }
          setCollapsed(!collapsed)
        }}
      >
        {collapsed ? "❯" : "❮"}
    </button>
    </div>
  );
}

export default Filter
