"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function TaskCard({ task }: { task: any }) {
  const router = useRouter();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.status === 204) {
        router.refresh();
      }
      console.log(res);
    }
  };

  const handleComplete = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task.id}/done/`,
      {
        method: "POST",
      }
    );
    if (res.status === 200) {
      router.refresh();
    }
    console.log(res);
  };

  const handleUpdate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task.id}/`,
      {
        method: "PUT",
        body: JSON.stringify({ title, description }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      setEdit(false);
    }
    console.log(res);
  };

  return (
    <div className="bg-slate-500 px-4 py-3 mb-2 rounded-md flex justify-between items-center">
      <div className="flex flex-col">
        {!edit ? (
          <h2 className="font-bold">
            {task.done ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
            &nbsp;
            {title}
          </h2>
        ) : (
          <input
            type="text"
            placeholder={task.title}
            className="p-2 bg-slate-500 border-none outline-none text-black"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        )}

        {!edit ? (
          <p>{task.description}</p>
        ) : (
          <textarea
            placeholder={description}
            className="p-2 bg-slate-500 border-none outline-none text-black"
            rows={1}
          ></textarea>
        )}
      </div>
      <div className="flex justify-between gap-x-2">
        {edit && (
          <button
            className="bg-slate-300 text-black rounded-md p-2"
            onClick={handleUpdate}
          >
            Guardar
          </button>
        )}

        <button
          className="bg-red-500 text-white rounded-md p-2"
          onClick={handleDelete}
        >
          Eliminar
        </button>
        <button
          className="bg-indigo-500  text-white rounded-md p-2"
          onClick={() => setEdit(!edit)}
        >
          Actualizar
        </button>
        <button
          className={`text-white rounded-md p-2 ${
            task.done ? "bg-gray-500" : "bg-green-500"
          }`}
          onClick={handleComplete}
        >
          {task.done ? "Uncomplete" : "Complete"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
