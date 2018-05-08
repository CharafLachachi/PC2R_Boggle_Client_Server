package application.utilities;

import java.util.Observer;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

public class MyTimer {
    private long time;
    private long fixedTime;
    private Timer timer;
    private Observer observer;


    public MyTimer(long max, Observer observer) {
        this.observer = observer;
        this.time = max*60*1000;
        this.fixedTime = max*60*1000;
    }

    public void start() {
        timer = new Timer("Timer");
        TimerTask repeatedTask = new TimerTask() {
            public void run() {
                time-=1000L;
                
                observer.update(null, MyTimer.this.toString());
                if (time <= 0) {
                    stop();
                }
            }
        };
        long delay = 0;
        long period = 1000L;
        timer.scheduleAtFixedRate(repeatedTask, delay, period);
    }

    public void stop() {
        time = 0;
        timer.cancel();
        observer.update(null, MyTimer.this.toString());
    }

    public void restart() {
    	 this.time = fixedTime;
    	 start();
    }
    @Override
    public String toString() {
        return String.format("%02d min, %02d sec",
                TimeUnit.MILLISECONDS.toMinutes(time),
                TimeUnit.MILLISECONDS.toSeconds(time) -
                        TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(time)));
    }
}
