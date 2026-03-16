import React, { useState } from "react";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import "../flex.css";
import PercentageResizableItem from "../PercentageResizableItem";

const PercentageResizableGrid = () => {
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
            <PercentageResizableItem key={id} id={id} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default PercentageResizableGrid;
