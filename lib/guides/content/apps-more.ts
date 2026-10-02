import type { GuideDefinition } from "../definitions";

// More software guides (see apps.ts). App facts come from lib/apps/definitions.ts.

const codeEditorsGuide: GuideDefinition = {
  slug: "best-free-code-editors",
  title: "Best Free Code Editors for Beginners and Pros",
  section: "apps",
  excerpt: "Compare Visual Studio Code, Notepad++ and Sublime Text, with a note on Android Studio as a full IDE: platforms, licenses and who each editor suits.",
  metaTitle: "Best Free Code Editors | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 36,
  tags: ["code editor", "development", "ide"],
  body: [
    {
      type: "answer",
      text: "[Visual Studio Code](/app/visual-studio-code) is the best starting point for most people: free, on Windows, Mac, Linux and the web. Pick [Notepad++](/app/notepad-plus-plus) for a light Windows editor, and note that [Sublime Text](/app/sublime-text) requires a paid license for continued use.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "These are the editors in the development category of the Gametroz catalog. The comparison uses platforms and license text from our app pages, not a performance test, and it is not a ranking. Browse every developer app in the [development category](/apps/category/development).",
    },
    { type: "h2", text: "Comparison table" },
    {
      type: "table",
      caption: "Editors compared by platform and license",
      header: ["Editor", "Platforms", "License or pricing", "Developer"],
      rows: [
        ["[Visual Studio Code](/app/visual-studio-code)", "Windows, Mac, Linux, web", "Free", "Microsoft"],
        ["[Notepad++](/app/notepad-plus-plus)", "Windows", "Free and open source (GNU GPL)", "Don Ho"],
        ["[Sublime Text](/app/sublime-text)", "Windows, Mac, Linux", "Free to evaluate; a paid license is required for continued use", "Sublime HQ"],
        ["[Android Studio](/app/android-studio)", "Windows, Mac, Linux", "Free", "Google"],
      ],
    },
    { type: "h2", text: "Editor or IDE?" },
    {
      type: "p",
      text: "A code editor opens files, highlights syntax and helps you type quickly. An integrated development environment, or IDE, adds tools for building, running and debugging a specific kind of project. Editors are lighter and more flexible; IDEs are heavier and more specialized. [Android Studio](/app/android-studio) is the IDE in this list and is aimed at building Android apps, so it is not the first choice for a quick script or a web page.",
    },
    { type: "h2", text: "When to choose each" },
    {
      type: "ul",
      items: [
        "[Visual Studio Code](/app/visual-studio-code): a general-purpose editor for web, scripting and many other languages. It runs on all three desktop systems and also has a web version.",
        "[Notepad++](/app/notepad-plus-plus): quick edits to text, logs and config files on Windows. It is open source and has no Mac or Linux version.",
        "[Sublime Text](/app/sublime-text): a fast editor you can evaluate for free, but the catalog notes that continued use needs a paid license, so budget for it if you adopt it.",
        "[Android Studio](/app/android-studio): choose it when your project is an Android app.",
      ],
    },
    { type: "h2", text: "Tools that go with an editor" },
    {
      type: "p",
      text: "Most projects need version control. [Git](/app/git) tracks changes and [GitHub Desktop](/app/github-desktop) gives it a visual interface on Windows and Mac. Runtimes such as [Node.js](/app/nodejs) and [Python](/app/python) are free and open source. For testing APIs, [Postman](/app/postman) has a free plan with paid tiers.",
    },
    { type: "h2", text: "Online helpers for daily coding" },
    {
      type: "p",
      text: "A few small web tools save time while you code. The [JSON Formatter & Validator](/tool/json-formatter) cleans up data, the [Unix Timestamp Converter](/tool/timestamp-converter) decodes dates, and [Best Free Online Developer Tools](/guide/best-free-online-developer-tools) lists the rest. If you write on Windows, see [Best Free Windows Apps](/guide/best-free-windows-apps) for the wider starter kit.",
    },
    { type: "h2", text: "Install and set up" },
    {
      type: "steps",
      items: [
        "Download the editor from its official site; see [How to Download Software Safely](/guide/how-to-download-software-safely).",
        "Open a folder with your project instead of a single file.",
        "Install only the extensions or plugins you actually need.",
        "Learn a handful of shortcuts: find, replace, comment a line and jump to a file.",
      ],
    },
    { type: "h2", text: "Choosing a first editor" },
    {
      type: "p",
      text: "If you are just starting, pick one editor and stay with it for a few weeks. Switching constantly costs more time than any difference between editors. A broad editor such as Visual Studio Code suits most languages. If you only want to read and edit plain text, logs or configuration files, a light tool like Notepad++ opens quickly and stays out of the way.",
    },
    { type: "h2", text: "Free, open source and paid" },
    {
      type: "p",
      text: "Free means you do not pay; open source means the source code is public under a license. Notepad++ is both according to our license text, while Visual Studio Code is free. Sublime Text sits in a third group, free to evaluate but needing a paid license for continued use. None of these labels says which editor is better. They only tell you what you may do with it and what it might cost.",
    },
    {
      type: "items",
      title: "Apps in this guide",
      refs: [
        { kind: "app", slug: "visual-studio-code" },
        { kind: "app", slug: "notepad-plus-plus" },
        { kind: "app", slug: "sublime-text" },
        { kind: "app", slug: "android-studio" },
        { kind: "app", slug: "git" },
        { kind: "app", slug: "github-desktop" },
        { kind: "app", slug: "nodejs" },
        { kind: "app", slug: "python" },
        { kind: "app", slug: "postman" },
      ],
    },
  ],
};

