package com.yht.hinthar;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.media.AudioAttributes;
import android.net.Uri;
import 	android.content.ContentResolver;
import 	android.R;
import 	android.content.Context;

public class MainActivity extends ReactActivity {

     @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);

        //if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {    
            NotificationChannel notificationChannel = new NotificationChannel("ninechat_channel", "App notification channel", NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.setShowBadge(true);
            
            notificationChannel.setDescription("custom notification channel");
            notificationChannel.enableVibration(true);
            //notificationChannel.enableLights(true);
            notificationChannel.setVibrationPattern(new long[]{400, 200, 400});
            //notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            AudioAttributes att = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
            notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE
        + "://" + getApplicationContext().getPackageName() + "/raw/incallmanager_ringtone"), att);

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(notificationChannel);
       // }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SocialNetwork";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
