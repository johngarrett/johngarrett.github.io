import Foundation

let saveLocation = URL(fileURLWithPath: "/Users/garrepi/dev/johngarrett.github.io", isDirectory: true)
let generator = Generator(saveLocation: saveLocation)

generator.generateCommon()
generator.generateBlogs(from: "./blogs")
generator.generateProjects(from: "./projects")
generator.generateCssSheet()
