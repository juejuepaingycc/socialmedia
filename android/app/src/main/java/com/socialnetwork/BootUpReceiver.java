package com.yht.hinthar;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class BootUpReceiver extends BroadcastReceiver {
@Override
public void onReceive(Context context, Intent intent) {
    if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //log("Starting the service in >=26 Mode from a BroadcastReceiver")
            context.startForegroundService(new Intent(context, com.yht.hinthar.BGService.class));
            return;
        }
        //log("Starting the service in < 26 Mode from a BroadcastReceiver")
        context.startService(new Intent(context, com.yht.hinthar.BGService.class));
    }

}
}