const passwordManagersGuide: GuideDefinition = {
  slug: "best-free-password-managers",
  title: "Best Free Password Managers and 2FA Apps",
  section: "apps",
  excerpt: "Compare Bitwarden, KeePassXC and Proton Pass by platform, license and where your vault lives, and add an authenticator app as a second layer of protection.",
  metaTitle: "Best Free Password Managers | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 37,
  tags: ["password manager", "security", "2fa"],
  body: [
    {
      type: "answer",
      text: "[Bitwarden](/app/bitwarden) and [Proton Pass](/app/proton-pass) sync across devices and have free tiers, while [KeePassXC](/app/keepassxc) is free, open source and keeps your vault in a file you control. Add an authenticator app for two-factor codes.",
    },
    { type: "h2", text: "How these were picked" },
    {
      type: "p",
      text: "These are the password managers in the security category of the Gametroz catalog. The comparison uses platforms and license text from our app pages. It is not a security audit, and it is not a ranking. See the full list in the [security category](/apps/category/security).",
    },
    { type: "h2", text: "Comparison table" },
    {
      type: "table",
      caption: "Free password managers by platform and license",
      header: ["Manager", "Platforms", "License or pricing", "Developer"],
      rows: [
        ["[Bitwarden](/app/bitwarden)", "Windows, Mac, Linux, Android, iOS, web", "Free with paid plans; open-source apps (GPL-3.0)", "Bitwarden"],
        ["[KeePassXC](/app/keepassxc)", "Windows, Mac, Linux", "Free and open source (GPL-2.0 or GPL-3.0)", "KeePassXC Team"],
        ["[Proton Pass](/app/proton-pass)", "Windows, Mac, Linux, Android, iOS, web", "Free with paid plans", "Proton AG"],
      ],
    },
    { type: "h2", text: "Where your vault lives" },
    {
      type: "p",
      text: "A password manager keeps your logins in an encrypted vault protected by one master password. The main difference between managers is where the vault is stored. Bitwarden and Proton Pass run as services that sync your vault between devices, which is convenient and works on phones and in the browser. KeePassXC works with a database file on your own computer, which gives you control but means you must arrange your own backups and syncing, for example through a cloud drive.",
    },
    { type: "h2", text: "Which one fits you?" },
    {
      type: "ul",
      items: [
        "You want the same logins on every device with little setup: Bitwarden or Proton Pass.",
        "You want to keep everything in a local file and manage syncing yourself: KeePassXC.",
        "You care that the code is open: Bitwarden's apps and KeePassXC are open source according to our license text.",
        "You already use Proton for email or storage: Proton Pass fits into the same account.",
      ],
    },
    { type: "h2", text: "Add two-factor authentication" },
    {
      type: "p",
      text: "A password alone can be stolen. Two-factor authentication adds a second step, usually a short code that changes every thirty seconds or so. Authenticator apps generate those codes on your phone. Our catalog lists [Google Authenticator](/app/google-authenticator) and [Microsoft Authenticator](/app/microsoft-authenticator), both free and both listed for Android and iOS. Whichever you choose, keep the recovery codes the service gives you in a safe place, because losing your phone without them can lock you out.",
    },
    { type: "h2", text: "What a manager cannot do" },
    {
      type: "p",
      text: "A manager protects your passwords, not your judgment. It will not stop you from approving a fake login page, and a weak master password weakens the whole vault. Keep the software updated, lock the vault when you step away, and be careful about which devices you sign in on.",
    },
    { type: "h2", text: "Set up a manager step by step" },
    {
      type: "steps",
      items: [
        "Install the app or extension from the publisher's official site; see [How to Download Software Safely](/guide/how-to-download-software-safely).",
        "Choose a long, unique master password or passphrase, and do not reuse it anywhere.",
        "Create new passwords with the manager, or with the [Password Generator](/tool/password-generator).",
        "Change the passwords of your most important accounts first: email, banking and your main phone account.",
        "Turn on two-factor authentication for those accounts.",
      ],
    },
    {
      type: "p",
      text: "For the principles behind a strong password, read [How to Generate a Strong Password](/guide/how-to-generate-a-strong-password). Switching browsers? Moving your logins into a manager first makes that easier, as described in [Best Chrome Alternatives](/guide/best-chrome-alternatives).",
    },
    { type: "h2", text: "Common questions" },
    {
      type: "h3",
      text: "What if I forget the master password?",
    },
    {
      type: "p",
      text: "Many managers cannot recover the vault for you, because the master password is what decrypts it. Read the recovery options when you set up, and store any emergency kit or recovery code somewhere safe and offline.",
    },
    {
      type: "h3",
      text: "Is a password manager safer than my browser?",
    },
    {
      type: "p",
      text: "Both can store passwords. A dedicated manager usually adds features such as password generation, secure sharing options and support across several browsers and devices. Whichever you use, protect it with a strong master password and two-factor authentication.",
    },
    {
      type: "items",
      title: "Apps and tools in this guide",
      refs: [
        { kind: "app", slug: "bitwarden" },
        { kind: "app", slug: "keepassxc" },
        { kind: "app", slug: "proton-pass" },
        { kind: "app", slug: "google-authenticator" },
        { kind: "app", slug: "microsoft-authenticator" },
        { kind: "tool", slug: "password-generator" },
      ],
    },
  ],
};

