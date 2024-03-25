const config = {
    appName: "KhoPlus Desktop",
    appVersion: "v1.0.0",
    apiUrl: localStorage.getItem('LinkServer'),
}
$('.appName').text(config.appName)
$('.appVersion').text(config.appVersion)
