"use client";
import { redirect } from "next/navigation";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTodoForm, createTodoForm } from "./forms";

export default function NewTodoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTodoForm>({
    resolver: zodResolver(createTodoForm),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateTodoForm) => {
      const result = await fetch("/api/todos", {
        method: "post",
        body: JSON.stringify(data),
      });

      if (result.ok) {
        return redirect("/todos");
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((f, e) => {
          e?.preventDefault();
          mutation.mutate(f);
        })}
      >
        <input style={{ background: "grey" }} {...register("title")} />
        {errors.title?.message && <p>{errors.title?.message}</p>}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
