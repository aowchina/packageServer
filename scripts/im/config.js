var conf = {
    iosConfigPath:"im/pack_config.json",
    im:{
        infoPlistPath:"im/conf/im/im.plist",
        entitlementsPath:"im/conf/im/im.entitlements",
        shareGroupInfoPlistPath:"ShareExtension/Info.plist",
        shareGroupEntitlementsPath:"ShareExtension/ShareExtension.entitlements",
    },
    im_appstore:{
        infoPlistPath:"im/conf/appstore/im.plist",
        entitlementsPath:"im/conf/appstore/im.entitlements",
        shareGroupInfoPlistPath:"ShareExtension/Info_AppStore.plist",
        shareGroupEntitlementsPath:"ShareExtension/ShareExtension_AppStore.plist",
    },
    androidConfigPath:"files/android_conf.json",
    androidGradlePaty:"files/build.gradle"
};
module.exports = conf;