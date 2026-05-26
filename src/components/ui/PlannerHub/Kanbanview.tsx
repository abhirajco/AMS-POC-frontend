import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePlanner } from "@/store/usePlanner";
import { Badge } from "../badge";

const Kanbanview = () => {

  const {planner, loading, fetchTasks} = usePlanner();
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const columns = [
    {
      title: "To Do",
      value: "to_do",
    },
    {
      title: "In Progress",
      value: "in_progress",
    },
    {
      title: "Blocked",
      value: "blocked",
    },
    {
      title: "Completed",
      value: "completed",
    },
  ];

//   const getPriorityBadge = (priority: string) => {

//     if (priority === "high") {
//       return (
//         <div className="bg-[#C33142] text-white text-xs">
//           High
//         </div>
//       );
//     }

//     if (priority === "medium") {
//       return (
//         <div className="bg-gray-100 text-black text-xs">
//           Medium
//         </div>
//       );
//     }

//     return (
//       <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
//         Low
//       </div>
//     );
//   };

const getPriorityBadge = (priority: string) => {
  const normalized = (priority || '').toLowerCase();
  switch (normalized) {
    case 'high':
      return <Badge className="bg-[#C33142] text-white text-xs">High</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-gray-100 text-black text-xs">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-xs">Low</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{priority}</Badge>;
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  }


  return (
    <div className="px-4 sm:px-6 pb-4">

      <div className="bg-gray-200/40 rounded-lg p-4 sm:p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {columns.map((column) => (

            <div
              key={column.value}
              className="space-y-4"
            >

              {/* COLUMN TITLE */}

              <div className="flex items-center justify-between">

                <h4 className="font-semibold text-[12px] text-black">
                  {column.title}
                </h4>

                <div className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {
                    planner.filter(
                      (task) => task.status === column.value
                    ).length
                  }
                </div>

              </div>


              {/* TASKS */}

              <div className="space-y-4">

                {planner
                  .filter((task) => task.status === column.value)
                  .map((task) => (

                    <Card
                      key={task.task_id}
                      className="bg-white border border-gray-300 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >

                      <CardContent className="p-0">

                        <div className="space-y-3">

                          <div className="flex items-start gap-2 flex-wrap">

                            {getPriorityBadge(task.priority)}

                            <div className="bg-gray-100 text-black text-xs px-2 py-1 rounded">
                              {task.marketing_type || "Task"}
                            </div>

                          </div>

                          <h5 className="font-medium text-[14px] text-black line-clamp-2">
                            {task.title}
                          </h5>

                          <div className="flex flex-wrap gap-1.5">

                            {task.tags_list?.slice(0, 3).map((tag, index) => (

                              <div
                                key={index}
                                className="border border-gray-300 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </div>

                            ))}

                            {task.tags_list?.length > 3 && (

                              <div className="border border-gray-300 text-xs px-2 py-1 rounded text-gray-500">
                                +{task.tags_list.length - 3}
                              </div>

                            )}

                          </div>

                          <div className="space-y-2">

                            {task.due_date && (

                              <div className="flex items-center gap-1 text-gray-600 text-xs">

                                <Calendar className="w-4 h-4" />

                                <span className={new Date(task.due_date) > new Date()? "text-red-600 font-medium": ""}>
                                  Due: {task.due_date}
                                </span>

                              </div>

                            )}


                            {task.launch_date && (

                              <div className="flex items-center gap-1 text-gray-600 text-xs">

                                <Calendar className="w-4 h-4" />

                                <span>
                                  Launch: {task.launch_date}
                                </span>

                              </div>

                            )}

                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-700">

                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-semibold uppercase">
                              {
                                task.assigned_to_name?.split(" ").map((word) => word[0]).join("").slice(0, 2)
                              }
                            </div>

                            <span className="font-medium">
                              {task.assigned_to_name || "Unassigned"}
                            </span>

                          </div>


                        </div>

                      </CardContent>

                    </Card>

                  ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Kanbanview;