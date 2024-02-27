import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Task } from "@/App";
import { Checkbox } from "../ui/checkbox";


export type AddTaskProps = {
  isEdit?: boolean;
  task?: Task;
  setActualTask : React.Dispatch<React.SetStateAction<Task>>
};

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  finished: z.string(),
});

function AddTask(props: Readonly<AddTaskProps>){
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.task?.name ? props.task.name : '',
      description: props.task?.description ? props.task.description : '',
      finished: ''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      if(props.isEdit) {
        const response = await api.patch(`/tasks/${props.task?.id}`, {
          name: values.name,
          description : values.description,
        });
        props.setActualTask(response.data)
      }else{
        const response = await api.post('/tasks', {
          name: values.name,
          description : values.description,
        });
        props.setActualTask(response.data)
      }
    }catch(err) {
      console.log(err);
    }
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center justify-center my-4">
        <div className="flex flex-col justify-center items-center">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-120">
                <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input className="text-black" placeholder="Type name description here." {...field} />
                  </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-120">
                <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type description here." {...field} />
                  </FormControl>
              </FormItem>
            )}
          />
          {props.isEdit && (
            <FormField
            control={form.control}
            name="finished"
            render={({ field }) => (
              <FormItem className="w-120">
                <Checkbox id="finished"
                  onCheckedChange={(e) => form.setValue("finished", e.valueOf().toString())}
                {...field} />
                <label
                  htmlFor="finished"
                  className="text-sm font-medium leading-none peer-disa1bled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                >
                  finished task
                </label>
              </FormItem>
            )}
          />
          )}
        </div>
        <Button className="bg-black/[.08] hover:bg-black/[.5] rounded-md mt-4" type="submit">
          {props.isEdit ? 'Edit': 'Submit'}
        </Button>
      </form>
    </Form>
  )
}


export default AddTask;
