// swift-tools-version:5.9
import PackageDescription

// MacMemory: how MacXray reads your Mac's memory, free to use.
let package = Package(
    name: "MacMemory",
    platforms: [.macOS(.v13)],
    products: [.library(name: "MacMemory", targets: ["MacMemory"])],
    targets: [.target(name: "MacMemory")]
)
