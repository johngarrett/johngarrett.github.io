import Foundation

print("Hello, world!")

let saveLocation = URL(fileURLWithPath: "~/dev/johngarrett.github.io", isDirectory: true)
    let generator = Generator(saveLocation: saveLocation)
    generator.generateCommon()
    generator.generateBlogs(from: "./blogs")
    generator.generateProjects(from: "./projects")
