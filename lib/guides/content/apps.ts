import type { GuideDefinition } from "../definitions";
import { appGuidesMore } from "./apps-more";

// Software guides. Original editorial content. Facts about each app (platforms, license or pricing text,
// developer) come from lib/apps/definitions.ts; the rest is widely established general knowledge.
// Picks are described by how they were chosen from the catalog, never as test results or ratings.

const windowsGuide: GuideDefinition = {
  slug: "best-free-windows-apps",
  title: "Best Free Windows Apps: A Starter Kit",
  section: "apps",
  excerpt: "Twelve free Windows apps from the Gametroz catalog for browsing, video, files, writing, screenshots and security, with licenses and official download links.",
  metaTitle: "Best Free Windows Apps | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: true,
  sortOrder: 33,
  tags: ["windows", "free software", "starter kit"],
  body: [
    {
      type: "answer",
      text: "A good free Windows starter kit includes [Firefox](/app/firefox) for browsing, [VLC Media Player](/app/vlc-media-player) for video, [7-Zip](/app/7zip) for archives, [LibreOffice](/app/libreoffice) for documents and [Bitwarden](/app/bitwarden) for passwords. The full table below adds seven more.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "This is a curated selection, not a ranking and not a test result. Every app below is listed for Windows in the Gametroz catalog and is free according to the license text we publish for it. The list holds one or two apps for each everyday job rather than everything available. Open the [Windows apps page](/apps/windows) to browse the whole catalog.",
    },
    { type: "h2", text: "The starter kit" },
    {
      type: "table",
      caption: "Free Windows apps by job, with the license or pricing we list",
      header: ["App", "Job", "Developer", "License or pricing"],
      rows: [
        ["[Firefox](/app/firefox)", "Web browser", "Mozilla", "Free and open source (MPL-2.0)"],
        ["[VLC Media Player](/app/vlc-media-player)", "Video and audio player", "VideoLAN", "Free and open source (GPL-2.0)"],
        ["[7-Zip](/app/7zip)", "Zip and archive files", "Igor Pavlov", "Free and open source (mostly GNU LGPL, with an unRAR restriction)"],
        ["[LibreOffice](/app/libreoffice)", "Office suite", "The Document Foundation", "Free and open source (MPL-2.0)"],
        ["[Notepad++](/app/notepad-plus-plus)", "Text and code editor", "Don Ho", "Free and open source (GNU GPL)"],
        ["[OBS Studio](/app/obs-studio)", "Screen recording and streaming", "OBS Project", "Free and open source (GPL-2.0)"],
        ["[ShareX](/app/sharex)", "Screenshots", "ShareX Team", "Free and open source (GPL-3.0)"],
        ["[Bitwarden](/app/bitwarden)", "Password manager", "Bitwarden", "Free with paid plans"],
        ["[Everything](/app/everything-search)", "Find files by name", "voidtools", "Free"],
        ["[PowerToys](/app/powertoys)", "Windows utilities", "Microsoft", "Free and open source (MIT)"],
        ["[GIMP](/app/gimp)", "Photo editing", "The GIMP Team", "Free and open source (GPL-3.0)"],
        ["[Thunderbird](/app/thunderbird)", "Email client", "MZLA Technologies", "Free and open source (MPL-2.0)"],
      ],
    },
    { type: "h2", text: "A closer look by job" },
    {
      type: "h3",
      text: "Everyday basics",
    },
    {
      type: "p",
      text: "A browser, a media player and an archive tool cover most of what people do on a new PC. If you want other browsers to compare, read [Best Chrome Alternatives](/guide/best-chrome-alternatives). For video, [Best Free Video Players](/guide/best-free-video-players) compares the main options. [7-Zip](/app/7zip) opens common archive formats; its license text notes a restriction on its unRAR code.",
    },
    {
      type: "h3",
      text: "Writing and editing",
    },
    {
      type: "p",
      text: "[LibreOffice](/app/libreoffice) handles documents, spreadsheets and presentations, and our guide [Best Free Office Suites](/guide/best-free-office-suites) covers other options. [Notepad++](/app/notepad-plus-plus) is a lightweight editor for plain text and code on Windows only; if you write code regularly, see [Best Free Code Editors](/guide/best-free-code-editors).",
    },
    {
      type: "h3",
      text: "Capture and organize",
    },
    {
      type: "p",
      text: "[OBS Studio](/app/obs-studio) records the screen, and [ShareX](/app/sharex) is built for screenshots; [How to Record Your Screen](/guide/how-to-record-your-screen) shows how they fit together. [Everything](/app/everything-search) searches file names across your drives, and [PowerToys](/app/powertoys) bundles small Windows utilities from Microsoft.",
    },
    { type: "h2", text: "Security habits that go with the kit" },
    {
      type: "p",
      text: "Free software is only a bargain when it comes from the right place. Download from the publisher's own site and avoid ad-supported download pages; [How to Download Software Safely](/guide/how-to-download-software-safely) walks through the checks. Pair a password manager with unique passwords, as explained in [Best Free Password Managers](/guide/best-free-password-managers).",
    },
    {
      type: "note",
      title: "Free does not always mean open source",
      text: "Some picks, like Everything, are free but not open source. We list the license text exactly as the catalog states it, so check the publisher's site before you rely on an app for work.",
    },
    { type: "h2", text: "How to build your own list" },
    {
      type: "p",
      text: "Start with the jobs you actually do each week rather than installing everything. For each job, check the platforms, the license text and the developer on the app page, and prefer publishers you can name. Fewer, well-maintained apps are easier to keep updated than a long list, and every app you add is another program that can contain a flaw. Browse the [productivity](/apps/category/productivity) and [utilities](/apps/category/utilities) categories for more ideas.",
    },
    { type: "h2", text: "What to skip" },
    {
      type: "ul",
      items: [
        "Download sites that wrap official installers in their own installer.",
        "Registry cleaners and similar tools that promise to speed up your PC.",
        "Several apps that do the same job, such as two archive tools or two media players, unless you have a reason.",
      ],
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "firefox" },
        { kind: "app", slug: "vlc-media-player" },
        { kind: "app", slug: "7zip" },
        { kind: "app", slug: "libreoffice" },
        { kind: "app", slug: "notepad-plus-plus" },
        { kind: "app", slug: "obs-studio" },
        { kind: "app", slug: "sharex" },
        { kind: "app", slug: "bitwarden" },
        { kind: "app", slug: "everything-search" },
        { kind: "app", slug: "powertoys" },
        { kind: "app", slug: "gimp" },
        { kind: "app", slug: "thunderbird" },
      ],
    },
  ],
};

