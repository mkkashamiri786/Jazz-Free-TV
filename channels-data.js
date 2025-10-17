// Channels data for Shaheen TV
const channelsData = {
    "quickAccess": [
        {
            id: "WOMENWC2025-abr",
            name: "ICC Women ODI WC",
            category: "sports",
            logo: "https://img.freepik.com/premium-vector/cricket-logo-design-vector-template_739617-225.jpg",
            isLive: true
        },
        {
            id: "Tensports-abr",
            name: "Ten Sports HD",
            category: "sports", 
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ten_Sports_2016.png/800px-Ten_Sports_2016.png",
            isLive: true
        },
        {
            id: "PTVHome-abr",
            name: "PTV Home",
            category: "entertainment",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PTV_Home_logo.svg/1200px-PTV_Home_logo.svg.png",
            isLive: true
        },
        {
            id: "AFGVSBAN-abr",
            name: "BAN vs AFG ODI",
            category: "sports",
            logo: "https://img.freepik.com/premium-vector/cricket-logo-design-vector-template_739617-225.jpg",
            isLive: true
        },
        {
            id: "PKvSA-TOT-abr",
            name: "PAK vs SA Test",
            category: "sports",
            logo: "https://img.freepik.com/premium-vector/cricket-logo-design-vector-template_739617-225.jpg",
            isLive: true
        }
    ]
};

// Function to get quick access channels
function getQuickAccessChannels() {
    return channelsData.quickAccess;
}

// Function to get channel by ID
function getChannelById(channelId) {
    return channelsData.quickAccess.find(channel => channel.id === channelId);
}