import React, { useState, useRef, useLayoutEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import { useOn } from "../emit";
import PercentageResizableItemContent from "../PercentageResizableItemContent";

import "../flex.css";
import { Flex } from "antd";

const PercentageResizableItem = ({ id }) => {
  const [size, setSize] = useState({ widthPct: 25, height: 400 });
  const [pxWidth, setPxWidth] = useState(0); // Внутреннее состояние для плавного ресайза
  const containerRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Синхронизируем начальную ширину в пикселях
  useLayoutEffect(() => {
    if (containerRef.current) {
      setPxWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const [deltaAcc, setDeltaAcc] = useState(0);
  useOn("updateGridItemDelta." + id, ({ delta }) =>
    setDeltaAcc((prev) => prev + delta),
  );

  const onResize = (e, { size: newSize }) => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth - 40; // Вычитаем паддинги/gap если нужно
    const newWidthPct = Math.ceil((newSize.width / parentWidth) * 100);

    setPxWidth(newSize.width);
    setSize({
      widthPct: Math.min(Math.max(newWidthPct, 10), 100), // Ограничение от 10% до 100%
      height: newSize.height - (deltaAcc || 0),
    });
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    // Главное: задаем ширину через flex-basis в процентах
    flex: `0 0 ${size.widthPct}%`,
    boxSizing: "border-box",
    //padding: "10px", // Имитируем gap через padding, чтобы проценты считались проще
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={style}
      {...attributes}
    >
      <Resizable
        width={pxWidth}
        height={size.height + (deltaAcc || 0)}
        onResize={onResize}
        axis="both"
        resizeHandles={["se"]}
        handle={
          <div
            className="react-resizable-handle"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        }
      >
        <div
          style={{
            width: "100%", // Контент занимает всё место, выделенное flex-basis
            height: size.height + (deltaAcc || 0),
            background: "#fff",
            border: "1px solid #ddd",
            boxSizing: "border-box",
            position: "relative",
          }}
          {...listeners}
        >
          <PercentageResizableItemContent
            id={id}
            content={
              <Flex vertical>
                <div>width: {size.widthPct} %</div>
              </Flex>
            }
          />
        </div>
      </Resizable>
    </div>
  );
};

export default PercentageResizableItem;