const safeDownloadGuide: GuideDefinition = {
  slug: "how-to-download-software-safely",
  title: "How to Download Software Safely",
  section: "apps",
  excerpt: "Get software from the publisher or an official app store, check the web address, dodge fake download buttons and bundled installers, and verify what you got.",
  metaTitle: "How to Download Software Safely | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 38,
  tags: ["safety", "downloads", "security"],
  body: [
    {
      type: "answer",
      text: "Download software only from the publisher's own website or an official app store, type or check the address yourself, and ignore ads and mirror sites. Every app page on Gametroz links to the publisher's official site.",
    },
    { type: "h2", text: "Why downloads go wrong" },
    {
      type: "p",
      text: "Popular free programs are a favorite disguise for unwanted software. Search results and ads can place a fake site above the real one. A page may show several big Download buttons, only one of which is real, and an installer may bundle extra toolbars, browser changes or programs you never asked for. The fix is mostly about where you start, not about technical skill.",
    },
    { type: "h2", text: "A checklist before you click Download" },
    {
      type: "steps",
      items: [
        "Start from the publisher's official site, or from an official store such as Google Play, the App Store, the Microsoft Store or the Mac App Store.",
        "Read the web address letter by letter. Look-alike domains swap characters or add extra words.",
        "Check for https and the exact domain, but remember that a padlock only means the connection is encrypted, not that the site is trustworthy.",
        "Ignore sponsored results, banner ads and buttons labeled Download or Start now that sit inside advertisements.",
        "Pick the build for your operating system and, if offered, the version from the publisher's own download page.",
      ],
    },
    { type: "h2", text: "Official sources for examples from our catalog" },
    {
      type: "table",
      caption: "Official domains of a few popular free apps, from our catalog",
      header: ["App", "Official site", "Platforms"],
      rows: [
        ["[VLC Media Player](/app/vlc-media-player)", "videolan.org", "Windows, Mac, Linux, Android, iOS"],
        ["[7-Zip](/app/7zip)", "7-zip.org", "Windows"],
        ["[OBS Studio](/app/obs-studio)", "obsproject.com", "Windows, Mac, Linux"],
        ["[Firefox](/app/firefox)", "firefox.com", "Windows, Mac, Linux, Android, iOS"],
        ["[LibreOffice](/app/libreoffice)", "libreoffice.org", "Windows, Mac, Linux"],
      ],
    },
    { type: "h2", text: "Watch the installer" },
    {
      type: "ul",
      items: [
        "Choose custom or advanced install when offered and read each screen.",
        "Decline optional extras, such as extra browsers, search engine changes or trial software.",
        "Be suspicious of an installer that is tiny and downloads the real program later from an unknown address.",
        "On Windows, check that the publisher name in the permission prompt matches the developer you expect.",
      ],
    },
    { type: "h2", text: "Verify a file if the publisher offers a checksum" },
    {
      type: "p",
      text: "Some publishers list a hash, such as SHA-256, next to each download. Compute the hash of the file you downloaded with the [Hash Generator](/tool/hash-generator), which can hash a file locally in your browser, and compare it with the published value. If they differ, delete the file and download it again from the official page.",
    },
    { type: "h2", text: "After installing" },
    {
      type: "ul",
      items: [
        "Open the program once and confirm it is what you expected.",
        "Remove anything you did not choose, such as a changed home page.",
        "Keep apps updated from within the app or from the store.",
        "Uninstall apps you no longer use.",
      ],
    },
    {
      type: "p",
      text: "Looking for safe starting points? Browse the [Windows](/apps/windows) and [macOS](/apps/mac) app pages, or read [Best Free Windows Apps](/guide/best-free-windows-apps) and [Best Free Mac Apps](/guide/best-free-mac-apps). A password manager from [Best Free Password Managers](/guide/best-free-password-managers) also helps you avoid typing credentials into look-alike pages.",
    },
    {
      type: "note",
      title: "Gametroz is not the publisher",
      text: "Gametroz does not host software files. Our app pages link to the publisher's official site, and Gametroz is not affiliated with a publisher unless explicitly stated.",
    },
    { type: "h2", text: "Red flags on a download page" },
    {
      type: "ul",
      items: [
        "A site that wants you to disable your antivirus or security prompts.",
        "A page that promises a free copy of paid software, a crack or a keygen. Those files are a common way to spread malware.",
        "A download that arrives as a zip with a single executable and a password written on the page.",
        "Countdown timers or pop-ups that push you to click quickly.",
        "A file extension that does not match the platform, such as an exe for a Mac.",
      ],
    },
    { type: "h2", text: "If you already installed something suspicious" },
    {
      type: "p",
      text: "Disconnect from the internet if you can, uninstall the program from your system settings, and run a scan with your operating system's built-in security tool. Change passwords for important accounts from a different, clean device, and turn on two-factor authentication. If the program asked for administrator access or changed your browser, restore the browser settings and remove unknown extensions.",
    },
    {
      type: "items",
      title: "Apps and tools in this guide",
      refs: [
        { kind: "app", slug: "vlc-media-player" },
        { kind: "app", slug: "7zip" },
        { kind: "app", slug: "obs-studio" },
        { kind: "app", slug: "firefox" },
        { kind: "app", slug: "libreoffice" },
        { kind: "tool", slug: "hash-generator" },
      ],
    },
  ],
};

