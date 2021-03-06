function handleOpenURL(url) {
    setTimeout(function() {
        Adjust.appWillOpenUrl(url);
    }, 0);
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // Register for universal links
        if (device.platform == 'iOS') {
            universalLinks.subscribe('adjustDeepLinking', app.didLaunchAppFromLink);
        }

        var adjustConfig = new AdjustConfig("2fm9gkqubvpc", AdjustConfig.EnvironmentSandbox);

        adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
        adjustConfig.setShouldLaunchDeeplink(true);
        adjustConfig.setDelayStart(3.0);
        adjustConfig.setSendInBackground(true);

        // adjustConfig.setEventBufferingEnabled(true);
        adjustConfig.setDeviceKnown(true);
        adjustConfig.setUserAgent("Custom Adjust User Agent");
        adjustConfig.setReadMobileEquipmentIdentity(true);

        adjustConfig.setAttributionCallbackListener(function(attribution) {
            console.log("### Attribution callback received");

            console.log("Tracker token = " + attribution.trackerToken);
            console.log("Tracker name = " + attribution.trackerName);
            console.log("Network = " + attribution.network);
            console.log("Campaign = " + attribution.campaign);
            console.log("Adgroup = " + attribution.adgroup);
            console.log("Creative = " + attribution.creative);
            console.log("Click label = " + attribution.clickLabel);
            console.log("Adid = " + attribution.adid);
        });

        adjustConfig.setEventTrackingSucceededCallbackListener(function(eventSuccess) {
            console.log("### Event tracking succeeded callback received");

            console.log("Message: " + eventSuccess.message);
            console.log("Timestamp: " + eventSuccess.timestamp);
            console.log("Adid: " + eventSuccess.adid);
            console.log("Event token: " + eventSuccess.eventToken);
            console.log("JSON response: " + eventSuccess.jsonResponse);
        });

        adjustConfig.setEventTrackingFailedCallbackListener(function(eventFailed) {
            console.log("### Event tracking failed callback received");

            console.log("Message: " + eventFailed.message);
            console.log("Timestamp: " + eventFailed.timestamp);
            console.log("Adid: " + eventFailed.adid);
            console.log("Event token: " + eventFailed.eventToken);
            console.log("Will retry: " + eventFailed.willRetry);
            console.log("JSON response: " + eventFailed.jsonResponse);
        });

        adjustConfig.setSessionTrackingSucceededCallbackListener(function(sessionSuccess) {
            console.log("### Session tracking succeeded callback received");

            console.log("Message: " + sessionSuccess.message);
            console.log("Timestamp: " + sessionSuccess.timestamp);
            console.log("Adid: " + sessionSuccess.adid);
            console.log("JSON response: " + sessionSuccess.jsonResponse);
        });

        adjustConfig.setSessionTrackingFailedCallbackListener(function(sessionFailed) {
            console.log("### Session tracking failed callback received");

            console.log("Message: " + sessionFailed.message);
            console.log("Timestamp: " + sessionFailed.timestamp);
            console.log("Adid: " + sessionFailed.adid);
            console.log("Will retry: " + sessionFailed.willRetry);
            console.log("JSON response: " + sessionFailed.jsonResponse);
        });

        adjustConfig.setDeferredDeeplinkCallbackListener(function(uri) {
            console.log("### Deferred Deeplink Callback received");

            console.log("URL: " + uri);
        });

        Adjust.addSessionCallbackParameter("dummy_foo", "dummy_bar");
        Adjust.addSessionCallbackParameter("dummy_foo_foo", "dummy_bar");

        Adjust.addSessionPartnerParameter("dummy_foo", "dummy_bar");
        Adjust.addSessionPartnerParameter("dummy_foo_foo", "dummy_bar");

        Adjust.removeSessionCallbackParameter("dummy_foo");
        Adjust.removeSessionPartnerParameter("dummy_foo");

        // Adjust.resetSessionCallbackParameters();
        // Adjust.resetSessionPartnerParameters();

        Adjust.create(adjustConfig);

        Adjust.sendFirstPackages();
    },

    didLaunchAppFromLink: function(eventData) {
        Adjust.appWillOpenUrl(eventData.url);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        var btnGdprForgetMe = document.getElementById("btnGdprForgetMe");
        var btnTrackSimpleEvent = document.getElementById("btnTrackSimpleEvent"); 
        var btnTrackRevenueEvent = document.getElementById("btnTrackRevenueEvent");
        var btnTrackCallbackEvent = document.getElementById("btnTrackCallbackEvent");
        var btnTrackPartnerEvent = document.getElementById("btnTrackPartnerEvent");
        var btnEnableDisableOfflineMode = document.getElementById("btnEnableDisableOfflineMode");
        var btnEnableDisableSdk = document.getElementById("btnEnableDisableSdk");
        var btnIsSdkEnabled = document.getElementById("btnIsSdkEnabled");

        btnTrackSimpleEvent.addEventListener('click', function() {
            var adjustEvent = new AdjustEvent("g3mfiw");
            
            Adjust.trackEvent(adjustEvent);
        }, false);

        btnTrackRevenueEvent.addEventListener('click',function() { 
            var adjustEvent = new AdjustEvent("a4fd35");
            
            adjustEvent.setRevenue(0.01, "USD");
            adjustEvent.setTransactionId("dummy_id");
            
            Adjust.trackEvent(adjustEvent);
        }, false);

        btnTrackCallbackEvent.addEventListener('click',function() {
            var adjustEvent = new AdjustEvent("34vgg9");

            adjustEvent.addCallbackParameter("key", "stuff");
            adjustEvent.addCallbackParameter("x", "y");
            adjustEvent.addCallbackParameter("key", "lock");

            Adjust.trackEvent(adjustEvent);
        }, false);

        btnTrackPartnerEvent.addEventListener('click',function() {
            var adjustEvent = new AdjustEvent("w788qs");

            adjustEvent.addPartnerParameter("foo", bar);
            adjustEvent.addPartnerParameter("x", "y");
            adjustEvent.addPartnerParameter("foo", "foot");
            adjustEvent.addPartnerParameter("x", "z");
            
            Adjust.trackEvent(adjustEvent);
        }, false);

        btnEnableOfflineMode.addEventListener('click', function() {
            Adjust.setOfflineMode(true);
        }, false);

        btnDisableOfflineMode.addEventListener('click', function() {
            Adjust.setOfflineMode(false);
        }, false);

        btnEnableSdk.addEventListener('click', function() {
            Adjust.setEnabled(true);
        }, false);

        btnDisableSdk.addEventListener('click', function() {
            Adjust.setEnabled(false);
        }, false);

        btnIsSdkEnabled.addEventListener('click', function() {
            Adjust.isEnabled(function(isEnabled) {
                if (isEnabled) {
                    navigator.notification.alert('Yes, it is enabled.', null, 'Is SDK Enabled?', 'OK');
                } else {
                    navigator.notification.alert('No, it is not enabled.', null, 'Is SDK Enabled?', 'OK');
                }
            });
        }, false);

        btnGdprForgetMe.addEventListener('click', function() {
            Adjust.gdprForgetMe();
        }, false);

        btnGetIds.addEventListener('click', function() {
            Adjust.getIdfa(function(idfa) {
                console.log("IDFA = " + idfa);
            });

            Adjust.getGoogleAdId(function(gpsAdId) {
                console.log("Google Ad Id = " + gpsAdId);
            });

            Adjust.getAmazonAdId(function(gpsAdId) {
                console.log("Amazon Ad Id = " + gpsAdId);
            });

            Adjust.getAdid(function(adid) {
                console.log("Adid = " + adid);
            });

            Adjust.getAttribution(function(attribution) {
                console.log("Tracker token = " + attribution.trackerToken);
                console.log("Tracker name = " + attribution.trackerName);
                console.log("Network = " + attribution.network);
                console.log("Campaign = " + attribution.campaign);
                console.log("Adgroup = " + attribution.adgroup);
                console.log("Creative = " + attribution.creative);
                console.log("Click label = " + attribution.clickLabel);
                console.log("Adid = " + attribution.adid);
            });
        }, false);
    }
};

app.initialize();
