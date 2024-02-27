import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import Timer from "./components/timer/timer";
import { Separator } from "@/components/ui/separator";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Settings from "./components/form/settings";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import {CheckSquare, LucideSettings, PlusCircle } from "lucide-react";
import AddTask from "./components/form/add-task";
import { api } from "./lib/axios";
import {format} from 'date-fns'

export type Task = {
  id: string;
  name: string;
  description: string;
  data: string;
  initial_hour: string;
  finished_hour: string;
}

function App() {

  const [storage, setStorage] = useState<Record<string, number>>();
  const [timerDurations, setTimerDurations] = useState<Record<string, number>>({
    pomodoro: storage ? storage['pomodoro'] *  60 : 25 * 60,
    shortBreak:  storage ? storage['shortBreak'] *  60 : 5 * 60,
    longBreak:  storage ? storage['longBreak'] *  60 : 10 * 60
  });
  const [timerType, setTimerType] = useState<string>("pomodoro");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(timerDurations[timerType]);
  const [isOpenDialog, setIsOpenDialog]= useState<boolean>(false);
  const [isOpenDialogAddTask, setIsOpenDialogAddTask]= useState<boolean>(false);
  const [actualTask, setActualTask] = useState<Task>({} as Task);
  const handleType = (type: string) => {
    setTimerType(type);
    setSeconds(timerDurations[type]);
    setIsActive(false);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(timerDurations[timerType]);
    setIsActive(false);
  };

  useEffect(()=> {
    const storage = localStorage.getItem('auto-task');

    if(storage){
      setStorage(JSON.parse(storage));
    }

    if(!storage){
      setIsOpenDialog(true)
    }
  }, [timerType]);

  useEffect(() => {
    if(storage){
      setTimerDurations({
        pomodoro : storage['pomodoro'] *  60,
        shortBreak: storage['shortBreak'] * 60,
        longBreak: storage['longBreak'] * 60,
      })
      setSeconds(storage[timerType] * 60);
    }
  },[storage, timerType]);

  useEffect(() => {
    (async () => {
      const tasks = await api.get('/tasks', {
        params: {
          start_at: format(new Date(), 'yyyy-MM-dd')
        }
      });
      setActualTask(tasks.data.data[0]);
    })();
  }, []);

  // console.log(actualTask)
  return (
    <div className="bg-sky-950 h-dvh w-auto flex items-center justify-start flex-col p-10">
      <div className="flex items-center justify-between w-150">
        <div className="flex items-center gap-2">
          <CheckSquare color="white" size={28} />
          <p className="text-white font-bold" >Auto Task</p>
        </div>
        <Drawer>
          <DrawerTrigger className="text-white font-semibold rounded-md flex gap-2 text-center">
            <LucideSettings/> Settings
          </DrawerTrigger>
            <DrawerContent className="bg-sky-950 text-white">
              <DrawerHeader>
                <DrawerTitle className="text-center">Settings</DrawerTitle>
                <Settings setSeconds={setSeconds} setTimerDurations={setTimerDurations} timerType={timerType} />
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
      </div>
       <Separator className="mb-10 mt-4  w-150  bg-white/[.07]" />
      <div className="bg-white/[.07] h-80 w-128 rounded-md flex items-center justify-around flex-col p-2">
        <div className="text-white flex justify-around items-center w-full">
          <Button onClick={() => handleType("pomodoro")}
            className={`text-lg bg-black/[.08] hover:bg-black/[.5] ${timerType === 'pomodoro' ? 'bg-black' : ''}`}>
            Pomodoro
          </Button>
          <Button  onClick={() => handleType("shortBreak")}
           className={`text-lg bg-black/[.08] hover:bg-black/[.5] ${timerType === 'shortBreak' ? 'bg-black' : ''}`}>Short Break</Button>
          <Button  onClick={() => handleType("longBreak")}
           className={`text-lg bg-black/[.08] hover:bg-black/[.5] ${timerType === 'longBreak' ? 'bg-black' : ''}`}>Long Break</Button>
        </div>
        <div className="text-white mb-2">
          <Timer
            isActive={isActive}
            seconds={seconds}
            setSeconds={setSeconds}
          />
        </div>
        <div className="flex items-center justify-around w-full">
          <Button className="bg-zinc-50 w-52 h-16 text-2xl text-sky-950  hover:bg-black/[.5] hover:text-white shadow shadow-xl"
            onClick={toggle}>
              {isActive ? 'PAUSE' : 'START'}
          </Button>
          <Button disabled={!isActive} className={`bg-zinc-50 w-52 h-16 text-2xl text-sky-950  hover:bg-black/[.5] hover:text-white shadow shadow-xl`} onClick={reset}>RESET</Button>
        </div>
      </div>
      <Separator className="my-8 w-128 bg-white/[.07]" />
      {!actualTask?.id && (
        <Button
          className="border-dashed border-2 border-sky-50 w-128 h-20 text-white font-semibold  bg-white/[.07]  hover:bg-black/[.1] hover:text-white shadow shadow-xl gap-4"
          onClick={() => setIsOpenDialogAddTask(true)}
        >
          <PlusCircle size={24}/> Add Task
        </Button>
      )}
      {actualTask?.id && (
        <div className="flex flex-col justify-center items-center">
          <p className="font-semibold text-white text-xl mb-3">Actual Task</p>
          <Button
            className="border-dashed border-2 border-sky-50 w-128 h-20 text-white font-semibold  bg-white/[.07]  hover:bg-black/[.1] hover:text-white shadow shadow-xl gap-4 text-lg"
            onClick={() => setIsOpenDialogAddTask(true)}
          >
            {actualTask.name}
          </Button>
        </div>
      )}
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="bg-sky-950 text-white">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle className="text-white">Welcome!</DialogTitle>
            <DialogDescription>
              <Settings setIsDialog={setIsOpenDialog} setSeconds={setSeconds} setTimerDurations={setTimerDurations} timerType={timerType} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenDialogAddTask} onOpenChange={setIsOpenDialogAddTask}>
        <DialogContent className="flex justify-center items-center flex-col">
          <DialogHeader className="">
            <DialogTitle className="">{actualTask?.id ? 'Edit': 'Add Task'}</DialogTitle>
          </DialogHeader>
          <div className="w-128">
            <AddTask setActualTask={setActualTask} task={actualTask} isEdit={!!actualTask?.id} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
