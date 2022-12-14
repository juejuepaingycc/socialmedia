package com.yht.hinthar;

import com.yht.hinthar.generated.BasePackageList;
import android.app.Application;
import android.util.Log;

import android.content.Intent; 
import android.content.res.Configuration; 

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;
import com.wix.reactnativekeyboardinput.KeyboardInputPackage;

import com.facebook.react.PackageList;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.yht.hinthar.launchapplication.LaunchApplicationPackage;;
import com.yht.hinthar.videoplayer.VideoPlayerPackage;
import com.yht.hinthar.BGPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.reactnativerestart.RestartPackage; 
//import com.paisasoft.rnbridges.unstoppablebackgroundservice.RNUnstoppableBackgroundServicePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), null);

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();

      // Add unimodules
      List<ReactPackage> unimodules = Arrays.<ReactPackage>asList(
        new ModuleRegistryAdapter(mModuleRegistryProvider)
      );
      packages.addAll(unimodules);

      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
        packages.add(new VideoPlayerPackage());
        packages.add(new LaunchApplicationPackage());
        packages.add(new BGPackage());
        packages.add(new KeyboardInputPackage(this.getApplication()));
       // packages.add(new FBSDKPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
