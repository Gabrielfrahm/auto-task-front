import { useEffect } from "react";
import {addSeconds, format} from "date-fns";

export type TimerProps = {
    isActive: boolean,
    seconds: number,
    setSeconds: (value: React.SetStateAction<number>) => void
}

function Timer(props: Readonly<TimerProps>){ 
    useEffect(() => {
      let interval: string | number | NodeJS.Timeout | undefined;
      if (props.isActive) {
        interval = setInterval(() => {
          props.setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);
      } else if (!props.isActive && props.seconds !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [props]);
  
    const formatDate = () =>  {
      const date = addSeconds(new Date(0), props.seconds);
      return format(date, "mm:ss")
    }

    return (
      <div className="flex flex-col">
        <p className="text-9xl font-bold">{formatDate()}</p>
      </div>
    );
}


export default Timer;