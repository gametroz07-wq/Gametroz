import type { IconKey, PlatformSlug } from "@/types/content";

/**
 * Source of truth for the Apps section. Every app, platform and category the site lists is defined here.
 * `npm run apps:sync` writes these definitions to the database; the seed derives from the same data.
 *
 * Facts policy: only the official website and download URLs (verified on LINKS_VERIFIED_AT), the publisher
 * and widely documented licensing are stated. Versions, ratings, download counts, prices, file sizes and
 * awards are never written here. `requirements` stays empty unless a minimum is widely documented.
 * Descriptions are original wording, not copied from publisher marketing.
 */

/** Date the official website and download URLs were last checked. */
export const LINKS_VERIFIED_AT = "2026-10-02";

export type PlatformDefinition = {
  slug: PlatformSlug;
  name: string;
  description: string;
  iconKey: IconKey;
  sortOrder: number;
};

export type AppCategoryDefinition = {
  slug: string;
  name: string;
  /** 120 to 160 characters; also the base of the category meta description. */
  description: string;
  iconKey: IconKey;
  sortOrder: number;
};

export type AppDefinition = {
  slug: string;
  name: string;
  categorySlug: string;
  platforms: PlatformSlug[];
  developer: string;
  /** One line, shown on cards and under the page title. */
  shortDescription: string;
  /** Two short paragraphs separated by a blank line. */
  description: string;
  /** Three to six factual points. */
  features: string[];
  /** Licensing or pricing as a plain statement. Open-source licenses only when well established. */
  license?: string;
  officialWebsite: string;
  officialDownloadUrl: string;
  /** Usually empty: only widely documented minimums. */
  requirements: string[];
  /** Slugs of other defined apps that are genuine alternatives, best fit first. */
  alternatives: string[];
  tags: string[];
  /** Page title without the site suffix, up to 49 characters. Defaults to the appTitle template. */
  metaTitle?: string;
  /** 120 to 158 characters, unique per app. */
  metaDescription: string;
  featured: boolean;
  /** Global display order. */
  sortOrder: number;
};

export const platformDefinitions: PlatformDefinition[] = [
  {
    slug: "windows",
    name: "Windows",
    description: "Apps for Windows PCs, from browsers and media players to developer tools, each linked to the publisher's official download page.",
    iconKey: "monitor",
    sortOrder: 0,
  },
  {
    slug: "mac",
    name: "macOS",
    description: "Apps for Mac computers, from browsers and players to editors and utilities, each linked to the publisher's official download page.",
    iconKey: "laptop",
    sortOrder: 1,
  },
  {
    slug: "android",
    name: "Android",
    description: "Apps for Android phones and tablets, each linked to the publisher's official website or its store listing.",
    iconKey: "smartphone",
    sortOrder: 2,
  },
  {
    slug: "ios",
    name: "iOS",
    description: "Apps for iPhone and iPad, each linked to the publisher's official website or its App Store listing.",
    iconKey: "smartphone",
    sortOrder: 3,
  },
  {
    slug: "web",
    name: "Web",
    description: "Apps and browser extensions you use inside your web browser, with nothing to install or only a small add-on to add.",
    iconKey: "globe",
    sortOrder: 4,
  },
  {
    slug: "linux",
    name: "Linux",
    description: "Apps that run on Linux desktops, including many open-source programs, each linked to the publisher's official download page.",
    iconKey: "terminal",
    sortOrder: 5,
  },
];

export const appCategoryDefinitions: AppCategoryDefinition[] = [
  {
    slug: "browsers",
    name: "Browsers",
    description: "Web browsers for desktop and mobile, from mainstream choices to privacy-focused ones, each linked to its official download page.",
    iconKey: "globe",
    sortOrder: 0,
  },
  {
    slug: "productivity",
    name: "Productivity",
    description: "Office suites, note-taking apps and task managers for writing, planning and getting work done, each linked to its official publisher.",
    iconKey: "file",
    sortOrder: 1,
  },
  {
    slug: "media",
    name: "Media",
    description: "Players, editors, recorders and media servers for watching, listening, converting and creating audio and video, linked to official sources.",
    iconKey: "play",
    sortOrder: 2,
  },
  {
    slug: "communication",
    name: "Communication",
    description: "Messaging, calling, team chat and email apps for staying in touch, each linked to the official download page or store listing.",
    iconKey: "message",
    sortOrder: 3,
  },
  {
    slug: "development",
    name: "Development",
    description: "Code editors, version control, containers, databases and other developer tools, each linked to the publisher's official download page.",
    iconKey: "code",
    sortOrder: 4,
  },
  {
    slug: "security",
    name: "Security",
    description: "Password managers, encryption tools, VPNs and privacy add-ons that help protect your accounts and files, linked to official sources.",
    iconKey: "shield",
    sortOrder: 5,
  },
  {
    slug: "utilities",
    name: "Utilities",
    description: "Archivers, search tools, disk helpers and small system programs that make a computer easier to use, each linked to its official page.",
    iconKey: "wrench",
    sortOrder: 6,
  },
  {
    slug: "design",
    name: "Design",
    description: "Photo editors, vector and 3D tools and online design apps for creating images and illustrations, each linked to its official publisher.",
    iconKey: "palette",
    sortOrder: 7,
  },
  {
    slug: "cloud",
    name: "Cloud",
    description: "Cloud storage and file sync apps for backing up, sharing and reaching your files from several devices, linked to official download pages.",
    iconKey: "cloud",
    sortOrder: 8,
  },
  {
    slug: "education",
    name: "Education",
    description: "Learning, study and reference apps, from flashcards to language, math and science tools, each linked to its official site or store listing.",
    iconKey: "book",
    sortOrder: 9,
  },
  {
    slug: "gaming",
    name: "Gaming",
    description: "Game launchers and stores for buying, installing and managing PC games, each linked to the publisher's official download page.",
    iconKey: "gamepad",
    sortOrder: 10,
  },
];

type AppInput = Omit<AppDefinition, "sortOrder" | "requirements" | "alternatives" | "featured"> &
  Partial<Pick<AppDefinition, "requirements" | "alternatives" | "featured">>;

const paragraphs = (first: string, second: string) => `${first}\n\n${second}`;

