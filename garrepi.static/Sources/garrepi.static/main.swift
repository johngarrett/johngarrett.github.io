import Foundation

print("Hello, world!")

let saveLocation = URL(fileURLWithPath: "/Users/garrepi/dev/johngarrett.github.io", isDirectory: true)
let generator = Generator(saveLocation: saveLocation)

generator.generateCss()
generator.generateCommon()
generator.generateBlogs(from: "./blogs")
generator.generateProjects(from: "./projects")
