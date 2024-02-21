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

function App() {

  const [storage, setStorage] = useState();

  const timerDurations: Record<string, number>  = {
    pomodoro: storage ? storage['pomodoro'] * 60 : 25 * 60,
    shortBreak: storage ? storage['shortBreak'] * 60 :  5 * 60,
    longBreak: storage ? storage['longBreak'] * 60 : 10 * 60
  };

  // const [timerDurations, setTimerDurations] = useState<Record<string, number>>({
  //   pomodoro: 25 * 60,
  //   shortBreak: 5 * 60,
  //   longBreak: 10 * 60
  // });
  const [timerType, setTimerType] = useState<string>("pomodoro");
  
  const [isActive, setIsActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(timerDurations[timerType]);
  const [isOpenDialog, setIsOpenDialog]= useState<boolean>(false);

  console.log(seconds)

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

  }, []);


  return (
    <div className="bg-sky-950 h-dvh w-auto flex items-center justify-start flex-col p-10">
      <div className="flex items-center justify-between w-150">
        <span>logo</span>
        <Drawer>
          <DrawerTrigger className="text-white bg-black/[.08] hover:bg-black/[.5] w-32 rounded-md ">Settings</DrawerTrigger>
            <DrawerContent className="bg-sky-950 text-white">
              <DrawerHeader>
                <DrawerTitle className="text-center">Settings</DrawerTitle>
                <Settings />
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
      </div>
       <Separator className="my-4 w-150  bg-white/[.07]" />
      <div className="bg-white/[.07] h-96 w-128 rounded-md flex items-center justify-around flex-col">
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
        <div className="text-white mb-10"> 
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
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="bg-sky-950 text-white">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle className="text-white">Welcome!</DialogTitle>
            <DialogDescription>
              <Settings setIsDialog={setIsOpenDialog} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;