const macGuide: GuideDefinition = {
  slug: "best-free-mac-apps",
  title: "Best Free Mac Apps: A Starter Kit",
  section: "apps",
  excerpt: "Free Mac apps worth installing, from IINA and Rectangle to The Unarchiver and Raycast, with the license or pricing we list and links to official downloads.",
  metaTitle: "Best Free Mac Apps | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 34,
  tags: ["mac", "macos", "free software"],
  body: [
    {
      type: "answer",
      text: "On a Mac, start with [IINA](/app/iina) for video, [Rectangle](/app/rectangle) for window snapping, [The Unarchiver](/app/the-unarchiver) for archives and [Firefox](/app/firefox) for browsing. Each has a free version, and the table lists the exact license or pricing text we show for each one.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "This is a curated starter list, not a ranking or a test result. Every app is listed for macOS in the Gametroz catalog and has a free version according to our license text. Some are only available on the Mac, which is why they are worth noticing. Browse the full [macOS apps page](/apps/mac) for more.",
    },
    { type: "h2", text: "Free Mac apps by job" },
    {
      type: "table",
      caption: "Free Mac apps with the license or pricing we list",
      header: ["App", "Job", "Developer", "License or pricing"],
      rows: [
        ["[IINA](/app/iina)", "Video player (Mac only)", "IINA Team", "Free and open source (GPL-3.0)"],
        ["[Rectangle](/app/rectangle)", "Window management (Mac only)", "Ryan Hanson", "Free and open source (MIT); a paid Rectangle Pro is also sold"],
        ["[The Unarchiver](/app/the-unarchiver)", "Open archives (Mac only)", "MacPaw", "Free"],
        ["[Raycast](/app/raycast)", "Launcher and shortcuts (Mac only)", "Raycast", "Free with paid plans"],
        ["[Firefox](/app/firefox)", "Web browser", "Mozilla", "Free and open source (MPL-2.0)"],
        ["[VLC Media Player](/app/vlc-media-player)", "Video and audio player", "VideoLAN", "Free and open source (GPL-2.0)"],
        ["[LibreOffice](/app/libreoffice)", "Office suite", "The Document Foundation", "Free and open source (MPL-2.0)"],
        ["[OBS Studio](/app/obs-studio)", "Screen recording", "OBS Project", "Free and open source (GPL-2.0)"],
        ["[HandBrake](/app/handbrake)", "Video converter", "The HandBrake Team", "Free and open source (GPL-2.0)"],
        ["[Bitwarden](/app/bitwarden)", "Password manager", "Bitwarden", "Free with paid plans"],
        ["[Signal](/app/signal)", "Private messaging", "Signal Foundation", "Free and open source (AGPL-3.0)"],
      ],
    },
    { type: "h2", text: "The Mac-only apps" },
    {
      type: "p",
      text: "[IINA](/app/iina) is a video player made specifically for macOS, and it is one of the players compared in [Best Free Video Players](/guide/best-free-video-players). [The Unarchiver](/app/the-unarchiver) opens archive formats that Finder does not handle on its own. [Rectangle](/app/rectangle) snaps windows to halves, thirds and corners of the screen with keyboard shortcuts.",
    },
    {
      type: "p",
      text: "[Raycast](/app/raycast) is a launcher that searches apps and files and runs commands from the keyboard. Its core is free, and paid plans add more; check the publisher's site for what each plan includes before you rely on a feature. Because Rectangle Pro and Raycast paid plans exist, read the pricing text carefully if you need a particular feature.",
    },
    { type: "h2", text: "Cross-platform tools worth having" },
    {
      type: "p",
      text: "Many of the best free apps run on Windows, Mac and Linux alike, so your habits move with you. [LibreOffice](/app/libreoffice) covers documents and spreadsheets; see [Best Free Office Suites](/guide/best-free-office-suites). [OBS Studio](/app/obs-studio) records the screen, although macOS also has a built-in option described in [How to Record Your Screen](/guide/how-to-record-your-screen). [HandBrake](/app/handbrake) converts and shrinks video files.",
    },
    { type: "h2", text: "Installing safely on a Mac" },
    {
      type: "p",
      text: "Most Mac apps arrive as a disk image that you open and drag into the Applications folder. Download from the publisher's own site, and if macOS warns you about an app from an unidentified developer, stop and double-check the source before you proceed. Our guide [How to Download Software Safely](/guide/how-to-download-software-safely) covers the checks.",
    },
    { type: "h2", text: "How to choose between free and paid" },
    {
      type: "p",
      text: "Several apps here pair a free core with an optional paid plan. That model is fine, but it means the feature you want may sit behind the paywall. Before you rely on an app for work, read the pricing text on its app page and the publisher's plan list. Open source licenses such as MIT and GPL describe how the code can be used, while the paid extras are a separate offering from the same developer or a different one.",
    },
    { type: "h2", text: "Mac apps and your other devices" },
    {
      type: "p",
      text: "If you also use an iPhone or Android phone, check the platform column on each app page. [Bitwarden](/app/bitwarden) and [Signal](/app/signal) are listed for both desktop and mobile, so your vault and your chats follow you. Mac-only apps such as IINA, Rectangle and The Unarchiver have no phone version, which is perfectly normal for tools built around the desktop.",
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "iina" },
        { kind: "app", slug: "rectangle" },
        { kind: "app", slug: "the-unarchiver" },
        { kind: "app", slug: "raycast" },
        { kind: "app", slug: "firefox" },
        { kind: "app", slug: "vlc-media-player" },
        { kind: "app", slug: "libreoffice" },
        { kind: "app", slug: "obs-studio" },
        { kind: "app", slug: "handbrake" },
        { kind: "app", slug: "bitwarden" },
        { kind: "app", slug: "signal" },
      ],
    },
  ],
};

