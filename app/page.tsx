"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const tasks = useQuery(api.tasks.get);
  const toggleComplete = useMutation(api.tasks.toggleComplete);
  const add = useMutation(api.tasks.add);
  const deleteTask = useMutation(api.tasks.deleteTask);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex items-center justify-between space-x-2">
        <input type="text" placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer" onClick={() => add({ text })}>Add</button>
      </div>
      {tasks?.map(({ _id, text, isCompleted }) => (
        <div className="flex items-center justify-between space-x-2" key={_id}>
          <button
            onClick={() => toggleComplete({ id: _id })}
            className="mb-2 text-left cursor-pointer"
          >
            <span className="hover:text-gray-500" style={{ textDecoration: isCompleted ? "line-through" : "none" }}>{text}</span>
          </button>
          <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => deleteTask({ id: _id })}>(delete)</button>
        </div>
      ))}
    </main>
  );
}