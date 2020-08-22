// swift-tools-version:5.2
import PackageDescription

let package = Package(
    name: "garrepi.static",
    dependencies: [
        .package(url: "https://github.com/johngarrett/garrepidev", .branch("master"))
    ],
    targets: [
        .target(
            name: "garrepi.static",
            dependencies: ["garrepidev"]
        )
    ]
)
