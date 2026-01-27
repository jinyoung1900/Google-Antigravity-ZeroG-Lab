package com.chronos.tracker;

import android.content.res.Configuration;
import android.content.res.Resources;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public Resources getResources() {
        Resources res = super.getResources();
        if (res != null) {
            Configuration config = res.getConfiguration();
            if (config != null && config.fontScale != 1.0f) {
                config.fontScale = 1.0f; // Force font scale to 1.0
                res.updateConfiguration(config, res.getDisplayMetrics());
            }
        }
        return res;
    }
}
