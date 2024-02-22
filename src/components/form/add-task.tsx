import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string(),
  description: z.string()
});

function AddTask(){
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                    <Input className="text-black " {...field} />
                  </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-120">
                <FormLabel>descrition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your message here." {...field} />
                  </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="bg-black/[.08] hover:bg-black/[.5] rounded-md mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}


export default AddTask;
