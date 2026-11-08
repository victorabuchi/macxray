// The scenes of the website's two films, each playing real screenshots of MacXray (scripts/film-shots.mjs):
//   frames  [at ms, picture]                     which picture shows from that moment
//   beats   [at ms, target, press ms, label]     where the cursor rests (a box in the picture; null hides it), and
//                                                what it's pointing at, in a label beside it
// Paced like a product video you can follow: a scene every eight to eleven seconds, a new picture every four or five.
window.MACXRAY_SCENES = {
  // The film at the top of the page: what your Mac is doing.
  main: [
    {
      id: "now", tab: "Now", title: "Your whole Mac, in one look.",
      caption: "An x-ray of your Mac: the chip's cores, the memory, the battery's cells, the network and the disk, each lit by a live reading, with one sentence that sums it all up.",
      dur: 8600, glow: "#2a78d6",
      frames: [[0, "now"]],
      beats: [[0, null], [600, "headline", 0, "Your Mac in one sentence"], [2800, "chip", 0, "Every core, live"], [5000, "cells", 0, "Inside the battery"], [7600, null]],
    },
    {
      id: "clipboard", tab: "Clipboard", title: "Everything you copy, kept.",
      caption: "Every copy in full, in every format it was stored in, with images exactly as copied. Click an older copy to see all of it and copy it again.",
      dur: 10600, glow: "#2a78d6",
      frames: [[0, "clipboard"], [5000, "clipboard-note"]],
      beats: [[0, null], [600, "latest", 0, "The latest copy, from Safari"], [2200, "image", 0, "Exactly as copied"], [3600, "noteCard", 0, "An older copy"], [4500, "noteCard", 250, "An older copy"],
        [6200, "copyAgain", 0, "Copy it again"], [7400, "copyAgain", 250, "Copy it again"], [9800, null]],
    },
    {
      id: "keyboard", tab: "Keyboard", title: "From key to app.",
      caption: "How your keyboard is connected, the path each keypress takes, and every program listening on the way. MacXray sees when a key goes down, never which key.",
      dur: 10400, glow: "#eda100",
      frames: [[0, "keyboard"], [5600, "keyboard-listeners"]],
      beats: [[0, null], [600, "keyboardNode", 0, "Wired inside the Mac"], [2200, "listener", 0, "Listening on the way"], [3800, "appNode", 0, "The app that gets the key"],
        [6000, "listenerRow", 0, "What each listener wants"], [7800, "secure", 0, "Hidden while you type a password"], [9600, null]],
    },
    {
      id: "processes", tab: "Processes", title: "Every program, explained.",
      caption: "Your Mac runs hundreds of programs; you opened a handful. Click any block below the waterline to learn what it is and why it's running.",
      dur: 9600, glow: "#eb6834",
      frames: [[0, "processes"], [4600, "processes-explain"]],
      beats: [[0, null], [600, "iceberg", 0, "Each app and its hidden helpers"], [2400, "helper", 0, "What is this?"], [3600, "helper", 250, "What is this?"],
        [5400, "explained", 0, "Explained in plain English"], [8800, null]],
    },
    {
      id: "files", tab: "Files", title: "The disk's heartbeat.",
      caption: "Every change to every file, sorted into your files, app data, caches, settings and logs, and which app is writing. MacXray never reads what's inside.",
      dur: 7800, glow: "#1baf7a",
      frames: [[0, "files"]],
      beats: [[0, null], [600, "lanes", 0, "Thousands of changes a minute"], [3600, "writers", 0, "Who's writing"], [7000, null]],
    },
    {
      id: "network", tab: "Network", title: "Who your Mac talks to.",
      caption: "Every connection, from the app that opened it to the company on the other end. Click one to see whether anyone along the way could read it.",
      dur: 9600, glow: "#eda100",
      frames: [[0, "network"], [4800, "network-explain"]],
      beats: [[0, null], [600, "topApp", 0, "The apps talking"], [2400, "yourMac", 0, "Through your Mac"], [5600, "canSee", 0, "Can anyone see this?"], [8800, null]],
    },
  ],
  // The second film, further down: the radios, the hardware and macOS's own diary.
  more: [
    {
      id: "wireless", tab: "Wireless", title: "Your radios, read out.",
      caption: "Wi-Fi's signal and noise on a scale, its channel and speed, phone hotspots, AirDrop's private link, the Bluetooth devices connected, and how a Mac with no GPS knows where it is.",
      dur: 10400, glow: "#6250d6",
      frames: [[0, "wireless"], [5400, "wireless-more"]],
      beats: [[0, null], [600, "signal", 0, "Signal strength"], [2200, "noise", 0, "The noise floor"], [3800, "router", 0, "Your router"],
        [6000, "bluetooth", 0, "Bluetooth devices"], [7800, "location", 0, "How a Mac knows where it is"], [9600, null]],
    },
    {
      id: "sound", tab: "Sound", title: "Microphone, camera and speakers.",
      caption: "Which app is using the microphone, whether the camera is on, and what's playing through which speakers. MacXray never listens or watches.",
      dur: 9400, glow: "#eb6834",
      frames: [[0, "sound"], [5200, "sound-how"]],
      beats: [[0, null], [600, "mic", 0, "The microphone"], [2200, "camera", 0, "The cameras"], [3800, "speakers", 0, "Where sound comes out"], [5800, "how", 0, "How a voice becomes numbers"], [8600, null]],
    },
    {
      id: "cpu", tab: "CPU cores", title: "Inside the chip.",
      caption: "Every core's load, second by second: the fast cores and the Efficiency cores, the graphics, and how warm macOS thinks the chip is.",
      dur: 8000, glow: "#e87ba4",
      frames: [[0, "cpu"]],
      beats: [[0, null], [600, "chipTitle", 0, "The chip, mapped"], [2600, "core", 0, "Every core, live"], [4800, "gpu", 0, "The graphics"], [7200, null]],
    },
    {
      id: "memory", tab: "Memory", title: "Where your memory went.",
      caption: "Every block of memory coloured by what it holds, how much macOS squeezed instead of using the disk, and the pressure it feels.",
      dur: 8000, glow: "#1baf7a",
      frames: [[0, "memory"]],
      beats: [[0, null], [600, "ram", 0, "Every block of memory"], [3000, "pressure", 0, "Memory pressure"], [5000, "squeeze", 0, "Squeezed, not swapped"], [7200, null]],
    },
    {
      id: "battery", tab: "Battery", title: "Energy in and out.",
      caption: "Power flowing between the charger, the Mac and the battery, its health and charge cycles, and the battery chip's own readings, translated.",
      dur: 9600, glow: "#6250d6",
      frames: [[0, "battery"], [5000, "battery-raw"]],
      beats: [[0, null], [600, "mac", 0, "What your Mac uses"], [2200, "battery", 0, "The battery's cells"], [3800, "health", 0, "Its health"], [5600, "raw", 0, "The raw numbers, decoded"], [8800, null]],
    },
    {
      id: "log", tab: "System log", title: "macOS's diary, translated.",
      caption: "Thousands of entries a second, grouped by the part of macOS writing them, with errors counted and what each part does explained.",
      dur: 8000, glow: "#e34948",
      frames: [[0, "log"]],
      beats: [[0, null], [600, "logChart", 0, "Entries every second"], [2800, "talking", 0, "Who's talking"], [5000, "whatFor", 0, "What it's for"], [7200, null]],
    },
  ],
};
