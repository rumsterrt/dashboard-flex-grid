import React, { useCallback, useState } from "react";
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
import "./flex.css";
import { Collapse, Flex } from "antd";
import useResizeHeightDelta from "./useResizeHeightDelta";

const SortableItem = ({ id }) => {
  const [size, setSize] = useState({ width: 200, height: 400 });
  const [widthMode, setWidthMode] = useState("px");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
  };

  const [deltaAcc, setDeltaAcc] = useState(0);
  const onResizeHeightDelta = useCallback((delta: number) => {
    setDeltaAcc((prev) => prev + delta);
  }, []);

  const resizableDynamic = useResizeHeightDelta({ onResizeHeightDelta });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        flex:
          widthMode === "px"
            ? `0 0 ${size.width}px`
            : widthMode === "25%"
              ? "0 0 25%"
              : widthMode === "50%"
                ? "0 0 50%"
                : "0 0 100%",
      }}
      {...attributes}
    >
      <Resizable
        width={size.width}
        height={size.height + (deltaAcc || 0)}
        onResize={(e, { size: newSize }) =>
          setSize({
            ...newSize,
            height: newSize.height - (deltaAcc || 0),
          })
        }
        axis={widthMode === "px" ? "both" : "y"}
        resizeHandles={["se"]}
        handle={
          <div
            className={
              "react-resizable-handle " +
              "react-resizable-" +
              (widthMode === "px" ? "both" : "y")
            }
            //className={"resize-handle-" + axis}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        }
      >
        <div
          style={{
            width: widthMode === "px" ? size.width : "100%",
            height: size.height + (deltaAcc || 0),
            background: "#fff",
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
          {...listeners} // Вешаем слушатели dnd сюда или на отдельную кнопку-handle
        >
          <Flex vertical className="content">
            <div className="fixed">
              <div className="widget-header">
                <button onClick={() => setWidthMode("px")}>free</button>
                <button onClick={() => setWidthMode("25%")}>¼</button>
                <button onClick={() => setWidthMode("50%")}>½</button>
                <button onClick={() => setWidthMode("100%")}>full</button>
              </div>
              <div>ID: {id}</div>
              <div>deltaAcc {deltaAcc}</div>
              <div>
                blabla blabla blabla blabla blabla blabla blabla blablablabla
                blabla blabla blablablabla blabla blabla blablablabla blabla
                blabla blablablabla blabla blabla blabla
              </div>
            </div>

            {/* Оборачиваем динамическую часть в контейнер, который НЕ занимает всё место сразу */}
            <div
              className="dynamic"
              ref={resizableDynamic.setRef}
              onPointerDown={(e) => e.stopPropagation()} // Остановит начало DND
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Collapse
                items={[
                  {
                    key: "1",
                    label: "AI Insights",
                    children: (
                      <div>Длинный текст, который меняет высоту...</div>
                    ),
                  },
                ]}
              />
              <Collapse
                items={[
                  {
                    key: "1",
                    label: "AI Insights",
                    children: (
                      <div>Длинный текст, который меняет высоту...</div>
                    ),
                  },
                ]}
              />
              <Collapse
                items={[
                  {
                    key: "1",
                    label: "AI Insights",
                    children: (
                      <div>Длинный текст, который меняет высоту...</div>
                    ),
                  },
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Начнет тащить только если сдвинули на 8 пикселей
      },
    }),
  );

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
          padding: "20px",
          width: "100%",
          gap: 20,
          boxSizing: "border-box",
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