const videoGuide: GuideDefinition = {
  slug: "best-free-video-players",
  title: "The Best Free Video Players and VLC Alternatives",
  section: "apps",
  excerpt: "Compare VLC, MPC-HC, IINA, Kodi and Plex, with a note on foobar2000 for music: platforms, licenses and which player fits which job.",
  metaTitle: "Best Free Video Players and VLC Alternatives | Gametroz",
  publishedAt: "2026-09-04",
  updatedAt: "2026-10-02",
  featured: true,
  sortOrder: 30,
  tags: ["video", "players", "vlc alternatives"],
  body: [
    {
      type: "answer",
      text: "[VLC Media Player](/app/vlc-media-player) is the safe default: free, open source and available on every major platform. Choose [MPC-HC](/app/mpc-hc) for a lightweight Windows player, [IINA](/app/iina) on a Mac, and [Kodi](/app/kodi) or [Plex](/app/plex) to organize a media library.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "The players below are the ones in the media category of the Gametroz catalog that play or organize video. The comparison is built from catalog facts such as platforms and license text, not from a test, and the list is not a ranking.",
    },
    { type: "h2", text: "Side-by-side comparison" },
    {
      type: "table",
      caption: "Free players compared by platform, license and purpose",
      header: ["Player", "Platforms", "License or pricing", "Best for"],
      rows: [
        ["[VLC Media Player](/app/vlc-media-player)", "Windows, Mac, Linux, Android, iOS", "Free and open source (GPL-2.0)", "Playing nearly any file on any device"],
        ["[MPC-HC](/app/mpc-hc)", "Windows", "Free and open source (GNU GPL)", "A lightweight Windows player"],
        ["[IINA](/app/iina)", "Mac", "Free and open source (GPL-3.0)", "A player built for macOS"],
        ["[Kodi](/app/kodi)", "Windows, Mac, Linux, Android, iOS", "Free and open source (GPL-2.0)", "A home theater style media center"],
        ["[Plex](/app/plex)", "Windows, Mac, Linux, Android, iOS, web", "Free with optional paid plans", "Organizing and streaming your own library"],
        ["[foobar2000](/app/foobar2000)", "Windows, Mac, Android, iOS", "Free", "Music rather than video"],
      ],
    },
    { type: "h2", text: "What to look for" },
    {
      type: "ul",
      items: [
        "Format support: a player that opens many containers and codecs without extra packs.",
        "Subtitle and audio track controls for movies and shows.",
        "No ads or bundled software, so download from the publisher's own site.",
        "A publisher that keeps the app updated.",
      ],
    },
    { type: "h2", text: "When VLC is the answer" },
    {
      type: "p",
      text: "[VLC](/app/vlc-media-player) is made by VideoLAN, runs on all five of the major platforms we list, and is free and open source. If you have one player on every device, this is it. If you want a different interface or a lighter feel, read on.",
    },
    { type: "h2", text: "VLC alternatives by platform" },
    {
      type: "p",
      text: "On Windows, [MPC-HC](/app/mpc-hc) is a community-maintained fork, listed under the developer name clsid2, that keeps the classic lightweight interface. On a Mac, [IINA](/app/iina) is built for macOS and is Mac only. Neither runs on every platform, which is the main reason many people keep VLC installed as well.",
    },
    { type: "h2", text: "Media centers and servers" },
    {
      type: "p",
      text: "[Kodi](/app/kodi) turns a computer into a media center for your own files and runs on five platforms. [Plex](/app/plex) organizes a library of your own movies and music and lets you play it on other devices; it is free with optional paid plans, so check which features need a plan. These are closer to library managers than simple players.",
    },
    { type: "h2", text: "A note on music" },
    {
      type: "p",
      text: "[foobar2000](/app/foobar2000) is an audio player rather than a video player. It is free and listed for Windows, Mac, Android and iOS. To edit audio, see the [Audacity](/app/audacity) page.",
    },
    { type: "h2", text: "If a file still will not play" },
    {
      type: "p",
      text: "Convert it. [HandBrake](/app/handbrake) converts video into formats that play smoothly on phones and TVs. If you want to record your screen instead of playing a file, read [How to Record Your Screen](/guide/how-to-record-your-screen).",
    },
    { type: "h2", text: "Choosing by situation" },
    {
      type: "ul",
      items: [
        "You have one old PC and want something light: MPC-HC.",
        "You use a Mac and like a native look: IINA.",
        "You want one player that works the same on a laptop and a phone: VLC.",
        "You keep a collection of movies and music and want it organized with artwork: Kodi or Plex.",
        "You mostly listen to music files: foobar2000.",
      ],
    },
    { type: "h2", text: "Tips for smoother playback" },
    {
      type: "p",
      text: "If a video stutters, the file or the hardware is usually the cause, not the player. High-resolution files need a capable processor or graphics chip. Try another player once, close heavy programs, and check whether the video is stored on a slow network drive. Subtitles that do not appear usually mean the subtitle file is not named like the video or is not loaded; every player on the list lets you load one manually.",
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "vlc-media-player" },
        { kind: "app", slug: "mpc-hc" },
        { kind: "app", slug: "iina" },
        { kind: "app", slug: "kodi" },
        { kind: "app", slug: "plex" },
        { kind: "app", slug: "foobar2000" },
        { kind: "app", slug: "handbrake" },
        { kind: "app", slug: "audacity" },
      ],
    },
  ],
};

