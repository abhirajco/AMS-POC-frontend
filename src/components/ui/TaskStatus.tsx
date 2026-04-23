// type TaskStatusProps = {
//   progress: number;
// };

// const widthClass: Record<number, string> = {
//   0: "w-0",
//   25: "w-1/4",
//   50: "w-1/2",
//   75: "w-3/4",
//   100: "w-full",
// };

// const TaskStatus = ({ progress }: TaskStatusProps) => {
//   return (
//     <div>
//       <div className="h-2 border rounded-md border-gray-300 overflow-hidden">
//         <div
//           className={`bg-blue-950 h-full transition-all duration-300 ${widthClass[progress]}`}
//         >
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskStatus;

type TaskStatusProps = {
  progress: number;
};

const widthClass: Record<number, string> = {
  0: "w-0",
  25: "w-1/4",
  50: "w-1/2",
  75: "w-3/4",
  100: "w-full",
};

const TaskStatus = ({ progress }: TaskStatusProps) => {
  return (
    <div className="w-full">
      
      {/* Progress Bar */}
      <div className="h-2 border rounded-md border-gray-300 overflow-hidden">
        <div
          className={`bg-blue-950 h-full transition-all duration-300 ${widthClass[progress]}`}
        />
      </div>

      {/* Labels */}
      <div className="relative mt-2 text-xs font-bold">
        
        <span className="absolute left-0">Draft</span>

        <span className="absolute left-1/4 -translate-x-1/2">
          In Review
        </span>

        <span className="absolute left-3/4 -translate-x-1/2">
          Approved
        </span>

        <span className="absolute right-0">
          Published
        </span>

      </div>
    </div>
  );
};

export default TaskStatus;