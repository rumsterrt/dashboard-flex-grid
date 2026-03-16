import React, { useCallback } from "react";
import { Collapse, Flex } from "antd";
import useResizeHeightDelta from "../useResizeHeightDelta";
import "../flex.css";
import { emit } from "../emit";

const PercentageResizableItemContent = ({ id, content }) => {
  const onResizeHeightDelta = useCallback((delta) => {
    emit("updateGridItemDelta." + id, { delta });
  }, []);

  const resizableDynamic = useResizeHeightDelta({ onResizeHeightDelta });

  return (
    <Flex vertical style={{ height: "100%" }}>
      <div className="fixed">
        <div>ID: {id}</div>
        <div>
          blabla blabla blabla blabla blabla blabla blabla blablablabla blabla
          blabla blablablabla blabla blabla blablablabla blabla blabla
          blablablabla blabla blabla blabla
        </div>
        {content}
      </div>

      <div
        className="dynamic"
        ref={resizableDynamic.setRef}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ overflowY: "auto", marginTop: "10px" }}
      >
        <Collapse
          items={[{ key: "1", label: "AI Insights", children: "Content..." }]}
        />
        <Collapse
          items={[{ key: "1", label: "AI Insights", children: "Content..." }]}
        />
        <Collapse
          items={[{ key: "1", label: "AI Insights", children: "Content..." }]}
        />
      </div>
    </Flex>
  );
};

export default PercentageResizableItemContent;
