import { useEffect, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

export interface KanBanColumn {
  /** Must match the value returned by `getStatus` for an item. */
  key: string;
  title: string;
}

interface KanBanViewProps {
  columns: KanBanColumn[];
  items: any[];
  /** Stable id for an item (campaign_id / event_id / task_id). */
  getId: (item: any) => string;
  /** The item's current status — used to place it in a column. */
  getStatus: (item: any) => string;
  /** Renders the card body for an item. */
  renderCard: (item: any) => ReactNode;
  /** Called after a drag moves an item to a new column. Persist + refetch here. */
  onStatusChange?: (id: string, status: string) => void | Promise<void>;
}

const DraggableCard = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {children}
    </div>
  );
};

const Column = ({
  col,
  children,
}: {
  col: KanBanColumn;
  children: ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-3 min-h-[200px] transition-colors ${
        isOver ? "bg-blue-50" : "bg-gray-100"
      }`}
    >
      <h3 className="font-semibold mb-3">{col.title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

const KanBanView = ({
  columns,
  items: itemsProp,
  getId,
  getStatus,
  renderCard,
  onStatusChange,
}: KanBanViewProps) => {
  // Local mirror of the items so drags update the board optimistically,
  // re-synced whenever the parent (store) pushes fresh data.
  const [items, setItems] = useState(itemsProp);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setItems(itemsProp);
  }, [itemsProp]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const destStatus = String(over.id);

    const item = items.find((it) => getId(it) === id);
    if (!item || getStatus(item) === destStatus) return;

    setItems((prev) =>
      prev.map((it) => (getId(it) === id ? { ...it, status: destStatus } : it))
    );

    try {
      await onStatusChange?.(id, destStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      setItems(itemsProp); // revert on failure
    }
  };

  const activeItem = activeId
    ? items.find((it) => getId(it) === activeId)
    : null;

  return (
    <div className="bg-gray-100 rounded-xl">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <Column key={col.key} col={col}>
              {items
                .filter((it) => getStatus(it) === col.key)
                .map((it) => (
                  <DraggableCard key={getId(it)} id={getId(it)}>
                    {renderCard(it)}
                  </DraggableCard>
                ))}
            </Column>
          ))}
        </div>

        <DragOverlay>{activeItem ? renderCard(activeItem) : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanBanView;