const officeGuide: GuideDefinition = {
  slug: "best-free-office-suites",
  title: "Best Free Microsoft Office Alternatives",
  section: "apps",
  excerpt: "Write documents and build spreadsheets without a paid subscription: LibreOffice, ONLYOFFICE and Google Docs compared, plus free apps for notes and email.",
  metaTitle: "Best Free Microsoft Office Alternatives | Gametroz",
  publishedAt: "2026-07-12",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 31,
  tags: ["office", "documents", "alternatives"],
  body: [
    {
      type: "answer",
      text: "[LibreOffice](/app/libreoffice) is the most complete free office suite for Windows, Mac and Linux. [ONLYOFFICE](/app/onlyoffice) is another open source suite, and [Google Docs](/app/google-docs) is the choice if you prefer working in a browser.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "These are the free office tools in the Gametroz catalog. Platforms and license text come from our app pages. This is a comparison of facts, not a feature-by-feature test, and it is not a ranking.",
    },
    { type: "h2", text: "Comparison table" },
    {
      type: "table",
      caption: "Free office tools by platform and license",
      header: ["App", "Platforms", "License or pricing", "Developer"],
      rows: [
        ["[LibreOffice](/app/libreoffice)", "Windows, Mac, Linux", "Free and open source (MPL-2.0)", "The Document Foundation"],
        ["[ONLYOFFICE](/app/onlyoffice)", "Windows, Mac, Linux, Android, iOS", "Free and open source (AGPL-3.0)", "Ascensio System SIA"],
        ["[Google Docs](/app/google-docs)", "Android, iOS, web", "Free with a Google account; paid Google Workspace plans add business features", "Google"],
      ],
    },
    { type: "h2", text: "LibreOffice: the full desktop suite" },
    {
      type: "p",
      text: "[LibreOffice](/app/libreoffice) installs on your computer and works offline. It includes a word processor, spreadsheets and presentations, and it can open and save common Microsoft Office file formats. Complex documents with unusual formatting can look slightly different after switching, so open an important file once before you rely on it.",
    },
    { type: "h2", text: "ONLYOFFICE: another open source suite" },
    {
      type: "p",
      text: "[ONLYOFFICE](/app/onlyoffice) is listed for five platforms, including Android and iOS, which makes it a candidate if you want the same tools on your phone. It is open source under AGPL-3.0, and the publisher is Ascensio System SIA.",
    },
    { type: "h2", text: "Google Docs: work in the browser" },
    {
      type: "p",
      text: "[Google Docs](/app/google-docs) runs in a browser and on phones, and it is free with a Google account. Documents live online, which makes sharing and editing together easy but depends on a connection unless you enable offline use in your browser settings.",
    },
    { type: "h2", text: "Which one should you choose?" },
    {
      type: "ul",
      items: [
        "You want an offline desktop suite: LibreOffice.",
        "You want phone apps next to a desktop suite: ONLYOFFICE.",
        "You mostly share documents and collaborate online: Google Docs.",
      ],
    },
    { type: "h2", text: "Notes and email companions" },
    {
      type: "p",
      text: "Office work is more than documents. [Obsidian](/app/obsidian) is free to use with optional paid sync and publish services and stores notes as files, while [Joplin](/app/joplin) is free and open source with an optional paid Joplin Cloud. [Notion](/app/notion) is free with paid plans and combines notes and databases. For email, calendar and contacts, [Thunderbird](/app/thunderbird) is a free, open source desktop client.",
    },
    {
      type: "p",
      text: "If you work with a lot of text, our tools can help too: the [Word Counter](/tool/word-counter) checks length, and [How to Count Words and Characters](/guide/how-to-count-words-and-characters) explains common limits. For more free software to round out a PC, read [Best Free Windows Apps](/guide/best-free-windows-apps).",
    },
    { type: "h2", text: "Moving from Microsoft Office" },
    {
      type: "steps",
      items: [
        "Keep your existing documents and open a few important ones in the new suite before you uninstall anything.",
        "Save in the format your recipients expect, such as docx or xlsx, when you share files.",
        "Check fonts, tables and page breaks in complex documents, since a missing font changes the layout.",
        "Learn where the equivalents of the commands you use live; menus differ between suites.",
        "Export to PDF when the exact appearance matters more than editing.",
      ],
    },
    { type: "h2", text: "Compatibility checklist" },
    {
      type: "ul",
      items: [
        "Word processing: headings, tables, images and comments should survive a round trip.",
        "Spreadsheets: formulas, number formats and charts. Test any macros separately, since they often behave differently between suites.",
        "Presentations: fonts, animations and embedded video are the usual trouble spots.",
        "Shared files: ask collaborators which format they need before you switch.",
      ],
    },
    { type: "h2", text: "Privacy and cost" },
    {
      type: "p",
      text: "Desktop suites such as LibreOffice and ONLYOFFICE keep files on your computer unless you choose to sync them. Browser-based tools store documents with the provider. Neither approach is wrong, but it should be a choice. Also check the pricing text: Google Docs is free with a Google account, and paid Workspace plans add business features, so a team may eventually need one.",
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "libreoffice" },
        { kind: "app", slug: "onlyoffice" },
        { kind: "app", slug: "google-docs" },
        { kind: "app", slug: "obsidian" },
        { kind: "app", slug: "joplin" },
        { kind: "app", slug: "notion" },
        { kind: "app", slug: "thunderbird" },
      ],
    },
  ],
};

