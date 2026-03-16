import React, { useCallback, useState, useRef, useLayoutEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import { Collapse, Flex } from "antd";
import useResizeHeightDelta from "./useResizeHeightDelta";
import "./flex.css";

const SortableItem = ({ id }) => {
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
  const onResizeHeightDelta = useCallback((delta) => {
    setDeltaAcc((prev) => prev + delta);
  }, []);

  const resizableDynamic = useResizeHeightDelta({ onResizeHeightDelta });

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
          <Flex vertical style={{ height: "100%" }}>
            <div className="fixed">
              <div>ID: {id}</div>
              <div>deltaAcc {deltaAcc}</div>
              <div>width {size.widthPct}%</div>
              <div>
                blabla blabla blabla blabla blabla blabla blabla blablablabla
                blabla blabla blablablabla blabla blabla blablablabla blabla
                blabla blablablabla blabla blabla blabla
              </div>
            </div>

            <div
              className="dynamic"
              ref={resizableDynamic.setRef}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ overflowY: "auto", marginTop: "10px" }}
            >
              <Collapse
                items={[
                  { key: "1", label: "AI Insights", children: "Content..." },
                ]}
              />
              <Collapse
                items={[
                  { key: "1", label: "AI Insights", children: "Content..." },
                ]}
              />
              <Collapse
                items={[
                  { key: "1", label: "AI Insights", children: "Content..." },
                ]}
              />
            </div>
          </Flex>
        </div>
      </Resizable>
    </div>
  );
};

const Dashboard = () => {
  const [items, setItems] = useState(["1", "2", "3", "4"]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
          gap: 20,
        }}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default Dashboard;
