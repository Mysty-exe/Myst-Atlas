import '../styles/Filter.css';

import { useContext, type RefObject } from "react";
import { AppContext } from "../App";

interface GroupProps {
    name: string,
}

const onExpand = (name:string, types: RefObject<Map<any, any>>) => {
    let currentList = types.current.get(name);
    currentList.forEach((type: any[]) => {
      type[5] = !type[5];
    });
}

const onChange = (name:string, types: RefObject<Map<any, any>>, i: number, workerRef: RefObject<any>) => {
    let currentList = types.current.get(name);
    currentList[i][4] = !currentList[i][4];
    types.current.set(name, currentList);

    workerRef.current.postMessage({
        type: "updateGroups",
        groups: types.current
    });
}

function Group({ name }: GroupProps) {
  const context = useContext(AppContext);

  if (!context) return;
  if (!context.filterRef.current) return <></>;
  if (context.filterRef.current.get(name) === undefined) return <></>;
  

  return (
    <div className="category">

        <div className="category-header" onClick={() => onExpand(name, context.filterRef)} style={{ color: context.filterRef.current.get(name)![0][1] }}>
            <span> {context.filterRef.current.get(name)![0][5] ? <>▼ {name}</> : <>▶ {name}</>}</span>
            <span className="count">{context.filterRef.current.get(name)![0][2]}</span>
        </div>

        {context.filterRef.current.get(name)![0][5] &&
            <div className="category-items">
                {context.filterRef.current.get(name)!.map((type, i) => 
                    <label className="filter-item" key={i}>
                        <input type="checkbox" style={{ accentColor: type[1] }} checked={type[4]} 
                        onChange={() => {
                            onChange(name, context.filterRef, i, context.workerRef)
                                context.resetFilterRef.current = true;
                            }}/>
                        {type[0]}
                        <span>{type[3]}</span>
                    </label>
                )}
            </div>
        }

    </div>
  );
}

export default Group
