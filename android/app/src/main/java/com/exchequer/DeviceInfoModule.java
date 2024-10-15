package com.exchequer;

import androidx.annotation.NonNull;
import android.os.Build;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class DeviceInfoModule extends ReactContextBaseJavaModule {
    public DeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @ReactMethod
    public void getDeviceInfo(String name, Promise promise) {
       
        String eventId =null;

            if(name.equalsIgnoreCase("BrandName") ){
                eventId =Build.BRAND;
            } else if (name.equalsIgnoreCase("ModelName")) {
                eventId =Build.MODEL;
            } else if (name.equalsIgnoreCase("AppVersion")) {
                eventId =BuildConfig.VERSION_NAME;
            }else if (name.equalsIgnoreCase("AppCode")) {
                eventId = String.valueOf(BuildConfig.VERSION_CODE);
            }else if (name.equalsIgnoreCase("PackageName")) {
                eventId =BuildConfig.APPLICATION_ID;
            }else {
                eventId ="Undefine";
            }

        promise.resolve(eventId);
    }

    @NonNull
    @Override
    public String getName() {
        return "DeviceInfoModule";
    }
}