const apps: AppInput[] = [
  // ---------- Browsers ----------
  {
    slug: "firefox",
    name: "Mozilla Firefox",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Mozilla",
    shortDescription: "Independent web browser with tracking protection and a large extension catalog.",
    description: paragraphs(
      "Firefox is a web browser made by the non-profit Mozilla. It runs on its own engine rather than the Chromium code used by many other browsers, which keeps the browser landscape less uniform.",
      "It blocks many trackers by default, lets you add features through extensions and can sync bookmarks, history and passwords between your computer and phone with a free account.",
    ),
    features: [
      "Enhanced Tracking Protection turned on by default",
      "Extensions from the Firefox add-on catalog",
      "Optional account sync for bookmarks, history and passwords",
      "Reader view and picture-in-picture video",
      "Versions for desktop, Android and iPhone or iPad",
    ],
    license: "Free and open source (MPL-2.0)",
    officialWebsite: "https://www.firefox.com/",
    officialDownloadUrl: "https://www.firefox.com/en-US/browsers/",
    alternatives: ["brave", "google-chrome", "vivaldi", "tor-browser"],
    tags: ["browser", "privacy", "web", "extensions"],
    metaDescription:
      "Download Mozilla Firefox from the official site: an independent, open-source browser with tracking protection, extensions and sync for desktop and mobile.",
    featured: true,
  },
  {
    slug: "google-chrome",
    name: "Google Chrome",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Google",
    shortDescription: "Popular web browser from Google that syncs with your Google account.",
    description: paragraphs(
      "Chrome is Google's web browser, built on the open-source Chromium project. Because many sites are tested against Chromium first, pages tend to behave the same way in Chrome as the developer intended.",
      "Signing in with a Google account syncs bookmarks, history, passwords and open tabs across devices, and extensions are installed from the Chrome Web Store.",
    ),
    features: [
      "Sync of bookmarks, passwords and tabs through a Google account",
      "Extensions from the Chrome Web Store",
      "Built-in page translation",
      "Tab groups and profiles for separating work and personal browsing",
      "Versions for Windows, macOS, Linux, Android and iOS",
    ],
    license: "Free",
    officialWebsite: "https://www.google.com/chrome/",
    officialDownloadUrl: "https://www.google.com/chrome/",
    alternatives: ["firefox", "microsoft-edge", "brave", "opera"],
    tags: ["browser", "google", "web", "extensions"],
    metaDescription:
      "Get Google Chrome from the official Google page. See what the browser offers, which devices it supports, how to download it safely and alternatives.",
  },
  {
    slug: "brave",
    name: "Brave Browser",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Brave Software",
    shortDescription: "Chromium-based browser that blocks ads and trackers without extra add-ons.",
    description: paragraphs(
      "Brave is built on the Chromium engine and includes a content blocker called Shields, so ads and trackers are filtered out before you install anything else.",
      "Because it shares the Chromium base, most Chrome extensions work in Brave. It also offers a private window that routes traffic through Tor, plus optional features such as a VPN and rewards that are separate from the browser itself.",
    ),
    features: [
      "Built-in blocking of ads and trackers (Brave Shields)",
      "Compatible with most Chrome Web Store extensions",
      "Private window with Tor on desktop",
      "Sync between devices without a separate account service",
      "Optional extras such as a VPN and rewards, sold or enabled separately",
    ],
    license: "Free and open source (MPL-2.0)",
    officialWebsite: "https://brave.com/",
    officialDownloadUrl: "https://brave.com/download/",
    alternatives: ["firefox", "vivaldi", "duckduckgo-browser", "google-chrome"],
    tags: ["browser", "privacy", "ad-blocker", "chromium"],
    metaDescription:
      "Download Brave Browser from the official site. A Chromium-based browser with built-in ad and tracker blocking, plus supported platforms and alternatives.",
  },
  {
    slug: "opera",
    name: "Opera",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Opera",
    shortDescription: "Chromium-based browser with a sidebar, built-in ad blocker and browser VPN.",
    description: paragraphs(
      "Opera is a long-running browser that now uses the Chromium engine. It adds its own interface features, such as a sidebar that keeps messaging apps and bookmarks within reach.",
      "Extras like an ad blocker and a browser VPN are built in, so they can be switched on from the settings without installing separate add-ons.",
    ),
    features: [
      "Sidebar with quick access to messengers and bookmarks",
      "Built-in ad blocker",
      "Built-in browser VPN that you can turn on in settings",
      "Compatible with Chrome extensions through an add-on",
      "Desktop and mobile versions",
    ],
    license: "Free",
    officialWebsite: "https://www.opera.com/",
    officialDownloadUrl: "https://www.opera.com/download",
    alternatives: ["vivaldi", "google-chrome", "firefox", "brave"],
    tags: ["browser", "vpn", "ad-blocker", "chromium"],
    metaDescription:
      "Download Opera from the official site: a Chromium-based browser with a sidebar, ad blocker and browser VPN. See platforms, safe steps and alternatives.",
  },
  {
    slug: "microsoft-edge",
    name: "Microsoft Edge",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Microsoft",
    shortDescription: "Microsoft's Chromium-based browser, included with Windows and available elsewhere.",
    description: paragraphs(
      "Edge is the browser Microsoft ships with Windows. It is built on Chromium, so it can use extensions designed for Chrome as well as those from the Microsoft Edge Add-ons site.",
      "Signing in with a Microsoft account syncs favorites, passwords and settings. Features such as Collections and vertical tabs help organize research that spans many pages.",
    ),
    features: [
      "Sync of favorites, passwords and settings with a Microsoft account",
      "Collections for saving and grouping pages",
      "Vertical tabs option",
      "Read aloud for web pages",
      "Versions for Windows, macOS, Linux, Android and iOS",
    ],
    license: "Free",
    officialWebsite: "https://www.microsoft.com/edge",
    officialDownloadUrl: "https://www.microsoft.com/edge/download",
    alternatives: ["google-chrome", "firefox", "brave", "opera"],
    tags: ["browser", "microsoft", "web", "chromium"],
    metaDescription:
      "Download Microsoft Edge from Microsoft's official page. A Chromium-based browser for Windows, Mac, Linux and mobile, with sync, Collections and vertical tabs.",
  },
  {
    slug: "vivaldi",
    name: "Vivaldi",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Vivaldi Technologies",
    shortDescription: "Highly customizable Chromium-based browser with built-in mail, notes and tab tools.",
    description: paragraphs(
      "Vivaldi is a Chromium-based browser that puts customization first. You can change where toolbars sit, how tabs are stacked and what appears in the side panel.",
      "It bundles tools that other browsers leave to extensions, including notes, a feed reader, a calendar and a mail client, and it still supports Chrome extensions.",
    ),
    features: [
      "Tab stacking and tiling to manage many open pages",
      "Side panel with notes, bookmarks and web panels",
      "Built-in mail, calendar and feed reader",
      "Built-in ad and tracker blocker",
      "Wide control over interface layout and themes",
    ],
    license: "Free",
    officialWebsite: "https://vivaldi.com/",
    officialDownloadUrl: "https://vivaldi.com/download/",
    alternatives: ["opera", "firefox", "brave", "google-chrome"],
    tags: ["browser", "customization", "chromium", "productivity"],
    metaDescription:
      "Download Vivaldi from the official site: a customizable Chromium-based browser with tab stacking, notes, mail and a built-in blocker for desktop and mobile.",
  },
  {
    slug: "tor-browser",
    name: "Tor Browser",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "linux", "android"],
    developer: "The Tor Project",
    shortDescription: "Privacy-focused browser that sends traffic through the Tor network.",
    description: paragraphs(
      "Tor Browser is based on Firefox and routes your traffic through the Tor network, so the sites you visit see a relay address instead of your own. It can also open .onion addresses.",
      "That extra routing makes pages load more slowly, and some websites restrict visitors who use Tor. It is designed for privacy and censorship circumvention rather than everyday speed.",
    ),
    features: [
      "Routes traffic through the Tor network",
      "Access to .onion sites",
      "Security levels that limit risky web features",
      "Keeps each site isolated to reduce cross-site tracking",
      "Versions for Windows, macOS, Linux and Android",
    ],
    license: "Free and open source (BSD and MPL licenses)",
    officialWebsite: "https://www.torproject.org/",
    officialDownloadUrl: "https://www.torproject.org/download/",
    alternatives: ["brave", "firefox", "duckduckgo-browser"],
    tags: ["browser", "privacy", "anonymity", "tor"],
    metaDescription:
      "Download Tor Browser only from the Tor Project's official site. Learn what it does, its speed trade-offs, supported platforms and safer ways to install it.",
  },
  {
    slug: "duckduckgo-browser",
    name: "DuckDuckGo Browser",
    categorySlug: "browsers",
    platforms: ["windows", "mac", "android", "ios"],
    developer: "DuckDuckGo",
    shortDescription: "Simple privacy-minded browser with tracker blocking and a one-tap data clearing button.",
    description: paragraphs(
      "The DuckDuckGo browser is built around a short list of privacy features that are on by default: tracker blocking, private search with DuckDuckGo and a button that clears tabs and browsing data.",
      "It aims to stay simple rather than configurable, which suits people who want fewer settings to manage. Desktop and mobile versions are available.",
    ),
    features: [
      "Blocks many third-party trackers by default",
      "Private search through DuckDuckGo",
      "Fire button that clears tabs and data at once",
      "Automatic handling of cookie pop-ups on many sites",
      "Versions for Windows, macOS, Android and iOS",
    ],
    license: "Free",
    officialWebsite: "https://duckduckgo.com/",
    officialDownloadUrl: "https://duckduckgo.com/app",
    alternatives: ["brave", "firefox", "tor-browser"],
    tags: ["browser", "privacy", "search", "tracker-blocking"],
    metaDescription:
      "Get the DuckDuckGo browser from the official DuckDuckGo page: tracker blocking, private search and a data-clearing button on Windows, Mac, Android and iOS.",
  },

  // ---------- Media ----------
  {
    slug: "vlc-media-player",
    name: "VLC Media Player",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "VideoLAN",
    shortDescription: "Free player that opens most video and audio files without extra codec packs.",
    description: paragraphs(
      "VLC plays a very wide range of video and audio formats, DVDs and network streams. Because the codecs are built in, you rarely need to install anything extra to open a file.",
      "It is developed by the VideoLAN non-profit and carries no ads. Besides playback it can convert files, stream media over a network and fine-tune subtitles and audio tracks.",
    ),
    features: [
      "Plays most common video and audio formats",
      "Codecs are built in, so no codec pack is needed",
      "Subtitle and audio-track selection and timing",
      "Network streaming and file conversion",
      "Versions for desktop and mobile systems",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://www.videolan.org/",
    officialDownloadUrl: "https://www.videolan.org/vlc/",
    alternatives: ["mpc-hc", "iina", "kodi", "plex"],
    tags: ["video", "player", "audio", "codecs"],
    metaDescription:
      "Download VLC Media Player from VideoLAN's official site. An open-source player for most video and audio formats on Windows, Mac, Linux, Android and iOS.",
    featured: true,
  },
  {
    slug: "spotify",
    name: "Spotify",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux", "android", "ios", "web"],
    developer: "Spotify",
    shortDescription: "Music and podcast streaming service with a free ad-supported tier.",
    description: paragraphs(
      "Spotify is a streaming service for music and podcasts. You search a catalog, build playlists and get recommendations based on what you play, from an app or in the browser.",
      "There is a free tier with ads and paid Premium plans that add features such as offline listening. Spotify Connect lets you start playback on one device and continue on another.",
    ),
    features: [
      "Streaming of music and podcasts",
      "Playlists, including ones you share with others",
      "Spotify Connect to play on other devices",
      "Offline listening with paid plans",
      "Desktop apps, mobile apps and a web player",
    ],
    license: "Free tier with paid plans",
    officialWebsite: "https://www.spotify.com/",
    officialDownloadUrl: "https://www.spotify.com/download/",
    tags: ["music", "streaming", "podcasts", "playlists"],
    metaDescription:
      "Download the Spotify app from the official Spotify page. Stream music and podcasts on desktop, phone or web, with a free ad-supported tier and paid plans.",
  },
  {
    slug: "audacity",
    name: "Audacity",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux"],
    developer: "Audacity Team",
    shortDescription: "Multi-track audio editor and recorder for podcasts, voice and music.",
    description: paragraphs(
      "Audacity records audio from a microphone or other input and lets you edit it on several tracks. Cutting, trimming and mixing are done directly on the waveform.",
      "Built-in effects handle common clean-up such as noise reduction and normalization, and plug-ins add more. It exports to widely used formats such as WAV, MP3 and FLAC.",
    ),
    features: [
      "Multi-track recording and editing",
      "Noise reduction, normalization and other effects",
      "Support for plug-ins that add effects",
      "Export to common formats such as WAV, MP3 and FLAC",
      "Runs on Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://www.audacityteam.org/",
    officialDownloadUrl: "https://www.audacityteam.org/download/",
    tags: ["audio", "recording", "podcast", "editor"],
    metaDescription:
      "Download Audacity from the official Audacity Team site. A free, open-source multi-track audio editor and recorder for Windows, macOS and Linux.",
  },
  {
    slug: "handbrake",
    name: "HandBrake",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux"],
    developer: "The HandBrake Team",
    shortDescription: "Open-source video transcoder with presets for phones, tablets and the web.",
    description: paragraphs(
      "HandBrake converts video from most common formats into modern ones such as MP4, MKV or WebM. Device presets pick sensible settings, so you do not need to know encoder options to get a usable file.",
      "A batch queue lets you line up several files, and advanced controls are there when you want to tune quality, size, subtitles or chapters yourself.",
    ),
    features: [
      "Converts video to MP4, MKV and WebM",
      "Presets for common devices and uses",
      "Batch queue for many files",
      "Subtitle, audio-track and chapter handling",
      "Several encoders, including H.264 and H.265",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://handbrake.fr/",
    officialDownloadUrl: "https://handbrake.fr/downloads.php",
    tags: ["video", "converter", "encoder", "transcoding"],
    metaDescription:
      "Download HandBrake from the official site. A free, open-source video converter for Windows, Mac and Linux, with presets, a batch queue and subtitle support.",
  },
  {
    slug: "obs-studio",
    name: "OBS Studio",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux"],
    developer: "OBS Project",
    shortDescription: "Open-source software for recording your screen and live streaming.",
    description: paragraphs(
      "OBS Studio captures your screen, windows, webcam and audio sources and combines them into scenes. You can record the result to a file or stream it live to a service of your choice.",
      "Scenes switch with transitions, an audio mixer controls each source, and plug-ins or scripts extend what it can do. It is widely used for streaming, tutorials and recorded lessons.",
    ),
    features: [
      "Screen, window, webcam and audio capture",
      "Scenes and transitions you can switch while recording",
      "Streaming to services through standard protocols",
      "Per-source audio mixer with filters",
      "Plug-in and script support",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://obsproject.com/",
    officialDownloadUrl: "https://obsproject.com/download",
    tags: ["recording", "streaming", "screen-capture", "video"],
    metaDescription:
      "Download OBS Studio from the official OBS Project site. Free, open-source screen recording and live streaming for Windows, macOS and Linux.",
    featured: true,
  },
  {
    slug: "kodi",
    name: "Kodi",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "XBMC Foundation",
    shortDescription: "Open-source media center for organizing and playing your own library.",
    description: paragraphs(
      "Kodi is a media center that gathers your local and network video, music and photos in one interface designed for a TV-sized screen, with a remote or controller as well as a mouse.",
      "Add-ons and skins extend it, and it can work with live-TV tuners through separate back ends. Install add-ons only from sources you trust, since they are community-made.",
    ),
    features: [
      "Library for videos, music and photos with artwork",
      "Interface built for a TV and remote control",
      "Add-ons and skins from the community",
      "Support for live TV through compatible back ends",
      "Versions for desktop and mobile systems",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://kodi.tv/",
    officialDownloadUrl: "https://kodi.tv/download/",
    alternatives: ["plex", "vlc-media-player"],
    tags: ["media-center", "video", "music", "add-ons"],
    metaDescription:
      "Download Kodi from the official kodi.tv site. An open-source media center for your own library, with add-ons, skins and versions for desktop and mobile.",
  },
  {
    slug: "shotcut",
    name: "Shotcut",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux"],
    developer: "Meltytech",
    shortDescription: "Open-source video editor with a timeline, filters and wide format support.",
    description: paragraphs(
      "Shotcut is a video editor that works with a very wide range of formats thanks to FFmpeg, so you can mix clips from different cameras without converting them first.",
      "It offers a multi-track timeline, filters, transitions and color tools. The interface is made of panels you can arrange, which suits both quick cuts and longer projects.",
    ),
    features: [
      "Multi-track timeline editing",
      "Wide format support through FFmpeg",
      "Video and audio filters",
      "Transitions and color correction tools",
      "Runs on Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://shotcut.org/",
    officialDownloadUrl: "https://shotcut.org/download/",
    alternatives: ["davinci-resolve"],
    tags: ["video", "editor", "timeline", "ffmpeg"],
    metaDescription:
      "Download Shotcut from the official site. A free, open-source video editor for Windows, Mac and Linux with a multi-track timeline, filters and many formats.",
  },
  {
    slug: "davinci-resolve",
    name: "DaVinci Resolve",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux"],
    developer: "Blackmagic Design",
    shortDescription: "Video editing, color grading, effects and audio post-production in one application.",
    description: paragraphs(
      "DaVinci Resolve combines video editing, color correction, visual effects and audio mixing in a single program, with a separate workspace for each stage of post-production.",
      "A free version is available, and a paid Studio edition adds more features. The program is large and runs more smoothly on a computer with a capable graphics card.",
    ),
    features: [
      "Editing, color, effects and audio workspaces in one app",
      "Node-based color grading tools",
      "Fusion for visual effects and motion graphics",
      "Fairlight for audio mixing",
      "Free version plus a paid Studio edition",
    ],
    license: "Free version with a paid Studio edition",
    officialWebsite: "https://www.blackmagicdesign.com/products/davinciresolve",
    officialDownloadUrl: "https://www.blackmagicdesign.com/products/davinciresolve",
    alternatives: ["shotcut"],
    tags: ["video", "editor", "color-grading", "effects"],
    metaDescription:
      "Find DaVinci Resolve on Blackmagic Design's official page. Video editing, color grading, effects and audio in one app, with a free version and paid Studio.",
  },
  {
    slug: "mpc-hc",
    name: "MPC-HC",
    categorySlug: "media",
    platforms: ["windows"],
    developer: "clsid2 (community fork)",
    shortDescription: "Lightweight Windows media player kept alive by a community-maintained fork.",
    description: paragraphs(
      "MPC-HC is a compact media player for Windows with a classic interface. The original project was discontinued, and the build linked here is the community fork that continues development.",
      "It plays common video and audio formats using built-in decoders, supports subtitles and gives fine control over playback, while using little memory.",
    ),
    features: [
      "Lightweight player with a classic interface",
      "Built-in decoders for common formats",
      "Subtitle support and timing controls",
      "Low memory use",
      "Windows only",
    ],
    license: "Free and open source (GNU GPL)",
    officialWebsite: "https://github.com/clsid2/mpc-hc",
    officialDownloadUrl: "https://github.com/clsid2/mpc-hc/releases",
    alternatives: ["vlc-media-player"],
    tags: ["video", "player", "windows", "lightweight"],
    metaDescription:
      "Get MPC-HC from the clsid2 GitHub project, the community-maintained fork of the classic lightweight Windows media player, with its release downloads.",
  },
  {
    slug: "foobar2000",
    name: "foobar2000",
    categorySlug: "media",
    platforms: ["windows", "mac", "android", "ios"],
    developer: "Peter Pawlowski",
    shortDescription: "Highly customizable audio player known for its flexible layouts and components.",
    description: paragraphs(
      "foobar2000 is an audio player for people who keep their own music collection. The interface is built from panels you arrange yourself, and the default look is plain on purpose.",
      "It supports many audio formats and offers tools such as a converter and ReplayGain volume matching. Components written by the community add more functions.",
    ),
    features: [
      "Customizable interface layout",
      "Support for many audio formats",
      "Built-in converter and volume matching (ReplayGain)",
      "Components that extend the player",
      "Builds for Windows, macOS, Android and iOS",
    ],
    license: "Free",
    officialWebsite: "https://www.foobar2000.org/",
    officialDownloadUrl: "https://www.foobar2000.org/download",
    alternatives: ["vlc-media-player"],
    tags: ["music", "audio", "player", "customizable"],
    metaDescription:
      "Download foobar2000 from the official site. A customizable audio player for your music library with many formats, a converter and community components.",
  },
  {
    slug: "iina",
    name: "IINA",
    categorySlug: "media",
    platforms: ["mac"],
    developer: "IINA Team",
    shortDescription: "Modern open-source video player for macOS built on the mpv engine.",
    description: paragraphs(
      "IINA is a video player made specifically for the Mac. It uses the mpv playback engine under a native interface, so it looks like a macOS app while handling many formats.",
      "It supports picture-in-picture, dark mode, trackpad gestures and online subtitle search, and it has a plug-in system for extra features.",
    ),
    features: [
      "Native macOS interface on the mpv engine",
      "Picture-in-picture and dark mode",
      "Trackpad and keyboard gestures",
      "Online subtitle search",
      "Plug-in system",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://iina.io/",
    officialDownloadUrl: "https://iina.io/",
    alternatives: ["vlc-media-player"],
    tags: ["video", "player", "macos", "mpv"],
    metaDescription:
      "Download IINA from its official site. A modern, open-source video player for macOS built on mpv, with picture-in-picture, gestures and plug-ins.",
  },
  {
    slug: "plex",
    name: "Plex",
    categorySlug: "media",
    platforms: ["windows", "mac", "linux", "android", "ios", "web"],
    developer: "Plex",
    shortDescription: "Media server and apps for organizing and streaming your own library to your devices.",
    description: paragraphs(
      "Plex has two parts: a server that runs on a computer or network storage and organizes your video, music and photos, and apps that play that library on phones, TVs and in a browser.",
      "Basic use is free, and an optional paid plan adds extra features. The download page linked here is for the Plex Media Server software.",
    ),
    features: [
      "Server that organizes personal video, music and photos",
      "Apps for phones, tablets, TVs and the web",
      "Streaming from your library to other devices",
      "Free use with optional paid plans for extra features",
      "Server software for Windows, macOS and Linux",
    ],
    license: "Free with optional paid plans",
    officialWebsite: "https://www.plex.tv/",
    officialDownloadUrl: "https://www.plex.tv/media-server-downloads/",
    alternatives: ["kodi"],
    tags: ["media-server", "streaming", "video", "library"],
    metaDescription:
      "Download Plex Media Server from Plex's official page. Organize your own video, music and photos and stream them to your phone, TV or browser.",
  },

  // ---------- Development ----------
  {
    slug: "visual-studio-code",
    name: "Visual Studio Code",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux", "web"],
    developer: "Microsoft",
    shortDescription: "Lightweight code editor with debugging, Git support and a large extension catalog.",
    description: paragraphs(
      "Visual Studio Code is a code editor that sits between a plain text editor and a full IDE. It offers syntax highlighting, code completion, an integrated terminal and a debugger for many languages.",
      "Extensions add support for more languages, frameworks and tools. A browser-based version at vscode.dev lets you edit without installing anything.",
    ),
    features: [
      "Code completion and syntax highlighting for many languages",
      "Built-in debugger and integrated terminal",
      "Git integration in the editor",
      "Extensions from a built-in marketplace",
      "Desktop apps and a browser version",
    ],
    license: "Free",
    officialWebsite: "https://code.visualstudio.com/",
    officialDownloadUrl: "https://code.visualstudio.com/download",
    alternatives: ["sublime-text", "notepad-plus-plus"],
    tags: ["editor", "code", "ide", "extensions"],
    metaDescription:
      "Download Visual Studio Code from Microsoft's official site. A code editor with debugging, Git integration and extensions for Windows, macOS, Linux and web.",
    featured: true,
  },
  {
    slug: "git",
    name: "Git",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Git project",
    shortDescription: "Distributed version control system used to track changes in source code.",
    description: paragraphs(
      "Git records the history of a project so you can see what changed, go back to an earlier state and work on separate lines of development called branches without overwriting each other.",
      "It works from the command line and includes simple graphical tools, and many editors and services build on it. Every copy of a repository holds the full history.",
    ),
    features: [
      "Full local history of every change",
      "Branching and merging",
      "Works offline, with every copy holding the whole history",
      "Command line plus basic graphical tools",
      "Packages for Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://git-scm.com/",
    officialDownloadUrl: "https://git-scm.com/downloads",
    tags: ["version-control", "git", "source-code", "command-line"],
    metaDescription:
      "Download Git from the official git-scm.com site. The distributed version control system for tracking source code, with installers for Windows, Mac and Linux.",
  },
  {
    slug: "github-desktop",
    name: "GitHub Desktop",
    categorySlug: "development",
    platforms: ["windows", "mac"],
    developer: "GitHub",
    shortDescription: "Graphical app for working with Git repositories and GitHub without the command line.",
    description: paragraphs(
      "GitHub Desktop gives Git a point-and-click interface. You can clone repositories, review changes, write commits, switch branches and open pull requests without typing commands.",
      "It is aimed at people who want a simpler way to use Git with GitHub. The source code is open, and it is available for Windows and macOS.",
    ),
    features: [
      "Clone, commit and push from a graphical interface",
      "Side-by-side view of changes before committing",
      "Branch switching and pull request shortcuts",
      "Works with GitHub and other Git hosts",
      "Windows and macOS only",
    ],
    license: "Free and open source (MIT)",
    officialWebsite: "https://desktop.github.com/",
    officialDownloadUrl: "https://desktop.github.com/download/",
    tags: ["git", "github", "version-control", "gui"],
    metaDescription:
      "Download GitHub Desktop from the official GitHub page. A graphical Git client for cloning, committing and branching on Windows and macOS.",
  },
  {
    slug: "notepad-plus-plus",
    name: "Notepad++",
    categorySlug: "development",
    platforms: ["windows"],
    developer: "Don Ho",
    shortDescription: "Lightweight Windows text and source-code editor with tabs and plug-ins.",
    description: paragraphs(
      "Notepad++ is a free text editor for Windows that goes well beyond the built-in Notepad. It highlights syntax for many programming languages and keeps many files open in tabs.",
      "Search and replace supports regular expressions, macros automate repeated edits and a plug-in manager adds more tools. It stays small and quick to open.",
    ),
    features: [
      "Syntax highlighting and code folding",
      "Tabbed editing of many files",
      "Search and replace with regular expressions",
      "Macro recording",
      "Plug-in manager",
    ],
    license: "Free and open source (GNU GPL)",
    officialWebsite: "https://notepad-plus-plus.org/",
    officialDownloadUrl: "https://notepad-plus-plus.org/downloads/",
    alternatives: ["visual-studio-code", "sublime-text"],
    tags: ["editor", "text", "code", "windows"],
    metaDescription:
      "Download Notepad++ from the official site. A lightweight, open-source text and code editor for Windows with tabs, syntax highlighting and plug-ins.",
  },
  {
    slug: "docker-desktop",
    name: "Docker Desktop",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Docker",
    shortDescription: "Run and manage containers on your own computer with a graphical dashboard.",
    description: paragraphs(
      "Docker Desktop packages the Docker Engine, command-line tools and Docker Compose with a dashboard for managing containers and images on your computer.",
      "Containers let you run a service, such as a database, with the same setup everywhere. Docker's subscription terms decide which organizations can use Desktop for free, so check them before using it at work.",
    ),
    features: [
      "Docker Engine, CLI and Compose in one installer",
      "Dashboard for containers, images and volumes",
      "Optional local Kubernetes",
      "Runs on Windows, macOS and Linux",
      "Paid plans for larger companies",
    ],
    license: "Free for personal use and small teams; paid plans for larger companies",
    officialWebsite: "https://www.docker.com/",
    officialDownloadUrl: "https://www.docker.com/products/docker-desktop/",
    tags: ["containers", "docker", "devops", "development"],
    metaDescription:
      "Download Docker Desktop from Docker's official page. Run and manage containers on Windows, Mac or Linux, and check the subscription terms for your use.",
  },
  {
    slug: "postman",
    name: "Postman",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux", "web"],
    developer: "Postman",
    shortDescription: "API client for sending requests, organizing collections and testing endpoints.",
    description: paragraphs(
      "Postman is a tool for working with web APIs. You build and send requests, inspect the responses and save them in collections so a team can reuse the same calls.",
      "It adds environments for switching between servers, automated tests and mock servers. The desktop apps and the web version share the same workspace features, and some team features need a paid plan.",
    ),
    features: [
      "Build and send HTTP requests and read responses",
      "Collections and environments",
      "Automated tests for API responses",
      "Mock servers for trying an API early",
      "Desktop apps and a web version",
    ],
    license: "Free plan with paid tiers",
    officialWebsite: "https://www.postman.com/",
    officialDownloadUrl: "https://www.postman.com/downloads/",
    tags: ["api", "testing", "http", "development"],
    metaDescription:
      "Download Postman from the official Postman page. An API client for building requests, saving collections and testing endpoints on desktop or in the browser.",
  },
  {
    slug: "nodejs",
    name: "Node.js",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "OpenJS Foundation",
    shortDescription: "JavaScript runtime for running servers, tools and scripts outside the browser.",
    description: paragraphs(
      "Node.js runs JavaScript on your computer or a server instead of inside a web page. It is used for web servers, command-line tools, build systems and scripts.",
      "The installer includes npm, the package manager. Releases come in a long-term support line, suited to production, and a current line with newer features, so check which one a project expects.",
    ),
    features: [
      "Runs JavaScript outside the browser",
      "npm package manager included",
      "Long-term support and current release lines",
      "Built-in modules for files, networking and more",
      "Installers for Windows, macOS and Linux",
    ],
    license: "Free and open source (MIT)",
    officialWebsite: "https://nodejs.org/",
    officialDownloadUrl: "https://nodejs.org/en/download",
    tags: ["javascript", "runtime", "npm", "development"],
    metaDescription:
      "Download Node.js from the official nodejs.org site. The JavaScript runtime with npm included, in LTS and current releases for Windows, Mac and Linux.",
  },
  {
    slug: "python",
    name: "Python",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Python Software Foundation",
    shortDescription: "General-purpose programming language with a readable syntax and a large library.",
    description: paragraphs(
      "Python is a programming language known for code that is easy to read. It is used for scripting, web back ends, data analysis, automation and teaching programming.",
      "The download from python.org includes the interpreter, the standard library, the pip package manager and the IDLE editor. Many Linux systems already include Python, and macOS and Windows users can install it from the official page.",
    ),
    features: [
      "Interpreter and large standard library",
      "pip package manager included",
      "IDLE editor for quick scripts",
      "Used for scripting, web, data and automation",
      "Installers for Windows and macOS, source for Linux",
    ],
    license: "Free and open source (Python Software Foundation License)",
    officialWebsite: "https://www.python.org/",
    officialDownloadUrl: "https://www.python.org/downloads/",
    tags: ["python", "programming", "interpreter", "development"],
    metaDescription:
      "Download Python from python.org, the official site. Get the interpreter with pip and IDLE for Windows, macOS or Linux, plus tips for installing it safely.",
  },
  {
    slug: "sublime-text",
    name: "Sublime Text",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Sublime HQ",
    shortDescription: "Fast, minimal code editor with powerful multi-cursor editing and navigation.",
    description: paragraphs(
      "Sublime Text is a code and text editor designed to start quickly and stay responsive with large files. It is known for multiple selections, which let you edit many places at once.",
      "Goto Anything jumps to files, symbols and lines from one prompt, and packages written with its Python API add languages and tools. It can be evaluated without paying, but continued use requires a license.",
    ),
    features: [
      "Multiple selections for editing many places at once",
      "Goto Anything navigation",
      "Packages built with a Python API",
      "Split editing and distraction-free mode",
      "Windows, macOS and Linux",
    ],
    license: "Free to evaluate; a paid license is required for continued use",
    officialWebsite: "https://www.sublimetext.com/",
    officialDownloadUrl: "https://www.sublimetext.com/download",
    alternatives: ["visual-studio-code", "notepad-plus-plus"],
    tags: ["editor", "code", "text", "development"],
    metaDescription:
      "Download Sublime Text from Sublime HQ's official page. A fast, minimal code editor for Windows, Mac and Linux with multi-cursor editing and packages.",
  },
  {
    slug: "android-studio",
    name: "Android Studio",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Google",
    shortDescription: "Google's official development environment for building Android apps.",
    description: paragraphs(
      "Android Studio is the integrated development environment Google provides for Android apps. It is built on IntelliJ IDEA and bundles an editor, build tools and an emulator.",
      "It uses Gradle for builds, offers a layout editor and profilers, and includes Android SDK management. It is a large download, so plan for disk space and a capable computer.",
    ),
    features: [
      "Code editor based on IntelliJ IDEA",
      "Android emulator for testing apps",
      "Gradle-based build system",
      "Layout editor and performance profilers",
      "SDK manager for Android platform versions",
    ],
    license: "Free",
    officialWebsite: "https://developer.android.com/studio",
    officialDownloadUrl: "https://developer.android.com/studio",
    tags: ["android", "ide", "mobile", "development"],
    metaDescription:
      "Download Android Studio from developer.android.com, Google's official IDE for building Android apps, with an emulator, build tools and SDK manager.",
  },
  {
    slug: "filezilla",
    name: "FileZilla",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "Tim Kosse",
    shortDescription: "Cross-platform FTP, FTPS and SFTP client for transferring files to servers.",
    description: paragraphs(
      "FileZilla Client moves files between your computer and a server using FTP, FTPS or SFTP. A two-pane view shows local and remote folders side by side, and you drag files between them.",
      "A site manager stores connections, and a queue handles transfers so large uploads can be paused or resumed. Download it from the official project page, since the installer can differ elsewhere.",
    ),
    features: [
      "FTP, FTPS and SFTP support",
      "Local and remote folders side by side",
      "Site manager for saved connections",
      "Transfer queue with resume support",
      "Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-2.0)",
    officialWebsite: "https://filezilla-project.org/",
    officialDownloadUrl: "https://filezilla-project.org/download.php?type=client",
    alternatives: ["winscp"],
    tags: ["ftp", "sftp", "file-transfer", "development"],
    metaDescription:
      "Download FileZilla Client from the official project page. A cross-platform FTP, FTPS and SFTP client with a site manager and transfer queue.",
  },
  {
    slug: "winscp",
    name: "WinSCP",
    categorySlug: "development",
    platforms: ["windows"],
    developer: "Martin Prikryl",
    shortDescription: "Windows client for SFTP, SCP and FTP with scripting and folder synchronization.",
    description: paragraphs(
      "WinSCP is a file-transfer client for Windows that supports SFTP, SCP and FTP. It can show local and remote folders side by side or in an Explorer-like view.",
      "It also includes a built-in text editor, folder synchronization and a command-line mode for scripting repeated transfers.",
    ),
    features: [
      "SFTP, SCP and FTP support",
      "Explorer-style and two-pane views",
      "Folder synchronization",
      "Scripting and command-line mode",
      "Windows only",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://winscp.net/",
    officialDownloadUrl: "https://winscp.net/eng/download.php",
    alternatives: ["filezilla"],
    tags: ["sftp", "scp", "file-transfer", "windows"],
    metaDescription:
      "Download WinSCP from the official winscp.net page. A Windows client for SFTP, SCP and FTP with synchronization, a built-in editor and scripting support.",
  },
  {
    slug: "putty",
    name: "PuTTY",
    categorySlug: "development",
    platforms: ["windows", "linux"],
    developer: "Simon Tatham",
    shortDescription: "Classic SSH and Telnet client for connecting to remote machines.",
    description: paragraphs(
      "PuTTY is a small terminal program for connecting to remote computers over SSH, Telnet and serial connections. It has long been a standard way to reach servers from Windows.",
      "The package also includes companion tools such as PuTTYgen for creating keys and PSCP for copying files. The official page is the safest source, because lookalike download sites exist.",
    ),
    features: [
      "SSH, Telnet and serial connections",
      "Saved sessions",
      "PuTTYgen for creating SSH keys",
      "Command-line tools for copying files",
      "Windows installer and a Unix source version",
    ],
    license: "Free and open source (MIT)",
    officialWebsite: "https://www.chiark.greenend.org.uk/~sgtatham/putty/",
    officialDownloadUrl: "https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html",
    tags: ["ssh", "terminal", "remote-access", "windows"],
    metaDescription:
      "Get PuTTY from its official page by Simon Tatham. An SSH, Telnet and serial client for Windows and Linux, with PuTTYgen for keys, plus safe download tips.",
  },
  {
    slug: "dbeaver",
    name: "DBeaver Community",
    categorySlug: "development",
    platforms: ["windows", "mac", "linux"],
    developer: "DBeaver",
    shortDescription: "Universal database client for browsing data and running SQL on many database types.",
    description: paragraphs(
      "DBeaver Community is a desktop client that connects to many kinds of databases through one interface. You can browse tables, edit data, run SQL and look at relationships in diagrams.",
      "It supports popular relational databases through drivers and includes an SQL editor with auto-complete. The Community edition is free, and paid editions add more features.",
    ),
    features: [
      "One client for many database types",
      "SQL editor with auto-complete",
      "Data viewer and editor",
      "Entity-relationship diagrams",
      "Windows, macOS and Linux",
    ],
    license: "Free and open source (Apache-2.0)",
    officialWebsite: "https://dbeaver.io/",
    officialDownloadUrl: "https://dbeaver.io/download/",
    tags: ["database", "sql", "client", "development"],
    metaDescription:
      "Download DBeaver Community from the official DBeaver site. A free, open-source database client with an SQL editor and diagrams for Windows, Mac and Linux.",
  },
  {
    slug: "windows-terminal",
    name: "Windows Terminal",
    categorySlug: "development",
    platforms: ["windows"],
    developer: "Microsoft",
    shortDescription: "Modern tabbed terminal for Command Prompt, PowerShell and WSL on Windows.",
    description: paragraphs(
      "Windows Terminal puts several command-line environments in one window with tabs and split panes. It hosts Command Prompt, PowerShell and Linux distributions run through WSL.",
      "You can customize profiles, color schemes and shortcuts. It is open source and is distributed through the Microsoft Store and on GitHub.",
    ),
    features: [
      "Tabs and split panes in one window",
      "Command Prompt, PowerShell and WSL profiles",
      "Customizable themes and key bindings",
      "GPU-accelerated text rendering",
      "Windows only",
    ],
    license: "Free and open source (MIT)",
    officialWebsite: "https://github.com/microsoft/terminal",
    officialDownloadUrl: "https://apps.microsoft.com/detail/9n0dx20hk701",
    tags: ["terminal", "powershell", "windows", "command-line"],
    metaDescription:
      "Get Windows Terminal from the Microsoft Store listing linked by Microsoft's GitHub project. Tabs and panes for Command Prompt, PowerShell and WSL.",
  },

  // ---------- Utilities, productivity, design, security and communication (apps that already existed) ----------
  {
    slug: "7zip",
    name: "7-Zip",
    categorySlug: "utilities",
    platforms: ["windows"],
    developer: "Igor Pavlov",
    shortDescription: "File archiver for Windows with its own high-compression 7z format.",
    description: paragraphs(
      "7-Zip creates and opens compressed archives. Besides its own 7z format, it works with ZIP, TAR and many others, and it can open RAR files and disk images.",
      "It integrates with the right-click menu in Windows Explorer and supports AES-256 encryption for 7z and ZIP archives. There is also a command-line version for scripts.",
    ),
    features: [
      "Creates 7z, ZIP and TAR archives",
      "Opens RAR, ISO and many other formats",
      "AES-256 encryption for 7z and ZIP",
      "Explorer right-click menu integration",
      "Command-line version",
    ],
    license: "Free and open source (mostly GNU LGPL, with an unRAR restriction)",
    officialWebsite: "https://www.7-zip.org/",
    officialDownloadUrl: "https://www.7-zip.org/download.html",
    tags: ["archive", "compression", "zip", "windows"],
    metaDescription:
      "Download 7-Zip from the official 7-zip.org page. A free file archiver for Windows that handles 7z, ZIP and many other formats with AES-256 encryption.",
    featured: true,
  },
  {
    slug: "libreoffice",
    name: "LibreOffice",
    categorySlug: "productivity",
    platforms: ["windows", "mac", "linux"],
    developer: "The Document Foundation",
    shortDescription: "Free office suite with a word processor, spreadsheet and presentation program.",
    description: paragraphs(
      "LibreOffice is an office suite made of Writer for documents, Calc for spreadsheets, Impress for presentations, Draw for diagrams, Base for databases and Math for formulas.",
      "It uses the open OpenDocument format by default and can open and save Microsoft Office files, so you can exchange documents with people who use other software. PDF export is built in.",
    ),
    features: [
      "Writer, Calc, Impress, Draw, Base and Math",
      "Opens and saves .docx, .xlsx and .pptx files",
      "OpenDocument format by default",
      "Built-in PDF export",
      "Extensions and templates",
    ],
    license: "Free and open source (MPL-2.0)",
    officialWebsite: "https://www.libreoffice.org/",
    officialDownloadUrl: "https://www.libreoffice.org/download/download-libreoffice/",
    tags: ["office", "documents", "spreadsheets", "presentations"],
    metaDescription:
      "Download LibreOffice from The Document Foundation's official site. A free, open-source office suite for Windows, Mac and Linux that opens Office files.",
    featured: true,
  },
  {
    slug: "gimp",
    name: "GIMP",
    categorySlug: "design",
    platforms: ["windows", "mac", "linux"],
    developer: "The GIMP Team",
    shortDescription: "Open-source image editor for photo retouching, compositing and graphics.",
    description: paragraphs(
      "GIMP is an image editor for retouching photos, combining images and creating graphics. It works with layers, masks and selections, and it handles a wide range of file formats.",
      "Filters, brushes and scripts extend it, and plug-ins add more tools. It has a learning curve, but it covers many tasks people otherwise use paid editors for.",
    ),
    features: [
      "Layers, masks and blend modes",
      "Retouching and color-correction tools",
      "Brushes, filters and scripting",
      "Plug-in support",
      "Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://www.gimp.org/",
    officialDownloadUrl: "https://www.gimp.org/downloads/",
    tags: ["photo-editing", "image", "graphics", "design"],
    metaDescription:
      "Download GIMP from the official gimp.org site. A free, open-source image editor for Windows, macOS and Linux with layers, masks, brushes and plug-ins.",
  },
  {
    slug: "blender",
    name: "Blender",
    categorySlug: "design",
    platforms: ["windows", "mac", "linux"],
    developer: "Blender Foundation",
    shortDescription: "Open-source 3D suite for modeling, animation, rendering and video editing.",
    description: paragraphs(
      "Blender is a 3D creation suite that covers modeling, sculpting, rigging, animation, simulation and rendering. It also includes a video editor and 2D drawing tools.",
      "Two render engines, Cycles and EEVEE, produce final images, and an add-on system extends the program. It is demanding, so a computer with a capable graphics card helps.",
    ),
    features: [
      "Modeling and sculpting",
      "Rigging and animation",
      "Cycles and EEVEE rendering",
      "Built-in video editor",
      "Add-on support",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://www.blender.org/",
    officialDownloadUrl: "https://www.blender.org/download/",
    tags: ["3d", "animation", "rendering", "modeling"],
    metaDescription:
      "Download Blender from the official blender.org page. A free, open-source 3D suite for modeling, animation, rendering and editing on Windows, Mac and Linux.",
  },
  {
    slug: "inkscape",
    name: "Inkscape",
    categorySlug: "design",
    platforms: ["windows", "mac", "linux"],
    developer: "Inkscape Project",
    shortDescription: "Vector graphics editor for logos, icons, diagrams and illustrations.",
    description: paragraphs(
      "Inkscape is a vector graphics editor that uses SVG as its native format. Vector shapes stay sharp at any size, which suits logos, icons, diagrams and print layouts.",
      "It offers shape and path tools, text on a path and filters, and it can import and export formats such as PDF and PNG. Extensions add extra functions.",
    ),
    features: [
      "Native SVG editing",
      "Bezier curves and path operations",
      "Text on a path",
      "Import and export of PDF and PNG",
      "Extensions",
    ],
    license: "Free and open source (GNU GPL)",
    officialWebsite: "https://inkscape.org/",
    officialDownloadUrl: "https://inkscape.org/release/",
    tags: ["vector", "svg", "illustration", "design"],
    metaDescription:
      "Download Inkscape from the official inkscape.org page. A free, open-source vector graphics editor built on SVG, for Windows, macOS and Linux.",
  },
  {
    slug: "keepassxc",
    name: "KeePassXC",
    categorySlug: "security",
    platforms: ["windows", "mac", "linux"],
    developer: "KeePassXC Team",
    shortDescription: "Offline password manager that stores an encrypted database on your own device.",
    description: paragraphs(
      "KeePassXC keeps your passwords in an encrypted file that stays on your computer or storage you choose, rather than on a company's server. A master password, and optionally a key file, unlocks it.",
      "It includes a password generator, one-time code support and browser integration through an extension. You are responsible for backing up the database file and for syncing it between devices.",
    ),
    features: [
      "Encrypted local password database",
      "Password generator",
      "Time-based one-time codes (TOTP)",
      "Browser integration and auto-type",
      "Windows, macOS and Linux",
    ],
    license: "Free and open source (GPL-2.0 or GPL-3.0)",
    officialWebsite: "https://keepassxc.org/",
    officialDownloadUrl: "https://keepassxc.org/download/",
    alternatives: ["bitwarden"],
    tags: ["passwords", "security", "offline", "encryption"],
    metaDescription:
      "Download KeePassXC from the official keepassxc.org site. An offline, open-source password manager with an encrypted local database and browser integration.",
  },
  {
    slug: "bitwarden",
    name: "Bitwarden",
    categorySlug: "security",
    platforms: ["windows", "mac", "linux", "android", "ios", "web"],
    developer: "Bitwarden",
    shortDescription: "Password manager that syncs an encrypted vault across browsers, desktop and mobile.",
    description: paragraphs(
      "Bitwarden stores logins in an encrypted vault that syncs between your devices through browser extensions, desktop apps, mobile apps and a web vault.",
      "A free plan covers personal use, and paid plans add features such as extra authentication options and sharing for teams. The apps are open source, and organizations can host their own server.",
    ),
    features: [
      "Encrypted vault synced across devices",
      "Browser extensions, desktop and mobile apps, and a web vault",
      "Password generator",
      "Secure sharing on paid plans",
      "Self-hosting option",
    ],
    license: "Free with paid plans; open-source apps (GPL-3.0)",
    officialWebsite: "https://bitwarden.com/",
    officialDownloadUrl: "https://bitwarden.com/download/",
    alternatives: ["keepassxc"],
    tags: ["passwords", "security", "sync", "vault"],
    metaDescription:
      "Download Bitwarden from the official bitwarden.com page. A password manager with an encrypted vault for browsers, desktop and mobile, with a free plan.",
  },
  {
    slug: "ublock-origin",
    name: "uBlock Origin",
    categorySlug: "security",
    platforms: ["web"],
    developer: "Raymond Hill",
    shortDescription: "Content-blocking browser extension that filters ads, trackers and malicious sites.",
    description: paragraphs(
      "uBlock Origin is a browser extension that blocks ads, trackers and known malicious domains using filter lists. It is made to stay light on memory and processing.",
      "You can enable more lists, pick page elements to hide and turn blocking off per site. The official site explains which browsers it supports and where to install it.",
    ),
    features: [
      "Blocks ads, trackers and malicious domains",
      "Filter lists you can enable or add",
      "Element picker to hide parts of a page",
      "Per-site on and off switches",
      "Light on memory and CPU",
    ],
    license: "Free and open source (GPL-3.0)",
    officialWebsite: "https://ublockorigin.com/",
    officialDownloadUrl: "https://ublockorigin.com/",
    tags: ["extension", "ad-blocker", "privacy", "browser"],
    metaDescription:
      "Find uBlock Origin on its official site. A free, open-source content blocker extension for ads, trackers and malicious domains, with filter lists.",
  },
  {
    slug: "thunderbird",
    name: "Thunderbird",
    categorySlug: "communication",
    platforms: ["windows", "mac", "linux", "android"],
    developer: "MZLA Technologies",
    shortDescription: "Free email client with calendar, contacts and support for many accounts.",
    description: paragraphs(
      "Thunderbird is an email client that brings several accounts into one app, with a calendar, contacts and task list alongside. It works with standard mail protocols, so it can connect to most providers.",
      "OpenPGP support for encrypted messages is built in, and add-ons extend it. A mobile version exists for Android.",
    ),
    features: [
      "Several email accounts in one inbox view",
      "Calendar, contacts and tasks",
      "Built-in OpenPGP support",
      "Add-ons",
      "Desktop apps and an Android app",
    ],
    license: "Free and open source (MPL-2.0)",
    officialWebsite: "https://www.thunderbird.net/",
    officialDownloadUrl: "https://www.thunderbird.net/download/",
    tags: ["email", "calendar", "contacts", "privacy"],
    metaDescription:
      "Download Thunderbird from the official thunderbird.net site. A free, open-source email client with calendar, contacts and OpenPGP for desktop and Android.",
  },
  {
    slug: "signal",
    name: "Signal",
    categorySlug: "communication",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    developer: "Signal Foundation",
    shortDescription: "Messaging and calling app with end-to-end encryption, run by a non-profit.",
    description: paragraphs(
      "Signal is a messaging app that encrypts messages and calls end to end, so only you and the people you talk with can read them. It is run by a non-profit and collects very little information.",
      "It supports group chats, voice and video calls and disappearing messages. The desktop app links to your phone, which needs to be set up first.",
    ),
    features: [
      "End-to-end encrypted messages and calls",
      "Group chats and video calls",
      "Disappearing messages",
      "Desktop apps linked to your phone",
      "Open-source apps",
    ],
    license: "Free and open source (AGPL-3.0)",
    officialWebsite: "https://signal.org/",
    officialDownloadUrl: "https://signal.org/download/",
    tags: ["messaging", "privacy", "encryption", "calls"],
    metaDescription:
      "Download Signal from the official signal.org page. An end-to-end encrypted messaging and calling app for Android, iPhone, Windows, Mac and Linux.",
  },
];

export const appDefinitions: AppDefinition[] = apps.map((app, index) => ({
  ...app,
  requirements: app.requirements ?? [],
  alternatives: app.alternatives ?? [],
  featured: app.featured ?? false,
  sortOrder: index,
}));

const appsBySlug = new Map(appDefinitions.map((app) => [app.slug, app]));

export function getAppDefinition(slug: string): AppDefinition | undefined {
  return appsBySlug.get(slug);
}