const chromeGuide: GuideDefinition = {
  slug: "best-chrome-alternatives",
  title: "Best Chrome Alternatives for Windows, Mac and Phones",
  section: "apps",
  excerpt: "Compare Firefox, Brave, Edge, Opera, Vivaldi, DuckDuckGo Browser and Tor Browser: platforms, licenses and honest notes on who each one suits.",
  metaTitle: "Best Chrome Alternatives | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 35,
  tags: ["browsers", "chrome alternatives", "privacy"],
  body: [
    {
      type: "answer",
      text: "[Firefox](/app/firefox) is the most established non-Chromium alternative, [Brave](/app/brave) and [Vivaldi](/app/vivaldi) are popular Chromium-based options, and [Tor Browser](/app/tor-browser) is for anonymity rather than everyday speed. The table compares them using catalog facts.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "These are the other browsers in the [browsers category](/apps/category/browsers) of the Gametroz catalog. The comparison uses platforms and license text from our app pages and general public knowledge about the browser engines. It is not a speed test and not a ranking.",
    },
    { type: "h2", text: "Comparison table" },
    {
      type: "table",
      caption: "Chrome alternatives by platform and license",
      header: ["Browser", "Platforms", "License or pricing", "Developer"],
      rows: [
        ["[Firefox](/app/firefox)", "Windows, Mac, Linux, Android, iOS", "Free and open source (MPL-2.0)", "Mozilla"],
        ["[Brave](/app/brave)", "Windows, Mac, Linux, Android, iOS", "Free and open source (MPL-2.0)", "Brave Software"],
        ["[Microsoft Edge](/app/microsoft-edge)", "Windows, Mac, Linux, Android, iOS", "Free", "Microsoft"],
        ["[Opera](/app/opera)", "Windows, Mac, Linux, Android, iOS", "Free", "Opera"],
        ["[Vivaldi](/app/vivaldi)", "Windows, Mac, Linux, Android, iOS", "Free", "Vivaldi Technologies"],
        ["[DuckDuckGo Browser](/app/duckduckgo-browser)", "Windows, Mac, Android, iOS", "Free", "DuckDuckGo"],
        ["[Tor Browser](/app/tor-browser)", "Windows, Mac, Linux, Android", "Free and open source (BSD and MPL licenses)", "The Tor Project"],
      ],
    },
    { type: "h2", text: "Why the engine matters" },
    {
      type: "p",
      text: "Chrome, Edge, Brave, Opera and Vivaldi all build on the open source Chromium project, so websites behave very similarly in them and many Chrome extensions work in each. Firefox uses its own engine, which gives the web a second independent implementation. Tor Browser is built on Firefox.",
    },
    { type: "h2", text: "Honest notes on each" },
    {
      type: "ul",
      items: [
        "[Firefox](/app/firefox): run by Mozilla and open source, with its own engine. A good first stop if you want to leave Chrome.",
        "[Brave](/app/brave): open source and Chromium-based, with built-in content blocking. It also includes a rewards and crypto feature that you can ignore.",
        "[Microsoft Edge](/app/microsoft-edge): pre-installed on Windows and Chromium-based, so it is easy to try, though it comes with Microsoft services built in.",
        "[Opera](/app/opera): Chromium-based with extra built-in features such as a sidebar; that suits some people and clutters the window for others.",
        "[Vivaldi](/app/vivaldi): Chromium-based and highly customizable, which appeals to power users and can feel like a lot at first.",
        "[DuckDuckGo Browser](/app/duckduckgo-browser): simple and privacy-focused, but not listed for Linux in our catalog.",
        "[Tor Browser](/app/tor-browser): routes traffic through the Tor network to protect anonymity. Pages load more slowly and some sites restrict Tor users, so it is not a daily replacement for most people.",
      ],
    },
    { type: "h2", text: "Switching without losing your data" },
    {
      type: "steps",
      items: [
        "Install the new browser from its official site; see [How to Download Software Safely](/guide/how-to-download-software-safely).",
        "Import bookmarks, history and passwords from Chrome using the new browser's import option.",
        "Move your passwords into a manager such as [Bitwarden](/app/bitwarden) so they are not tied to one browser; see [Best Free Password Managers](/guide/best-free-password-managers).",
        "Reinstall your extensions and check they work, including an ad blocker such as [uBlock Origin](/app/ublock-origin).",
        "Keep Chrome for a week in case a site misbehaves, then uninstall it if you do not need it.",
      ],
    },
    {
      type: "note",
      title: "Privacy is not magic",
      text: "No browser makes you anonymous by default. A browser can block trackers and limit data collection, but the sites you sign in to still know who you are.",
    },
    { type: "h2", text: "How to pick one in three questions" },
    {
      type: "ol",
      items: [
        "Do you need it on every device? Check the platforms column: DuckDuckGo Browser, for example, is not listed for Linux, and Tor Browser is not listed for iOS.",
        "Do you rely on Chrome extensions? A Chromium-based browser is the closest match, although Firefox has its own extension catalog and many popular extensions exist there too.",
        "What matters most: privacy tools, customization or familiarity? Brave and DuckDuckGo lean toward privacy, Vivaldi toward customization and Edge toward familiarity on Windows.",
      ],
    },
    { type: "h2", text: "Why try an alternative at all" },
    {
      type: "p",
      text: "People switch for different reasons: more control over tracking, a different interface, built-in features, or simply to avoid depending on one company's browser. Because every browser listed is free, trying one costs nothing but a little setup time, and you can keep several installed side by side.",
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "firefox" },
        { kind: "app", slug: "brave" },
        { kind: "app", slug: "microsoft-edge" },
        { kind: "app", slug: "opera" },
        { kind: "app", slug: "vivaldi" },
        { kind: "app", slug: "duckduckgo-browser" },
        { kind: "app", slug: "tor-browser" },
        { kind: "app", slug: "ublock-origin" },
        { kind: "app", slug: "bitwarden" },
      ],
    },
  ],
};

export const appGuides: GuideDefinition[] = [windowsGuide, macGuide, videoGuide, officeGuide, chromeGuide, ...appGuidesMore];