const recordScreenGuide: GuideDefinition = {
  slug: "how-to-record-your-screen",
  title: "How to Record Your Screen for Free",
  section: "apps",
  excerpt: "Record tutorials, gameplay or meetings with built-in Windows and Mac tools or free apps such as OBS Studio, and take screenshots with ShareX or Flameshot.",
  metaTitle: "How to Record Your Screen for Free | Gametroz",
  publishedAt: "2026-09-26",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 32,
  tags: ["recording", "obs", "screenshots"],
  body: [
    {
      type: "answer",
      text: "For a quick clip, use the built-in tool: Windows Snipping Tool or Xbox Game Bar, or Shift+Command+5 on a Mac. For longer, polished recordings with audio mixing, use [OBS Studio](/app/obs-studio), which is free and open source.",
    },
    { type: "h2", text: "Choose the right tool" },
    {
      type: "table",
      caption: "Recording and screenshot options",
      header: ["Option", "Platforms", "Good for"],
      rows: [
        ["Windows built-in tools (Snipping Tool, Xbox Game Bar)", "Windows", "Quick clips and screenshots without installing anything"],
        ["macOS Screenshot toolbar", "Mac", "Quick clips and screenshots without installing anything"],
        ["[OBS Studio](/app/obs-studio)", "Windows, Mac, Linux", "Long recordings, scenes, microphone and system audio"],
        ["[ShareX](/app/sharex)", "Windows", "Screenshots and quick captures with sharing options"],
        ["[Flameshot](/app/flameshot)", "Windows, Mac, Linux", "Screenshots you annotate right away"],
      ],
    },
    { type: "h2", text: "Built-in options" },
    {
      type: "p",
      text: "On a Mac, press Shift+Command+5 to open the Screenshot toolbar, which can capture the whole screen, a window or a selected area, and can record the screen. On Windows, press Win+Shift+S for the snipping overlay for screenshots. Recent versions of the Snipping Tool also include a screen recording option, and Xbox Game Bar, opened with Win+G, can record the active app window. Available features depend on your system version, so check what your computer offers.",
    },
    { type: "h2", text: "Record with OBS Studio step by step" },
    {
      type: "steps",
      items: [
        "Download [OBS Studio](/app/obs-studio) from the official site; see [How to Download Software Safely](/guide/how-to-download-software-safely).",
        "In the Sources panel, add a Display Capture source for the whole screen, or a Window Capture source for one app.",
        "Check the Audio Mixer: your microphone should move when you speak.",
        "Press Start Recording, do your task, then press Stop Recording.",
        "Open the output folder from the File menu to find the video.",
      ],
    },
    {
      type: "note",
      title: "Permissions on a Mac",
      text: "macOS asks you to grant screen recording permission to an app the first time it records. If the recording is black, check the Privacy and Security settings and restart the app.",
    },
    { type: "h2", text: "Screenshots: ShareX and Flameshot" },
    {
      type: "p",
      text: "[ShareX](/app/sharex) is a free Windows tool for screenshots, with capture and sharing options. [Flameshot](/app/flameshot) is a free, open source screenshot tool for Windows, Mac and Linux that lets you draw arrows, boxes and text on the capture before you save it. Neither replaces a video recorder, but both save time for step-by-step instructions.",
    },
    { type: "h2", text: "Choosing what to capture" },
    {
      type: "p",
      text: "Decide before you record whether you need the entire display, one window or a region. A single window keeps notifications and other apps out of the picture, while the full display suits a walkthrough that moves between programs. Smaller capture areas also produce smaller files.",
    },
    { type: "h2", text: "Tips for a good recording" },
    {
      type: "ul",
      items: [
        "Close notifications and private windows first.",
        "Record a short test to check the sound before the real take.",
        "Match the recording resolution to your screen so text stays sharp.",
        "Do one task per recording; short clips are easier to share.",
      ],
    },
    { type: "h2", text: "Edit, convert and share" },
    {
      type: "p",
      text: "Long recordings can be large. [HandBrake](/app/handbrake) converts video into smaller files that are easier to send, and [Audacity](/app/audacity) cleans up a voice-over. To play the result, see [Best Free Video Players](/guide/best-free-video-players). For still images from your recording, shrink them with the [Image Compressor](/tool/image-compressor); the guide [How to Compress Images](/guide/how-to-compress-images) explains how.",
    },
    { type: "h2", text: "Audio: microphone and system sound" },
    {
      type: "p",
      text: "Recordings usually need one or both of two audio sources: your microphone for narration and the computer's own sound for games, videos and app alerts. Capturing system audio is straightforward on Windows with OBS Studio, while on a Mac it can need extra setup, so test a short clip first. If your voice sounds quiet or noisy, use headphones to avoid echo, speak close to the microphone and tidy the audio afterward.",
    },
    { type: "h2", text: "Privacy before you press record" },
    {
      type: "p",
      text: "A screen recording captures everything visible, including notifications, tabs, file names and sometimes passwords as you type them. Hide the bookmarks bar, switch on a do-not-disturb mode, close private windows and record only the window or area you need. Review the clip before you share it and trim anything that should not be there.",
    },
    {
      type: "items",
      title: "Apps and tools in this guide",
      refs: [
        { kind: "app", slug: "obs-studio" },
        { kind: "app", slug: "sharex" },
        { kind: "app", slug: "flameshot" },
        { kind: "app", slug: "handbrake" },
        { kind: "app", slug: "audacity" },
        { kind: "tool", slug: "image-compressor" },
      ],
    },
  ],
};

export const appGuidesMore: GuideDefinition[] = [codeEditorsGuide, passwordManagersGuide, safeDownloadGuide, recordScreenGuide];
