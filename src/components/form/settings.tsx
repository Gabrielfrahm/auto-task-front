import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, Form, FormLabel } from "@/components/ui/form";
import { Input } from "../ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  pomodoro: z.string(),
  shortBreak: z.string(),
  longBreak: z.string()
});

export type SettingsProps = {
    setIsDialog?: React.Dispatch<React.SetStateAction<boolean>>;
    setTimerDurations:React.Dispatch<React.SetStateAction<Record<string, number>>>;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    timerType: string;
}

function Settings(props: Readonly<SettingsProps>){
    const storage = localStorage.getItem("auto-task");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pomodoro: "25",
            longBreak: "10",
            shortBreak: "5"
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if(props.setIsDialog){
            props.setIsDialog(false);
        }

        let storage = localStorage.getItem("auto-task");

        if(!storage){
            localStorage.setItem("auto-task", JSON.stringify(values));
            storage = localStorage.getItem("auto-task");
            if(storage){
                props.setTimerDurations({
                    pomodoro : JSON.parse(storage)['pomodoro'] *  60,
                    shortBreak: JSON.parse(storage)['shortBreak'] * 60,
                    longBreak: JSON.parse(storage)['longBreak'] *60,
                  })
                  props.setSeconds(JSON.parse(storage)[props.timerType] * 60);
            }
        }else {
            localStorage.removeItem("auto-task");
            localStorage.setItem("auto-task", JSON.stringify(values));
            storage = localStorage.getItem("auto-task");
            if(storage){
                props.setTimerDurations({
                    pomodoro : JSON.parse(storage)['pomodoro'] *  60,
                    shortBreak: JSON.parse(storage)['shortBreak'] * 60,
                    longBreak: JSON.parse(storage)['longBreak'] *60,
                  })
                  props.setSeconds(JSON.parse(storage)[props.timerType] * 60);
            }
        }
    }

    useEffect(() => {
        if(storage) {
            form.setValue("pomodoro",  JSON.parse(storage)['pomodoro']);
            form.setValue("shortBreak",  JSON.parse(storage)['shortBreak']);
            form.setValue("longBreak",  JSON.parse(storage)['longBreak']);
        }
    }, [storage, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-around">
                <div className="flex justify-center items-center w-auto p-10">
                    <FormField
                        control={form.control}
                        name="pomodoro"
                        render={({ field }) => (
                            <FormItem className="mr-10">
                                <FormLabel>Pomodoro timer</FormLabel>
                                <FormControl>
                                    <Input className="text-black " type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shortBreak"
                        render={({ field }) => (
                            <FormItem className="mr-10">
                                <FormLabel>Short Break timer</FormLabel>
                                <FormControl>
                                    <Input className="text-black  " type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longBreak"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Long Break timer</FormLabel>
                                <FormControl>
                                    <Input className="text-black " type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <Button variant="outline" className="text-white bg-black/[.08] hover:bg-black/[.5] rounded-md "type="submit">Submit</Button>
        </form>
      </Form>
    )
}

export default Settings;
